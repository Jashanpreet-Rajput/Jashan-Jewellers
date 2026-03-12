-- Seed Data for jashan_jewellers

-- Insert an admin user
INSERT INTO users (username, password_hash, role) VALUES 
('admin', '$2a$10$Q.Q7N6z.E5/eM8W3hY.Z.e.f.k.l.d.c.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 'admin');
-- The password 'adminpassword123' hashed with bcrypt. You can generate a new one using node 'console.log(require("bcryptjs").hashSync("adminpassword123", 10))'

-- Insert Categories
INSERT INTO categories (name, icon_url) VALUES
('Kada', 'https://example.com/icons/kada.png'),
('Bangles', 'https://example.com/icons/bangles.png'),
('Chain', 'https://example.com/icons/chain.png'),
('Haar / Necklace', 'https://example.com/icons/haar.png'),
('Ring', 'https://example.com/icons/ring.png'),
('Earrings', 'https://example.com/icons/earrings.png'),
('Anklets', 'https://example.com/icons/anklets.png'),
('Pendant', 'https://example.com/icons/pendant.png'); -- Additional category

-- Insert Jewellery items
-- Get category IDs first for foreign key constraints
SET @kada_id = (SELECT id FROM categories WHERE name = 'Kada');
SET @bangles_id = (SELECT id FROM categories WHERE name = 'Bangles');
SET @chain_id = (SELECT id FROM categories WHERE name = 'Chain');
SET @necklace_id = (SELECT id FROM categories WHERE name = 'Haar / Necklace');
SET @ring_id = (SELECT id FROM categories WHERE name = 'Ring');
SET @earrings_id = (SELECT id FROM categories WHERE name = 'Earrings');
SET @anklets_id = (SELECT id FROM categories WHERE name = 'Anklets');
SET @pendant_id = (SELECT id FROM categories WHERE name = 'Pendant');


-- Gold Jewellery
INSERT INTO jewellery (design_code, name, description, metal_type, expected_weight_min, expected_weight_max, image_url, category_id, occasion, is_trending, is_bridal, is_lightweight) VALUES
('G_R001', 'Classic Gold Ring', 'Elegant gold ring with intricate filigree work.', 'Gold', 4.5, 5.5, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Ring+G_R001', @ring_id, 'Daily Wear', TRUE, FALSE, FALSE),
('G_N002', 'Bridal Gold Necklace Set', 'Heavy gold necklace set with matching earrings, perfect for weddings.', 'Gold', 80.0, 100.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Necklace+G_N002', @necklace_id, 'Wedding', TRUE, TRUE, FALSE),
('G_B003', 'Lightweight Gold Bangles', 'Set of two delicate gold bangles for everyday elegance.', 'Gold', 8.0, 10.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Bangles+G_B003', @bangles_id, 'Daily Wear', FALSE, FALSE, TRUE),
('G_E004', 'Party Wear Gold Earrings', 'Sparkling gold drop earrings, ideal for parties.', 'Gold', 12.0, 15.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Earrings+G_E004', @earrings_id, 'Party Wear', TRUE, FALSE, FALSE),
('G_C005', 'Traditional Gold Chain', 'Long gold chain with a traditional pattern.', 'Gold', 25.0, 30.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Chain+G_C005', @chain_id, 'Traditional', FALSE, FALSE, FALSE),
('G_K006', 'Mens Gold Kada', 'Heavy and stylish gold kada for men.', 'Gold', 35.0, 40.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Kada+G_K006', @kada_id, 'Daily Wear', TRUE, FALSE, FALSE),
('G_A007', 'Gold Anklets', 'Delicate gold anklets with small charms.', 'Gold', 10.0, 12.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Anklets+G_A007', @anklets_id, 'Daily Wear', FALSE, FALSE, TRUE),
('G_P008', 'Designer Gold Pendant', 'Unique modern gold pendant, perfect for gifting.', 'Gold', 6.0, 8.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Gold+Pendant+G_P008', @pendant_id, 'Party Wear', TRUE, FALSE, FALSE),
('G_B009', 'Heavy Gold Bangle Set', 'Four piece heavy gold bangle set for special occasions.', 'Gold', 50.0, 60.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Heavy+Gold+Bangles+G_B009', @bangles_id, 'Wedding', FALSE, TRUE, FALSE),
('G_N010', 'Lightweight Gold Necklace', 'Simple and elegant gold necklace for daily wear.', 'Gold', 15.0, 20.0, 'https://via.placeholder.com/400x300/C9A227/0F0F0F?text=Lightweight+Gold+Necklace+G_N010', @necklace_id, 'Daily Wear', FALSE, FALSE, TRUE);


-- Silver Jewellery
INSERT INTO jewellery (design_code, name, description, metal_type, expected_weight_min, expected_weight_max, image_url, category_id, occasion, is_trending, is_bridal, is_lightweight) VALUES
('S_R001', 'Sterling Silver Ring', 'Stylish silver ring with a minimalist design.', 'Silver', 3.0, 4.0, 'https://via.placeholder.com/400x300/AAAAAA/0F0F0F?text=Silver+Ring+S_R001', @ring_id, 'Daily Wear', TRUE, FALSE, TRUE),
('S_N002', 'Oxidized Silver Necklace', 'Ethnic oxidized silver necklace, great for traditional outfits.', 'Silver', 60.0, 80.0, 'https://via.placeholder.com/400x300/AAAAAA/0F0F0F?text=Silver+Necklace+S_N002', @necklace_id, 'Traditional', TRUE, FALSE, FALSE),
('S_B003', 'Silver Kada Bracelet', 'Chunky silver kada bracelet for a bold look.', 'Silver', 25.0, 30.0, 'https://via.placeholder.com/400x300/AAAAAA/0F0F0F?text=Silver+Kada+S_B003', @kada_id, 'Party Wear', FALSE, FALSE, FALSE),
('S_E004', 'Silver Hoop Earrings', 'Classic silver hoop earrings, versatile for any occasion.', 'Silver', 7.0, 9.0, 'https://via.placeholder.com/400x300/AAAAAA/0F0F0F?text=Silver+Hoops+S_E004', @earrings_id, 'Daily Wear', TRUE, FALSE, TRUE),
('S_A005', 'Payal Silver Anklets', 'Traditional silver payal with ghungroo bells.', 'Silver', 20.0, 25.0, 'https://via.placeholder.com/400x300/AAAAAA/0F0F0F?text=Silver+Anklets+S_A005', @anklets_id, 'Traditional', FALSE, FALSE, FALSE);

-- Insert a few custom requests
INSERT INTO custom_requests (name, phone_number, jewellery_type, expected_weight, design_image_url, message, status) VALUES
('Anjali Sharma', '9911223344', 'Gold Necklace', 'Approx 40 grams', 'https://via.placeholder.com/200x150?text=Custom+Necklace+Ref', 'Looking for a custom heavy gold necklace for my sister''s wedding. Something with traditional floral motifs.', 'Pending'),
('Rohit Kumar', '9876543210', 'Silver Ring', '10-12 grams', NULL, 'I want a custom silver ring with my initials engraved. Minimalist design.', 'In Progress');