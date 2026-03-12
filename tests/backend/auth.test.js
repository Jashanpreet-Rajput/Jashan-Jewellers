const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../backend/src/server');
const { pool } = require('../../backend/src/config/db');
const { hashPassword } = require('../../backend/src/utils/passwordUtils');
require('dotenv').config({ path: './backend/src/.env' });

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth API', () => {
  let adminPasswordHash;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
  const testUsername = 'testuser';
  const testPassword = 'testpassword';

  before(async () => {
    // Clear users table and re-insert admin for a clean state
    await pool.query('DELETE FROM users WHERE username = ? OR username = ?', [adminUsername, testUsername]);
    adminPasswordHash = await hashPassword(adminPassword);
    await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [adminUsername, adminPasswordHash, 'admin']);
  });

  after(async () => {
    // Clean up test user
    await pool.query('DELETE FROM users WHERE username = ?', [testUsername]);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user (admin role by default for this test setup)', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ username: testUsername, password: testPassword })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Admin user registered successfully');
          expect(res.body).to.have.property('userId');
          done();
        });
    });

    it('should not register a user with existing username', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ username: testUsername, password: testPassword })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('User already exists');
          done();
        });
    });

    it('should return 400 for invalid input (missing password)', (done) => {
        chai.request(app)
          .post('/api/auth/register')
          .send({ username: 'invaliduser' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').contains('"password" is required');
            done();
          });
      });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: adminUsername, password: adminPassword })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should return 401 for incorrect password', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: adminUsername, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message').eql('Invalid credentials');
          done();
        });
    });

    it('should return 401 for non-existent username', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'anypassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message').eql('Invalid credentials');
          done();
        });
    });

    it('should return 400 for invalid input (missing username)', (done) => {
        chai.request(app)
          .post('/api/auth/login')
          .send({ password: 'somepassword' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').contains('"username" is required');
            done();
          });
      });
  });
});