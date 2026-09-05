-- Seed realistic display names (UPDATE only, no FK changes)
-- Categories
UPDATE product_categories SET name='Buah-buahan', description='Buah segar lokal' WHERE name='Category 1';
UPDATE product_categories SET name='Umbi-umbian', description='Ubi, kentang, bawang' WHERE name='Category 2';
UPDATE product_categories SET name='Biji-bijian', description='Beras, jagung, kedelai' WHERE name='Category 3';
UPDATE product_categories SET name='Rempah', description='Cabai, lada, kunyit' WHERE name='Category 4';
UPDATE product_categories SET name='Sayuran Daun', description='Bayam, kangkung, sawi' WHERE name='Category 5';
UPDATE product_categories SET name='Sayuran Buah', description='Tomat, terong, pare' WHERE name='Category 6';
-- Products (by SKU)
UPDATE products SET name='Cabai Merah Keriting', description='Cabai merah segar grade A dari petani lokal' WHERE sku='SKU-1';
UPDATE products SET name='Bawang Merah', description='Bawang merah brebes ukuran sedang' WHERE sku='SKU-2';
UPDATE products SET name='Bawang Putih', description='Bawang putih impor kualitas bagus' WHERE sku='SKU-3';
UPDATE products SET name='Kentang Dieng', description='Kentang dataran tinggi, cocok untuk goreng' WHERE sku='SKU-4';
UPDATE products SET name='Wortel Lokal', description='Wortel segar manis' WHERE sku='SKU-5';
UPDATE products SET name='Bayam Hijau', description='Bayam segar ikat, petik pagi' WHERE sku='SKU-6';
UPDATE products SET name='Kangkung', description='Kangkung segar hidroponik' WHERE sku='SKU-7';
UPDATE products SET name='Sawi Putih', description='Sawi putih segar untuk sop' WHERE sku='SKU-8';
UPDATE products SET name='Terong Ungu', description='Terong ungu segar' WHERE sku='SKU-9';
UPDATE products SET name='Pare', description='Pare segar, pahit segar' WHERE sku='SKU-10';
UPDATE products SET name='Jeruk Medan', description='Jeruk manis berair' WHERE sku='SKU-11';
UPDATE products SET name='Pisang Ambon', description='Pisang ambon matang pohon' WHERE sku='SKU-12';
UPDATE products SET name='Mangga Harum Manis', description='Mangga harum manis musiman' WHERE sku='SKU-13';
UPDATE products SET name='Beras Premium', description='Beras premium pulen 5kg' WHERE sku='SKU-14';
UPDATE products SET name='Jagung Manis', description='Jagung manis segar' WHERE sku='SKU-15';
UPDATE products SET name='Kedelai Lokal', description='Kedelai untuk tempe/tahu' WHERE sku='SKU-16';
UPDATE products SET name='Lada Hitam', description='Lada hitam kering' WHERE sku='SKU-17';
UPDATE products SET name='Kunyit', description='Kunyit segar rimpang' WHERE sku='SKU-18';
UPDATE products SET name='Jahe Merah', description='Jahe merah untuk jamu' WHERE sku='SKU-19';
UPDATE products SET name='Serai', description='Serai segar wangi' WHERE sku='SKU-20';
-- Businesses (keep type, rename only)
UPDATE business_entities SET name='PT Tani Makmur Distributor', city='Jakarta' WHERE name='Business 1';
UPDATE business_entities SET name='Toko Segar Jaya', city='Bandung' WHERE name='Business 2';
UPDATE business_entities SET name='PT Agro Lestari', city='Surabaya' WHERE name='Business 3';
UPDATE business_entities SET name='Toko Berkah Tani', city='Semarang' WHERE name='Business 4';
UPDATE business_entities SET name='PT Panen Raya Abadi', city='Medan' WHERE name='Business 5';
UPDATE business_entities SET name='Toko Sayur Fresh', city='Yogyakarta' WHERE name='Business 6';
UPDATE business_entities SET name='PT Bumi Hijau Distribusi', city='Makassar' WHERE name='Business 7';
UPDATE business_entities SET name='Toko Buah Sejahtera', city='Denpasar' WHERE name='Business 8';
UPDATE business_entities SET name='PT Sumber Pangan Nusantara', city='Palembang' WHERE name='Business 9';
UPDATE business_entities SET name='Toko Tani Maju', city='Bogor' WHERE name='Business 10';
-- Users (keep role, rename only)
UPDATE users SET name='Agus Petani' WHERE email='user2@mailinator.com';
UPDATE users SET name='Siti Kebun' WHERE email='user3@mailinator.com';
UPDATE users SET name='Dewi Distributor' WHERE email='user4@mailinator.com';
UPDATE users SET name='Rina Retail' WHERE email='user5@mailinator.com';
UPDATE users SET name='Joko Tani' WHERE email='user6@mailinator.com';
UPDATE users SET name='Sri Panen' WHERE email='user7@mailinator.com';
UPDATE users SET name='Budi Niaga' WHERE email='user8@mailinator.com';
UPDATE users SET name='Ayu Dagang' WHERE email='user9@mailinator.com';
UPDATE users SET name='Hendra Kebun' WHERE email='user10@mailinator.com';
UPDATE users SET name='Maya Segar' WHERE email='user11@mailinator.com';
-- Batches (keep dates/qty, rename code only for readability)
UPDATE batches SET batch_code='CMK-2026-001' WHERE batch_code='BATCH-1';
UPDATE batches SET batch_code='BWG-2026-002' WHERE batch_code='BATCH-2';
UPDATE batches SET batch_code='KTG-2026-003' WHERE batch_code='BATCH-3';
