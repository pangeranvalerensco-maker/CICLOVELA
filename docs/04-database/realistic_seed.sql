-- ============================================================
-- CICLOVELA
-- REALISTIC SEED DATA FOR DEMO
-- ============================================================

-- 1. CLEAR ALL DATA SAFELY
TRUNCATE TABLE 
    users, 
    business_entities, 
    business_memberships, 
    product_categories, 
    products, 
    batches, 
    inventory_accounts, 
    inventories, 
    inventory_movements, 
    purchases, 
    purchase_items, 
    sales, 
    sale_items, 
    wastes, 
    deliveries, 
    payments 
CASCADE;

-- 2. USERS
-- Admin
INSERT INTO users (id, name, email, password_hash, role, city, province) VALUES 
('00000010-0000-0000-0000-000000000001', 'Budi Admin', 'admin1@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'PLATFORM_ADMIN', 'Jakarta Selatan', 'DKI Jakarta');

-- Farmers
INSERT INTO users (id, name, email, password_hash, role, city, province) VALUES 
('00000010-0000-0000-0000-000000000002', 'Haji Mamat', 'farmer1@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'FARMER', 'Brebes', 'Jawa Tengah'),
('00000010-0000-0000-0000-000000000003', 'Pak Yanto', 'farmer2@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'FARMER', 'Lembang', 'Jawa Barat'),
('00000010-0000-0000-0000-000000000004', 'Bu Sari', 'farmer3@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'FARMER', 'Malang', 'Jawa Timur');

-- Distributor Users
INSERT INTO users (id, name, email, password_hash, role, city, province) VALUES 
('00000010-0000-0000-0000-000000000005', 'Agus Distributor', 'distributor1@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'CONSUMER', 'Bandung', 'Jawa Barat'),
('00000010-0000-0000-0000-000000000006', 'Dina Supplier', 'distributor2@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'CONSUMER', 'Semarang', 'Jawa Tengah');

-- Retailer Users
INSERT INTO users (id, name, email, password_hash, role, city, province) VALUES 
('00000010-0000-0000-0000-000000000007', 'Toko Segar Pak Rudi', 'retailer1@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'CONSUMER', 'Jakarta Pusat', 'DKI Jakarta'),
('00000010-0000-0000-0000-000000000008', 'Sayur Mart Bu Tina', 'retailer2@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'CONSUMER', 'Surabaya', 'Jawa Timur');

-- Consumer Users
INSERT INTO users (id, name, email, password_hash, role, city, province) VALUES 
('00000010-0000-0000-0000-000000000009', 'Nisa Konsumen', 'consumer1@mailinator.com', '$2a$10$HE.pc3UerduUJl3XXBdzN.ZGK3uyu8QmlMCpj3J63cn4ia/L4wnpi', 'CONSUMER', 'Jakarta Barat', 'DKI Jakarta');

-- 3. BUSINESS ENTITIES
-- Distributors
INSERT INTO business_entities (id, name, business_type, legal_name, address, city, province, verification_status, status, created_by, approved_by) VALUES 
('00000020-0000-0000-0000-000000000001', 'PT Agro Nusantara Abadi', 'DISTRIBUTOR', 'PT Agro Nusantara Abadi', 'Jl. Jendral Sudirman No 45', 'Bandung', 'Jawa Barat', 'APPROVED', 'ACTIVE', '00000010-0000-0000-0000-000000000005', '00000010-0000-0000-0000-000000000001'),
('00000020-0000-0000-0000-000000000002', 'CV Sumber Tani Makmur', 'DISTRIBUTOR', 'CV Sumber Tani Makmur', 'Kawasan Industri Candi', 'Semarang', 'Jawa Tengah', 'APPROVED', 'ACTIVE', '00000010-0000-0000-0000-000000000006', '00000010-0000-0000-0000-000000000001');

-- Retailers
INSERT INTO business_entities (id, name, business_type, legal_name, address, city, province, verification_status, status, created_by, approved_by) VALUES 
('00000020-0000-0000-0000-000000000003', 'Toko Segar Pak Rudi', 'RETAILER', 'UD Segar Meriah', 'Pasar Senen Blok A', 'Jakarta Pusat', 'DKI Jakarta', 'APPROVED', 'ACTIVE', '00000010-0000-0000-0000-000000000007', '00000010-0000-0000-0000-000000000001'),
('00000020-0000-0000-0000-000000000004', 'Sayur Mart Bu Tina', 'RETAILER', 'PT Sayur Mart Indonesia', 'Jl. Raya Darmo', 'Surabaya', 'Jawa Timur', 'APPROVED', 'ACTIVE', '00000010-0000-0000-0000-000000000008', '00000010-0000-0000-0000-000000000001');

-- 4. BUSINESS MEMBERSHIPS
INSERT INTO business_memberships (user_id, business_entity_id, role, status) VALUES 
('00000010-0000-0000-0000-000000000005', '00000020-0000-0000-0000-000000000001', 'ENTITY_ADMIN', 'ACTIVE'),
('00000010-0000-0000-0000-000000000006', '00000020-0000-0000-0000-000000000002', 'ENTITY_ADMIN', 'ACTIVE'),
('00000010-0000-0000-0000-000000000007', '00000020-0000-0000-0000-000000000003', 'ENTITY_ADMIN', 'ACTIVE'),
('00000010-0000-0000-0000-000000000008', '00000020-0000-0000-0000-000000000004', 'ENTITY_ADMIN', 'ACTIVE');

-- 5. PRODUCT CATEGORIES
INSERT INTO product_categories (id, name, description) VALUES 
('00000040-0000-0000-0000-000000000001', 'Buah-buahan', 'Berbagai macam buah segar'),
('00000040-0000-0000-0000-000000000002', 'Umbi-umbian', 'Termasuk bawang, kentang, wortel'),
('00000040-0000-0000-0000-000000000003', 'Sayuran Daun', 'Bayam, kangkung, sawi, dll'),
('00000040-0000-0000-0000-000000000004', 'Rempah', 'Cabai, jahe, kunyit, rempah dapur'),
('00000040-0000-0000-0000-000000000005', 'Biji-bijian', 'Beras, jagung, kacang');

-- 6. PRODUCTS
INSERT INTO products (id, category_id, name, sku, description, unit, shelf_life_days, created_by) VALUES 
('00000050-0000-0000-0000-000000000001', '00000040-0000-0000-0000-000000000002', 'Bawang Merah Brebes', 'BMR-BRB-001', 'Bawang merah unggul asli Brebes', 'KG', 14, '00000010-0000-0000-0000-000000000001'),
('00000050-0000-0000-0000-000000000002', '00000040-0000-0000-0000-000000000001', 'Tomat Cherry Lembang', 'TMT-CHR-002', 'Tomat manis segar dari dataran tinggi', 'KG', 7, '00000010-0000-0000-0000-000000000001'),
('00000050-0000-0000-0000-000000000003', '00000040-0000-0000-0000-000000000004', 'Cabai Rawit Merah', 'CBR-MRH-003', 'Cabai rawit setan super pedas', 'KG', 10, '00000010-0000-0000-0000-000000000001'),
('00000050-0000-0000-0000-000000000004', '00000040-0000-0000-0000-000000000001', 'Apel Malang Manalagi', 'APL-MLG-004', 'Apel hijau khas kota batu', 'KG', 20, '00000010-0000-0000-0000-000000000001');

-- 7. BATCHES
INSERT INTO batches (id, batch_code, product_id, farmer_id, harvest_date, initial_quantity, unit, expiry_date) VALUES 
('00000060-0000-0000-0000-000000000001', 'BMR-2609-01', '00000050-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000002', '2026-09-10', 500, 'KG', '2026-09-24'),
('00000060-0000-0000-0000-000000000002', 'TMT-2609-02', '00000050-0000-0000-0000-000000000002', '00000010-0000-0000-0000-000000000003', '2026-09-15', 300, 'KG', '2026-09-22'),
('00000060-0000-0000-0000-000000000003', 'APL-2609-03', '00000050-0000-0000-0000-000000000004', '00000010-0000-0000-0000-000000000004', '2026-09-05', 1000, 'KG', '2026-09-25');

-- 8. INVENTORY ACCOUNTS
-- Farmer Accounts
INSERT INTO inventory_accounts (id, owner_user_id) VALUES 
('00000070-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000002'),
('00000070-0000-0000-0000-000000000002', '00000010-0000-0000-0000-000000000003'),
('00000070-0000-0000-0000-000000000003', '00000010-0000-0000-0000-000000000004');

-- Business Entity Accounts
INSERT INTO inventory_accounts (id, owner_business_entity_id) VALUES 
('00000070-0000-0000-0000-000000000004', '00000020-0000-0000-0000-000000000001'),
('00000070-0000-0000-0000-000000000005', '00000020-0000-0000-0000-000000000003');

-- 9. INVENTORIES
-- Farmers Inventories (Simulate that they harvested but sold some)
INSERT INTO inventories (id, inventory_account_id, batch_id, quantity) VALUES 
('00000080-0000-0000-0000-000000000001', '00000070-0000-0000-0000-000000000001', '00000060-0000-0000-0000-000000000001', 300), -- 500 initial, sold 200
('00000080-0000-0000-0000-000000000002', '00000070-0000-0000-0000-000000000002', '00000060-0000-0000-0000-000000000002', 150), -- 300 initial, sold 150
('00000080-0000-0000-0000-000000000003', '00000070-0000-0000-0000-000000000003', '00000060-0000-0000-0000-000000000003', 900); -- 1000 initial, sold 100

-- Distributor Inventories
INSERT INTO inventories (id, inventory_account_id, batch_id, quantity) VALUES 
('00000080-0000-0000-0000-000000000004', '00000070-0000-0000-0000-000000000004', '00000060-0000-0000-0000-000000000001', 100), -- Bought 200, sold 100
('00000080-0000-0000-0000-000000000005', '00000070-0000-0000-0000-000000000004', '00000060-0000-0000-0000-000000000002', 150); -- Bought 150

-- Retailer Inventories
INSERT INTO inventories (id, inventory_account_id, batch_id, quantity) VALUES 
('00000080-0000-0000-0000-000000000006', '00000070-0000-0000-0000-000000000005', '00000060-0000-0000-0000-000000000001', 50); -- Bought 100, sold 50

-- 10. INVENTORY MOVEMENTS (Dashboard needs these)
-- Farmer harvest movements (6 days ago)
INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, description, created_by, created_at) VALUES 
('00000080-0000-0000-0000-000000000001', 'ADJUSTMENT_IN', 500, 'BATCH', 'Panen Bawang', '00000010-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('00000080-0000-0000-0000-000000000002', 'ADJUSTMENT_IN', 300, 'BATCH', 'Panen Tomat', '00000010-0000-0000-0000-000000000003', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('00000080-0000-0000-0000-000000000003', 'ADJUSTMENT_IN', 1000, 'BATCH', 'Panen Apel', '00000010-0000-0000-0000-000000000004', CURRENT_TIMESTAMP - INTERVAL '6 days');

-- Sale to Distributor movements (4 days ago)
INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, description, created_by, created_at) VALUES 
('00000080-0000-0000-0000-000000000001', 'SALE_OUT', 200, 'PURCHASE', 'Dijual ke PT Agro', '00000010-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('00000080-0000-0000-0000-000000000004', 'PURCHASE_IN', 200, 'PURCHASE', 'Masuk dari Haji Mamat', '00000010-0000-0000-0000-000000000005', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('00000080-0000-0000-0000-000000000002', 'SALE_OUT', 150, 'PURCHASE', 'Dijual ke PT Agro', '00000010-0000-0000-0000-000000000003', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('00000080-0000-0000-0000-000000000005', 'PURCHASE_IN', 150, 'PURCHASE', 'Masuk dari Pak Yanto', '00000010-0000-0000-0000-000000000005', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Distributor Sale to Retailer movements (4 days ago)
INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, description, created_by, created_at) VALUES 
('00000080-0000-0000-0000-000000000004', 'SALE_OUT', 100, 'SALE', 'Dijual ke Toko Segar', '00000010-0000-0000-0000-000000000005', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('00000080-0000-0000-0000-000000000006', 'PURCHASE_IN', 100, 'SALE', 'Masuk dari PT Agro', '00000010-0000-0000-0000-000000000007', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- 11. WASTES
INSERT INTO wastes (batch_id, inventory_id, quantity, reason, recorded_by, notes) VALUES 
('00000060-0000-0000-0000-000000000003', '00000080-0000-0000-0000-000000000003', 15, 'SPOILED', '00000010-0000-0000-0000-000000000004', 'Apel membusuk karena suhu');
INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, description, created_by, created_at) VALUES 
('00000080-0000-0000-0000-000000000003', 'WASTE_OUT', 15, 'WASTE', 'Apel membusuk', '00000010-0000-0000-0000-000000000004', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- 12. PURCHASES (Farmer to Distributor)
INSERT INTO purchases (id, transaction_code, buyer_entity_id, seller_farmer_id, status, total_amount) VALUES 
('00000090-0000-0000-0000-000000000001', 'PUR-2609-001', '00000020-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000002', 'COMPLETED', 5000000),
('00000090-0000-0000-0000-000000000002', 'PUR-2609-002', '00000020-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000003', 'COMPLETED', 3000000);

-- Purchase Items
INSERT INTO purchase_items (purchase_id, batch_id, quantity, unit_price, subtotal) VALUES 
('00000090-0000-0000-0000-000000000001', '00000060-0000-0000-0000-000000000001', 200, 25000, 5000000),
('00000090-0000-0000-0000-000000000002', '00000060-0000-0000-0000-000000000002', 150, 20000, 3000000);

-- 13. SALES (Distributor to Retailer)
INSERT INTO sales (id, transaction_code, seller_entity_id, buyer_entity_id, status, total_amount) VALUES 
('00000100-0000-0000-0000-000000000001', 'SAL-2609-001', '00000020-0000-0000-0000-000000000001', '00000020-0000-0000-0000-000000000003', 'COMPLETED', 3000000);

-- Sale Items
INSERT INTO sale_items (sale_id, batch_id, quantity, unit_price, subtotal) VALUES 
('00000100-0000-0000-0000-000000000001', '00000060-0000-0000-0000-000000000001', 100, 30000, 3000000);
