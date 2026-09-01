-- ============================================================
-- CICLOVELA
-- PostgreSQL Database Schema
-- Version: 1.0
--
-- Database : PostgreSQL
-- ORM      : Spring Data JPA / Hibernate
-- Client   : DBeaver
--
-- IMPORTANT:
-- Run this script inside the CICLOVELA database.
-- ============================================================


-- ============================================================
-- 1. EXTENSION
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    avatar_url TEXT,

    gender VARCHAR(20),

    date_of_birth DATE,

    address TEXT,

    city VARCHAR(100),

    province VARCHAR(100),

    postal_code VARCHAR(10),

    role VARCHAR(30) NOT NULL DEFAULT 'CONSUMER',

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT chk_users_role
        CHECK (
            role IN (
                'PLATFORM_ADMIN',
                'FARMER',
                'CONSUMER'
            )
        ),

    CONSTRAINT chk_users_status
        CHECK (
            status IN (
                'ACTIVE',
                'SUSPENDED',
                'INACTIVE'
            )
        )
);


-- ============================================================
-- 3. BUSINESS ENTITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS business_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    business_type VARCHAR(30) NOT NULL,

    legal_name VARCHAR(200),

    description TEXT,

    phone VARCHAR(20),

    email VARCHAR(150),

    address TEXT NOT NULL,

    city VARCHAR(100) NOT NULL,

    province VARCHAR(100) NOT NULL,

    postal_code VARCHAR(10),

    verification_status VARCHAR(30)
        NOT NULL DEFAULT 'PENDING',

    status VARCHAR(30)
        NOT NULL DEFAULT 'INACTIVE',

    verification_document_url TEXT,

    created_by UUID NOT NULL,

    approved_by UUID,

    approved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_business_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_type
        CHECK (
            business_type IN (
                'DISTRIBUTOR',
                'RETAILER'
            )
        ),

    CONSTRAINT chk_business_verification
        CHECK (
            verification_status IN (
                'PENDING',
                'APPROVED',
                'REJECTED'
            )
        ),

    CONSTRAINT chk_business_status
        CHECK (
            status IN (
                'ACTIVE',
                'SUSPENDED',
                'INACTIVE'
            )
        ),

    CONSTRAINT chk_business_approval
        CHECK (
            (
                verification_status = 'APPROVED'
                AND approved_by IS NOT NULL
                AND approved_at IS NOT NULL
            )
            OR
            verification_status <> 'APPROVED'
        )
);


-- ============================================================
-- 4. BUSINESS MEMBERSHIPS
-- ============================================================

CREATE TABLE IF NOT EXISTS business_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    business_entity_id UUID NOT NULL,

    role VARCHAR(30) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    joined_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_membership_business
        FOREIGN KEY (business_entity_id)
        REFERENCES business_entities(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_user_business
        UNIQUE (user_id, business_entity_id),

    CONSTRAINT chk_membership_role
        CHECK (
            role IN (
                'ENTITY_ADMIN',
                'DISTRIBUTOR',
                'RETAILER',
                'STAFF'
            )
        ),

    CONSTRAINT chk_membership_status
        CHECK (
            status IN (
                'PENDING',
                'ACTIVE',
                'REJECTED',
                'INACTIVE'
            )
        )
);


-- ============================================================
-- 5. PRODUCT CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT chk_product_category_status
        CHECK (
            status IN (
                'ACTIVE',
                'INACTIVE'
            )
        )
);


-- ============================================================
-- 6. PRODUCTS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    sku VARCHAR(50) UNIQUE,

    description TEXT,

    unit VARCHAR(20) NOT NULL,

    shelf_life_days INTEGER,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES product_categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_product_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_product_unit
        CHECK (
            unit IN (
                'KG',
                'GRAM',
                'LITER',
                'UNIT',
                'BOX',
                'BUNCH'
            )
        ),

    CONSTRAINT chk_product_status
        CHECK (
            status IN (
                'ACTIVE',
                'INACTIVE'
            )
        ),

    CONSTRAINT chk_shelf_life
        CHECK (
            shelf_life_days IS NULL
            OR shelf_life_days >= 0
        )
);


-- ============================================================
-- 7. BATCHES
-- ============================================================
-- Inventory CICLOVELA is batch-based.
--
-- IMPORTANT:
-- production_date is intentionally NOT used.
-- ============================================================

CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    batch_code VARCHAR(80) NOT NULL UNIQUE,

    product_id UUID NOT NULL,

    farmer_id UUID NOT NULL,

    harvest_date DATE NOT NULL,

    initial_quantity NUMERIC(14,3) NOT NULL,

    unit VARCHAR(20) NOT NULL,

    quality_grade VARCHAR(20) NOT NULL DEFAULT 'A',

    expiry_date DATE NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_batch_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_batch_farmer
        FOREIGN KEY (farmer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_batch_quantity
        CHECK (initial_quantity > 0),

    CONSTRAINT chk_batch_unit
        CHECK (
            unit IN (
                'KG',
                'GRAM',
                'LITER',
                'UNIT',
                'BOX',
                'BUNCH'
            )
        ),

    CONSTRAINT chk_batch_quality
        CHECK (
            quality_grade IN (
                'A',
                'B',
                'C',
                'REJECTED'
            )
        ),

    CONSTRAINT chk_batch_status
        CHECK (
            status IN (
                'ACTIVE',
                'DEPLETED',
                'EXPIRED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_batch_dates
        CHECK (
            expiry_date >= harvest_date
        )
);


-- ============================================================
-- 8. INVENTORY ACCOUNTS
-- ============================================================
-- Inventory may belong to:
--
-- 1. Individual user
-- 2. Business entity
--
-- Never both simultaneously.
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_user_id UUID,

    owner_business_entity_id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_account_user
        FOREIGN KEY (owner_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_account_business
        FOREIGN KEY (owner_business_entity_id)
        REFERENCES business_entities(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inventory_owner
        CHECK (
            (
                owner_user_id IS NOT NULL
                AND owner_business_entity_id IS NULL
            )
            OR
            (
                owner_user_id IS NULL
                AND owner_business_entity_id IS NOT NULL
            )
        )
);


-- ============================================================
-- 9. INVENTORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    inventory_account_id UUID NOT NULL,

    batch_id UUID NOT NULL,

    quantity NUMERIC(14,3) NOT NULL DEFAULT 0,

    reserved_quantity NUMERIC(14,3) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_account
        FOREIGN KEY (inventory_account_id)
        REFERENCES inventory_accounts(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_inventory_account_batch
        UNIQUE (inventory_account_id, batch_id),

    CONSTRAINT chk_inventory_quantity
        CHECK (quantity >= 0),

    CONSTRAINT chk_reserved_quantity
        CHECK (reserved_quantity >= 0),

    CONSTRAINT chk_reserved_not_exceed
        CHECK (
            reserved_quantity <= quantity
        )
);


-- ============================================================
-- 10. INVENTORY MOVEMENTS
-- ============================================================
-- Historical inventory ledger.
-- Movement records are immutable.
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    inventory_id UUID NOT NULL,

    movement_type VARCHAR(30) NOT NULL,

    quantity NUMERIC(14,3) NOT NULL,

    reference_type VARCHAR(50),

    reference_id UUID,

    description TEXT,

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movement_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_movement_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_movement_type
        CHECK (
            movement_type IN (
                'PURCHASE_IN',
                'TRANSFER_IN',
                'TRANSFER_OUT',
                'SALE_OUT',
                'WASTE_OUT',
                'ADJUSTMENT_IN',
                'ADJUSTMENT_OUT',
                'REVERSAL_IN',
                'REVERSAL_OUT'
            )
        ),

    CONSTRAINT chk_movement_quantity
        CHECK (quantity > 0)
);


-- ============================================================
-- 11. PURCHASES
-- ============================================================
-- Farmer → Distributor
-- ============================================================

CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_code VARCHAR(50) NOT NULL UNIQUE,

    buyer_entity_id UUID NOT NULL,

    seller_farmer_id UUID NOT NULL,

    transaction_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    total_amount NUMERIC(16,2) NOT NULL DEFAULT 0,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_buyer
        FOREIGN KEY (buyer_entity_id)
        REFERENCES business_entities(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_purchase_farmer
        FOREIGN KEY (seller_farmer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_purchase_status
        CHECK (
            status IN (
                'PENDING',
                'CONFIRMED',
                'COMPLETED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_purchase_total
        CHECK (total_amount >= 0)
);


-- ============================================================
-- 12. PURCHASE ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_id UUID NOT NULL,

    batch_id UUID NOT NULL,

    quantity NUMERIC(14,3) NOT NULL,

    unit_price NUMERIC(16,2) NOT NULL,

    subtotal NUMERIC(18,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_item_purchase
        FOREIGN KEY (purchase_id)
        REFERENCES purchases(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_purchase_item_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_purchase_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_purchase_item_price
        CHECK (unit_price >= 0),

    CONSTRAINT chk_purchase_item_subtotal
        CHECK (subtotal >= 0)
);


-- ============================================================
-- 13. SALES
-- ============================================================
-- Distributor → Retailer
-- Retailer → Consumer
-- ============================================================

CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_code VARCHAR(50) NOT NULL UNIQUE,

    seller_entity_id UUID NOT NULL,

    buyer_entity_id UUID,

    buyer_user_id UUID,

    transaction_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    total_amount NUMERIC(16,2) NOT NULL DEFAULT 0,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sale_seller
        FOREIGN KEY (seller_entity_id)
        REFERENCES business_entities(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sale_buyer_entity
        FOREIGN KEY (buyer_entity_id)
        REFERENCES business_entities(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sale_buyer_user
        FOREIGN KEY (buyer_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_sale_buyer
        CHECK (
            (
                buyer_entity_id IS NOT NULL
                AND buyer_user_id IS NULL
            )
            OR
            (
                buyer_entity_id IS NULL
                AND buyer_user_id IS NOT NULL
            )
        ),

    CONSTRAINT chk_sale_status
        CHECK (
            status IN (
                'PENDING',
                'CONFIRMED',
                'COMPLETED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_sale_total
        CHECK (total_amount >= 0)
);


-- ============================================================
-- 14. SALE ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sale_id UUID NOT NULL,

    batch_id UUID NOT NULL,

    quantity NUMERIC(14,3) NOT NULL,

    unit_price NUMERIC(16,2) NOT NULL,

    subtotal NUMERIC(18,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sale_item_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sale_item_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_sale_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_sale_item_price
        CHECK (unit_price >= 0),

    CONSTRAINT chk_sale_item_subtotal
        CHECK (subtotal >= 0)
);


-- ============================================================
-- 15. WASTES
-- ============================================================

CREATE TABLE IF NOT EXISTS wastes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    batch_id UUID NOT NULL,

    inventory_id UUID NOT NULL,

    quantity NUMERIC(14,3) NOT NULL,

    reason VARCHAR(30) NOT NULL,

    recorded_by UUID NOT NULL,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_waste_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_waste_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_waste_user
        FOREIGN KEY (recorded_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_waste_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_waste_reason
        CHECK (
            reason IN (
                'EXPIRED',
                'SPOILED',
                'DAMAGED',
                'QUALITY_FAILURE',
                'UNSOLD',
                'OTHER'
            )
        )
);


-- ============================================================
-- 16. DELIVERIES
-- ============================================================
-- MVP does NOT require real-time GPS tracking.
-- ============================================================

CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sale_id UUID NOT NULL UNIQUE,

    delivery_address TEXT NOT NULL,

    recipient_name VARCHAR(100),

    recipient_phone VARCHAR(20),

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    estimated_delivery_date DATE,

    shipped_at TIMESTAMPTZ,

    delivered_at TIMESTAMPTZ,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_status
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_delivery_dates
        CHECK (
            delivered_at IS NULL
            OR shipped_at IS NULL
            OR delivered_at >= shipped_at
        )
);


-- ============================================================
-- 17. PAYMENTS
-- ============================================================
-- Payment gateway integration such as Midtrans is optional.
-- Core transaction must not depend on gateway integration.
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sale_id UUID NOT NULL,

    payment_method VARCHAR(30) NOT NULL,

    payment_reference VARCHAR(150),

    gateway_reference VARCHAR(150),

    amount NUMERIC(16,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    paid_at TIMESTAMPTZ,

    expired_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_method
        CHECK (
            payment_method IN (
                'CASH',
                'BANK_TRANSFER',
                'E_WALLET',
                'PAYMENT_GATEWAY'
            )
        ),

    CONSTRAINT chk_payment_status
        CHECK (
            status IN (
                'PENDING',
                'PAID',
                'FAILED',
                'EXPIRED',
                'REFUNDED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_payment_amount
        CHECK (amount > 0)
);


-- ============================================================
-- 18. UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


-- ============================================================
-- 19. UPDATED_AT TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS trg_users_updated_at
ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_business_entities_updated_at
ON business_entities;

CREATE TRIGGER trg_business_entities_updated_at
BEFORE UPDATE ON business_entities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_business_memberships_updated_at
ON business_memberships;

CREATE TRIGGER trg_business_memberships_updated_at
BEFORE UPDATE ON business_memberships
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_product_categories_updated_at
ON product_categories;

CREATE TRIGGER trg_product_categories_updated_at
BEFORE UPDATE ON product_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_products_updated_at
ON products;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_batches_updated_at
ON batches;

CREATE TRIGGER trg_batches_updated_at
BEFORE UPDATE ON batches
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_inventory_accounts_updated_at
ON inventory_accounts;

CREATE TRIGGER trg_inventory_accounts_updated_at
BEFORE UPDATE ON inventory_accounts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_inventories_updated_at
ON inventories;

CREATE TRIGGER trg_inventories_updated_at
BEFORE UPDATE ON inventories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_purchases_updated_at
ON purchases;

CREATE TRIGGER trg_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_sales_updated_at
ON sales;

CREATE TRIGGER trg_sales_updated_at
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_wastes_updated_at
ON wastes;

CREATE TRIGGER trg_wastes_updated_at
BEFORE UPDATE ON wastes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_deliveries_updated_at
ON deliveries;

CREATE TRIGGER trg_deliveries_updated_at
BEFORE UPDATE ON deliveries
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


DROP TRIGGER IF EXISTS trg_payments_updated_at
ON payments;

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 20. INVENTORY MOVEMENT VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_inventory_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION
            'Inventory movement quantity must be greater than zero';
    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_validate_inventory_movement
ON inventory_movements;

CREATE TRIGGER trg_validate_inventory_movement
BEFORE INSERT ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION validate_inventory_movement();


-- ============================================================
-- 21. IMMUTABLE INVENTORY MOVEMENTS
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_inventory_movement_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    RAISE EXCEPTION
        'Inventory movements are immutable and cannot be modified or deleted';

END;
$$;


DROP TRIGGER IF EXISTS trg_prevent_inventory_movement_update
ON inventory_movements;

CREATE TRIGGER trg_prevent_inventory_movement_update
BEFORE UPDATE OR DELETE ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION prevent_inventory_movement_modification();


-- ============================================================
-- 22. BUSINESS ENTITY APPROVAL VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_business_entity_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.verification_status = 'APPROVED' THEN

        IF NEW.approved_by IS NULL THEN
            RAISE EXCEPTION
                'Approved business entity must have approved_by';
        END IF;

        IF NEW.approved_at IS NULL THEN
            NEW.approved_at = CURRENT_TIMESTAMP;
        END IF;

        IF NEW.status = 'INACTIVE' THEN
            NEW.status = 'ACTIVE';
        END IF;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_validate_business_entity_approval
ON business_entities;

CREATE TRIGGER trg_validate_business_entity_approval
BEFORE INSERT OR UPDATE ON business_entities
FOR EACH ROW
EXECUTE FUNCTION validate_business_entity_approval();


-- ============================================================
-- 23. INVENTORY ADJUSTMENT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION adjust_inventory(
    p_inventory_id UUID,
    p_quantity NUMERIC,
    p_movement_type VARCHAR(30),
    p_reference_type VARCHAR(50),
    p_reference_id UUID,
    p_created_by UUID,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_quantity NUMERIC(14,3);
    v_new_quantity NUMERIC(14,3);
    v_movement_id UUID;
BEGIN

    IF p_quantity <= 0 THEN
        RAISE EXCEPTION
            'Inventory adjustment quantity must be greater than zero';
    END IF;


    IF p_movement_type NOT IN (
        'PURCHASE_IN',
        'TRANSFER_IN',
        'TRANSFER_OUT',
        'SALE_OUT',
        'WASTE_OUT',
        'ADJUSTMENT_IN',
        'ADJUSTMENT_OUT',
        'REVERSAL_IN',
        'REVERSAL_OUT'
    ) THEN
        RAISE EXCEPTION
            'Unsupported movement type: %',
            p_movement_type;
    END IF;


    SELECT quantity
    INTO v_current_quantity
    FROM inventories
    WHERE id = p_inventory_id
    FOR UPDATE;


    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Inventory % not found',
            p_inventory_id;
    END IF;


    IF p_movement_type IN (
        'PURCHASE_IN',
        'TRANSFER_IN',
        'ADJUSTMENT_IN',
        'REVERSAL_IN'
    ) THEN

        v_new_quantity =
            v_current_quantity + p_quantity;

    ELSE

        v_new_quantity =
            v_current_quantity - p_quantity;

        IF v_new_quantity < 0 THEN
            RAISE EXCEPTION
                'Insufficient inventory. Current: %, Requested: %',
                v_current_quantity,
                p_quantity;
        END IF;

    END IF;


    UPDATE inventories
    SET
        quantity = v_new_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_inventory_id;


    INSERT INTO inventory_movements (
        inventory_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        description,
        created_by
    )
    VALUES (
        p_inventory_id,
        p_movement_type,
        p_quantity,
        p_reference_type,
        p_reference_id,
        p_description,
        p_created_by
    )
    RETURNING id
    INTO v_movement_id;


    RETURN v_movement_id;

END;
$$;


-- ============================================================
-- 24. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_status
ON users(status);


CREATE INDEX IF NOT EXISTS idx_business_entities_type
ON business_entities(business_type);

CREATE INDEX IF NOT EXISTS idx_business_entities_verification
ON business_entities(verification_status);

CREATE INDEX IF NOT EXISTS idx_business_entities_status
ON business_entities(status);


CREATE INDEX IF NOT EXISTS idx_memberships_user
ON business_memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_memberships_business
ON business_memberships(business_entity_id);

CREATE INDEX IF NOT EXISTS idx_memberships_status
ON business_memberships(status);


CREATE INDEX IF NOT EXISTS idx_products_category
ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_products_status
ON products(status);


CREATE INDEX IF NOT EXISTS idx_batches_product
ON batches(product_id);

CREATE INDEX IF NOT EXISTS idx_batches_farmer
ON batches(farmer_id);

CREATE INDEX IF NOT EXISTS idx_batches_expiry
ON batches(expiry_date);

CREATE INDEX IF NOT EXISTS idx_batches_status
ON batches(status);


CREATE INDEX IF NOT EXISTS idx_inventory_batch
ON inventories(batch_id);

CREATE INDEX IF NOT EXISTS idx_inventory_account
ON inventories(inventory_account_id);


CREATE INDEX IF NOT EXISTS idx_movements_inventory
ON inventory_movements(inventory_id);

CREATE INDEX IF NOT EXISTS idx_movements_reference
ON inventory_movements(reference_type, reference_id);

CREATE INDEX IF NOT EXISTS idx_movements_created_at
ON inventory_movements(created_at);


CREATE INDEX IF NOT EXISTS idx_purchases_buyer
ON purchases(buyer_entity_id);

CREATE INDEX IF NOT EXISTS idx_purchases_farmer
ON purchases(seller_farmer_id);

CREATE INDEX IF NOT EXISTS idx_purchases_status
ON purchases(status);


CREATE INDEX IF NOT EXISTS idx_purchase_items_batch
ON purchase_items(batch_id);


CREATE INDEX IF NOT EXISTS idx_sales_seller
ON sales(seller_entity_id);

CREATE INDEX IF NOT EXISTS idx_sales_buyer_entity
ON sales(buyer_entity_id);

CREATE INDEX IF NOT EXISTS idx_sales_buyer_user
ON sales(buyer_user_id);

CREATE INDEX IF NOT EXISTS idx_sales_status
ON sales(status);


CREATE INDEX IF NOT EXISTS idx_sale_items_batch
ON sale_items(batch_id);


CREATE INDEX IF NOT EXISTS idx_wastes_batch
ON wastes(batch_id);

CREATE INDEX IF NOT EXISTS idx_wastes_inventory
ON wastes(inventory_id);

CREATE INDEX IF NOT EXISTS idx_wastes_recorded_at
ON wastes(recorded_at);


CREATE INDEX IF NOT EXISTS idx_deliveries_status
ON deliveries(status);


CREATE INDEX IF NOT EXISTS idx_payments_sale
ON payments(sale_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
ON payments(status);


-- ============================================================
-- 25. VIEW: AVAILABLE INVENTORY
-- ============================================================

CREATE OR REPLACE VIEW v_available_inventory AS
SELECT
    i.id AS inventory_id,

    i.inventory_account_id,

    i.batch_id,

    b.batch_code,

    b.product_id,

    p.name AS product_name,

    i.quantity,

    i.reserved_quantity,

    (i.quantity - i.reserved_quantity)
        AS available_quantity,

    b.expiry_date,

    b.quality_grade,

    b.status AS batch_status

FROM inventories i

JOIN batches b
    ON b.id = i.batch_id

JOIN products p
    ON p.id = b.product_id

WHERE
    i.quantity > 0
    AND i.quantity > i.reserved_quantity
    AND b.status = 'ACTIVE';


-- ============================================================
-- 26. VIEW: INVENTORY WASTE SUMMARY
-- ============================================================

CREATE OR REPLACE VIEW v_inventory_waste_summary AS
SELECT
    i.id AS inventory_id,

    i.inventory_account_id,

    i.batch_id,

    b.batch_code,

    p.name AS product_name,

    COALESCE(
        SUM(w.quantity),
        0
    ) AS total_waste_quantity

FROM inventories i

JOIN batches b
    ON b.id = i.batch_id

JOIN products p
    ON p.id = b.product_id

LEFT JOIN wastes w
    ON w.inventory_id = i.id

GROUP BY
    i.id,
    i.inventory_account_id,
    i.batch_id,
    b.batch_code,
    p.name;


-- ============================================================
-- 27. VIEW: PRODUCT TRACEABILITY
-- ============================================================

CREATE OR REPLACE VIEW v_product_traceability AS
SELECT
    b.id AS batch_id,

    b.batch_code,

    p.id AS product_id,

    p.name AS product_name,

    u.id AS farmer_id,

    u.name AS farmer_name,

    b.harvest_date,

    b.expiry_date,

    b.initial_quantity,

    b.unit,

    b.quality_grade,

    b.status AS batch_status

FROM batches b

JOIN products p
    ON p.id = b.product_id

JOIN users u
    ON u.id = b.farmer_id;


-- ============================================================
-- 28. COMMENTS
-- ============================================================

COMMENT ON TABLE users IS
'Platform users including platform administrators, farmers and consumers.';

COMMENT ON TABLE business_entities IS
'Registered distributor and retailer business entities.';

COMMENT ON TABLE business_memberships IS
'Relationship between users and business entities.';

COMMENT ON TABLE product_categories IS
'Master categories for agricultural products.';

COMMENT ON TABLE products IS
'Master agricultural product catalog.';

COMMENT ON TABLE batches IS
'Agricultural product batches with harvest, expiry, quantity and quality information.';

COMMENT ON TABLE inventory_accounts IS
'Inventory ownership account belonging to either an individual user or a business entity.';

COMMENT ON TABLE inventories IS
'Current quantity of a specific batch owned by an inventory account.';

COMMENT ON TABLE inventory_movements IS
'Immutable historical ledger recording inventory changes.';

COMMENT ON TABLE purchases IS
'Purchase transactions from farmers to business entities.';

COMMENT ON TABLE purchase_items IS
'Individual batch items within purchase transactions.';

COMMENT ON TABLE sales IS
'Sales transactions from business entities to retailers or consumers.';

COMMENT ON TABLE sale_items IS
'Individual batch items within sales transactions.';

COMMENT ON TABLE wastes IS
'Inventory waste caused by expiry, spoilage, damage, quality failure, unsold products or other reasons.';

COMMENT ON TABLE deliveries IS
'Delivery information for sales transactions without real-time GPS tracking.';

COMMENT ON TABLE payments IS
'Payment records for sales transactions. Payment gateway integration is optional.';


-- ============================================================
-- 29. FINAL VERIFICATION
-- ============================================================

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;


SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'batches'
ORDER BY ordinal_position;


SELECT
    table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;


-- ============================================================
-- END OF CICLOVELA DATABASE SCHEMA
-- ============================================================