const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../backend/src/server');
const { pool } = require('../../backend/src/config/db');
const { hashPassword, generateToken } = require('../../backend/src/utils/passwordUtils');
require('dotenv').config({ path: './backend/src/.env' });

chai.use(chaiHttp);
const expect = chai.expect;

describe('Jewellery API', () => {
  let adminToken;
  let adminUserId;
  let categoryId;
  let testJewelleryId;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

  before(async () => {
    // Clear and set up admin user
    await pool.query('DELETE FROM users WHERE username = ?', [adminUsername]);
    const adminPasswordHash = await hashPassword(adminPassword);
    const [userResult] = await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [adminUsername, adminPasswordHash, 'admin']);
    adminUserId = userResult.insertId;
    adminToken = generateToken(adminUserId, 'admin');

    // Create a category for testing
    await pool.query('DELETE FROM categories WHERE name = ?', ['Test Category']);
    const [categoryResult] = await pool.query('INSERT INTO categories (name) VALUES (?)', ['Test Category']);
    categoryId = categoryResult.insertId;

    // Clean up existing test jewellery
    await pool.query('DELETE FROM jewellery WHERE design_code = ?', ['TEST_J001']);
  });

  after(async () => {
    // Clean up
    await pool.query('DELETE FROM jewellery WHERE design_code = ?', ['TEST_J001']);
    await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    await pool.query('DELETE FROM users WHERE id = ?', [adminUserId]);
  });

  describe('POST /api/jewellery', () => {
    it('should create a new jewellery item (Admin only)', (done) => {
      chai.request(app)
        .post('/api/jewellery')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          design_code: 'TEST_J001',
          name: 'Test Gold Ring',
          description: 'A beautiful test gold ring',
          metal_type: 'Gold',
          expected_weight_min: 5.0,
          expected_weight_max: 6.0,
          image_url: 'http://example.com/test_ring.jpg',
          category_id: categoryId,
          occasion: 'Daily Wear',
          is_trending: true,
          is_lightweight: false
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Jewellery created successfully');
          expect(res.body.jewellery).to.have.property('id');
          testJewelleryId = res.body.jewellery.id;
          done();
        });
    });

    it('should return 401 if no token is provided', (done) => {
      chai.request(app)
        .post('/api/jewellery')
        .send({
          design_code: 'TEST_J002',
          name: 'Unauthorized Ring',
          metal_type: 'Gold',
          category_id: categoryId,
          image_url: 'http://example.com/unauth.jpg'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message').eql('Authentication token required');
          done();
        });
    });

    it('should return 403 if user is not admin', async () => {
      // Create a non-admin user
      const userPasswordHash = await hashPassword('userpassword');
      const [userResult] = await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['normaluser', userPasswordHash, 'user']);
      const normalUserToken = generateToken(userResult.insertId, 'user');

      const res = await chai.request(app)
        .post('/api/jewellery')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({
          design_code: 'TEST_J003',
          name: 'Normal User Ring',
          metal_type: 'Gold',
          category_id: categoryId,
          image_url: 'http://example.com/normal.jpg'
        });
      
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('message').eql('Not authorized to access this resource: Insufficient permissions');

      // Clean up normal user
      await pool.query('DELETE FROM users WHERE id = ?', [userResult.insertId]);
    });

    it('should return 400 for invalid input (missing required field)', (done) => {
      chai.request(app)
        .post('/api/jewellery')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete Ring',
          metal_type: 'Gold',
          category_id: categoryId
          // design_code is missing
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').contains('"design_code" is required');
          done();
        });
    });
  });

  describe('GET /api/jewellery', () => {
    it('should get all jewellery items', (done) => {
      chai.request(app)
        .get('/api/jewellery')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1); // At least the one we created
          expect(res.body[0]).to.have.property('category_name'); // Check for joined category data
          done();
        });
    });

    it('should filter jewellery by metal_type', (done) => {
      chai.request(app)
        .get('/api/jewellery?metal_type=Gold')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.every(item => item.metal_type === 'Gold')).to.be.true;
          done();
        });
    });

    it('should filter jewellery by category', (done) => {
      chai.request(app)
        .get(`/api/jewellery?category=Test Category`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.every(item => item.category_name === 'Test Category')).to.be.true;
          expect(res.body.length).to.be.at.least(1);
          done();
        });
    });

    it('should filter jewellery by occasion', (done) => {
        chai.request(app)
          .get(`/api/jewellery?occasion=Daily Wear`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.every(item => item.occasion === 'Daily Wear')).to.be.true;
            done();
          });
      });

      it('should filter jewellery by weight range (Under 5 grams)', (done) => {
        // First create an item specifically for this filter
        chai.request(app)
          .post('/api/jewellery')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            design_code: 'TEST_LWT001',
            name: 'Lightweight Silver Ring',
            metal_type: 'Silver',
            expected_weight_min: 3.0,
            expected_weight_max: 4.5,
            image_url: 'http://example.com/lwt_ring.jpg',
            category_id: categoryId,
            occasion: 'Daily Wear',
            is_lightweight: true
          })
          .end((err, res) => {
            expect(res).to.have.status(201);
            chai.request(app)
              .get('/api/jewellery?weight_range=Under 5 grams')
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.some(item => item.design_code === 'TEST_LWT001')).to.be.true;
                // Clean up the created item
                pool.query('DELETE FROM jewellery WHERE design_code = ?', ['TEST_LWT001']);
                done();
              });
          });
      });
  });

  describe('GET /api/jewellery/:id', () => {
    it('should get a single jewellery item by ID', (done) => {
      chai.request(app)
        .get(`/api/jewellery/${testJewelleryId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id').eql(testJewelleryId);
          expect(res.body).to.have.property('design_code').eql('TEST_J001');
          expect(res.body).to.have.property('category_name').eql('Test Category');
          done();
        });
    });

    it('should return 404 if jewellery not found', (done) => {
      chai.request(app)
        .get('/api/jewellery/99999') // Non-existent ID
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message').eql('Jewellery not found');
          done();
        });
    });
  });

  describe('PUT /api/jewellery/:id', () => {
    it('should update an existing jewellery item (Admin only)', (done) => {
      chai.request(app)
        .put(`/api/jewellery/${testJewelleryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          design_code: 'TEST_J001_UPDATED',
          name: 'Updated Gold Ring',
          description: 'An updated beautiful test gold ring',
          metal_type: 'Gold',
          expected_weight_min: 5.5,
          expected_weight_max: 6.5,
          image_url: 'http://example.com/test_ring_updated.jpg',
          category_id: categoryId,
          occasion: 'Party Wear',
          is_trending: false,
          is_lightweight: true
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('Jewellery updated successfully');
          expect(res.body.jewellery).to.have.property('design_code').eql('TEST_J001_UPDATED');
          done();
        });
    });

    it('should return 404 if jewellery to update not found', (done) => {
      chai.request(app)
        .put('/api/jewellery/99999') // Non-existent ID
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          design_code: 'NON_EXISTENT',
          name: 'Non Existent Ring',
          metal_type: 'Silver',
          category_id: categoryId,
          image_url: 'http://example.com/none.jpg'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message').eql('Jewellery not found');
          done();
        });
    });
  });

  describe('DELETE /api/jewellery/:id', () => {
    it('should delete a jewellery item (Admin only)', (done) => {
      chai.request(app)
        .delete(`/api/jewellery/${testJewelleryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('Jewellery deleted successfully');
          done();
        });
    });

    it('should return 404 if jewellery to delete not found', (done) => {
      chai.request(app)
        .delete('/api/jewellery/99999') // Already deleted or non-existent
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message').eql('Jewellery not found');
          done();
        });
    });
  });
});