-- ============================================
-- Sample/Test Data for WorkerConnect
-- Complete seed data for UI testing
-- ============================================

-- Note: This file should be run AFTER 02-seed-master-data.sql
-- It creates realistic sample data for testing all UI scenarios

-- ============================================
-- SAMPLE WORKERS
-- ============================================

-- Password for all workers: Worker@123
-- Hashed with bcrypt: $2b$10$YourHashedPasswordHere (replace with actual hash)

INSERT INTO worker (
    aadhaar_number, e_card_id, e_sharm_id, bo_cw_id,
    first_name, middle_name, last_name,
    gender, marital_status, date_of_birth, age, relative_name,
    caste, sub_caste,
    mobile_number, email_id, password,
    per_door_number, per_street, per_state_id, per_district_id, per_city_id, per_village_or_area_id, per_pincode,
    is_same_as_per_addr,
    is_nres_member, is_trade_union, trade_union_number,
    status
) VALUES
-- Worker 1: Ravi Kumar (Visakhapatnam)
(
    '123456789012', 'EC001', 'ES001', 'BC001',
    'Ravi', 'Kumar', 'Sharma',
    'male', 'married', '1985-05-15', 38, 'Ramesh Sharma',
    'OC', 'General',
    9876543210, 'ravi.kumar@example.com', '$2b$10$YourHashedPasswordHere',
    '12-34', 'MVP Colony Main Road', 
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    (SELECT district_id FROM district WHERE district_code = 'VSP'),
    (SELECT city_id FROM city_mandal WHERE city_code = 'VSP-URB'),
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'MVP'),
    530017,
    true,
    'Y', 'Y', 12345,
    'active'
),

-- Worker 2: Suresh Reddy (Vijayawada)
(
    '123456789013', 'EC002', 'ES002', 'BC002',
    'Suresh', NULL, 'Reddy',
    'male', 'married', '1990-08-20', 33, 'Venkat Reddy',
    'BC', 'Reddy',
    9876543211, 'suresh.reddy@example.com', '$2b$10$YourHashedPasswordHere',
    '45-67', 'Benz Circle', 
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    (SELECT district_id FROM district WHERE district_code = 'KRS'),
    (SELECT city_id FROM city_mandal WHERE city_code = 'KRS-VJA'),
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'BNZ'),
    520010,
    true,
    'N', 'Y', 12346,
    'active'
),

-- Worker 3: Lakshmi Devi (Guntur)
(
    '123456789014', 'EC003', 'ES003', 'BC003',
    'Lakshmi', NULL, 'Devi',
    'female', 'married', '1988-03-10', 35, 'Krishna Murthy',
    'SC', 'Mala',
    9876543212, 'lakshmi.devi@example.com', '$2b$10$YourHashedPasswordHere',
    '23-45', 'Brodipet Main Road', 
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    (SELECT district_id FROM district WHERE district_code = 'GNT'),
    (SELECT city_id FROM city_mandal WHERE city_code = 'GNT-GNT'),
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'BRD'),
    522002,
    false,
    'Y', 'N', NULL,
    'active'
),

-- Worker 4: Venkat Rao (Kakinada)
(
    '123456789015', 'EC004', 'ES004', 'BC004',
    'Venkat', 'Sai', 'Rao',
    'male', 'single', '1995-11-25', 28, 'Rama Rao',
    'OC', 'Kapu',
    9876543213, 'venkat.rao@example.com', '$2b$10$YourHashedPasswordHere',
    '67-89', 'Kakinada Port Area', 
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    (SELECT district_id FROM district WHERE district_code = 'EG'),
    (SELECT city_id FROM city_mandal WHERE city_code = 'EG-KKD'),
    NULL,
    533001,
    true,
    'N', 'N', NULL,
    'active'
),

-- Worker 5: Anjali Patel (Tirupati)
(
    '123456789016', 'EC005', 'ES005', 'BC005',
    'Anjali', NULL, 'Patel',
    'female', 'single', '1998-07-18', 25, 'Rajesh Patel',
    'OC', 'General',
    9876543214, 'anjali.patel@example.com', '$2b$10$YourHashedPasswordHere',
    '12-34', 'Temple Street', 
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    (SELECT district_id FROM district WHERE district_code = 'CTR'),
    (SELECT city_id FROM city_mandal WHERE city_code = 'CTR-TPT'),
    NULL,
    517501,
    true,
    'Y', 'Y', 12347,
    'active'
);

-- Update present address for Worker 3 (Lakshmi - different from permanent)
UPDATE worker 
SET 
    pre_door_number = '78-90',
    pre_street = 'Guntur Urban',
    pre_state_id = per_state_id,
    pre_district_id = per_district_id,
    pre_city_id = (SELECT city_id FROM city_mandal WHERE city_code = 'GNT-GNT'),
    pre_village_or_area_id = (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'GU'),
    pre_pincode = 522001
WHERE aadhaar_number = '123456789014';

-- ============================================
-- WORKER DEPENDENTS
-- ============================================

INSERT INTO worker_dependents (worker_id, dependent_name, date_of_birth, relationship, is_nominee_selected, percentage_of_benefits)
VALUES
-- Ravi Kumar's dependents
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789012'), 'Sita Sharma', '1987-06-20', 'Wife', true, 60.00),
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789012'), 'Arjun Sharma', '2010-03-15', 'Son', true, 20.00),
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789012'), 'Priya Sharma', '2015-08-10', 'Daughter', true, 20.00),

-- Suresh Reddy's dependents
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789013'), 'Kavitha Reddy', '1992-04-12', 'Wife', true, 70.00),
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789013'), 'Kiran Reddy', '2018-01-25', 'Son', true, 30.00),

-- Lakshmi Devi's dependents
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789014'), 'Sai Krishna', '2012-09-05', 'Son', true, 50.00),
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789014'), 'Divya Krishna', '2016-12-20', 'Daughter', true, 50.00),

-- Anjali Patel's dependent
((SELECT worker_id FROM worker WHERE aadhaar_number = '123456789016'), 'Rajesh Patel', '1970-05-10', 'Father', true, 100.00);

-- ============================================
-- SAMPLE ESTABLISHMENTS
-- ============================================

-- Password for all establishments: Estmt@123
-- Hashed with bcrypt: $2b$10$YourHashedPasswordHere

INSERT INTO establishment (
    establishment_name, contact_person, mobile_number, email_id, password,
    door_number, street, 
    state_id, state_code, 
    district_id, district_code, district_name,
    city_id, city_code, city_name,
    village_or_area_id, village_or_area_code, village_or_area_name,
    pincode,
    is_plan_approval_id, plan_approval_id,
    category_id, work_nature_id,
    commencement_date, completion_date,
    construction_estimated_cost, construction_area, built_up_area, basic_estimated_cost,
    no_of_male_workers, no_of_female_workers,
    is_accepted_terms_and_conditions, status
) VALUES
-- Establishment 1: Sri Venkateswara Constructions (Private Residential)
(
    'Sri Venkateswara Constructions',
    'Ramesh Naidu',
    9123456780,
    'svconst@example.com',
    '$2b$10$YourHashedPasswordHere',
    '45-67', 'Industrial Estate',
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    'AP',
    (SELECT district_id FROM district WHERE district_code = 'VSP'),
    'VSP',
    'Visakhapatnam',
    (SELECT city_id FROM city_mandal WHERE city_code = 'VSP-URB'),
    'VSP-URB',
    'Visakhapatnam Urban',
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'MDW'),
    'MDW',
    'Madhurawada',
    530048,
    'Y', 'PA-VSP-2024-001',
    (SELECT category_id FROM establishment_category WHERE category_name = 'Private Residential'),
    (SELECT work_nature_id FROM establishment_work_nature WHERE work_nature_name = 'Residential Complex'),
    '2024-01-15', '2025-12-31',
    50000000.00, 100000.00, 75000.00, 45000000.00,
    25, 5,
    'Y', 'active'
),

-- Establishment 2: Vijaya Builders (Private Commercial)
(
    'Vijaya Builders',
    'Srinivas Rao',
    9123456781,
    'vijayabuilders@example.com',
    '$2b$10$YourHashedPasswordHere',
    '12-34', 'MG Road',
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    'AP',
    (SELECT district_id FROM district WHERE district_code = 'KRS'),
    'KRS',
    'Krishna',
    (SELECT city_id FROM city_mandal WHERE city_code = 'KRS-VJA'),
    'KRS-VJA',
    'Vijayawada',
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'BNZ'),
    'BNZ',
    'Benz Circle',
    520010,
    'Y', 'PA-KRS-2024-002',
    (SELECT category_id FROM establishment_category WHERE category_name = 'Private Commercial'),
    (SELECT work_nature_id FROM establishment_work_nature WHERE work_nature_name = 'Commercial Complex'),
    '2024-03-01', '2026-02-28',
    75000000.00, 150000.00, 120000.00, 70000000.00,
    40, 8,
    'Y', 'active'
),

-- Establishment 3: Andhra Infrastructure Ltd (State Government)
(
    'Andhra Infrastructure Ltd',
    'Madhavi Reddy',
    9123456782,
    'andhra.infra@example.com',
    '$2b$10$YourHashedPasswordHere',
    '78-90', 'Government Complex',
    (SELECT state_id FROM state WHERE state_code = 'AP'),
    'AP',
    (SELECT district_id FROM district WHERE district_code = 'GNT'),
    'GNT',
    'Guntur',
    (SELECT city_id FROM city_mandal WHERE city_code = 'GNT-GNT'),
    'GNT-GNT',
    'Guntur',
    (SELECT village_or_area_id FROM village_area WHERE village_or_area_code = 'GU'),
    'GU',
    'Guntur Urban',
    522001,
    'Y', 'PA-GNT-2024-003',
    (SELECT category_id FROM establishment_category WHERE category_name = 'State Government'),
    (SELECT work_nature_id FROM establishment_work_nature WHERE work_nature_name = 'Road Construction'),
    '2024-02-01', '2025-06-30',
    100000000.00, 200000.00, 0.00, 95000000.00,
    60, 10,
    'Y', 'active'
);

-- ============================================
-- ESTABLISHMENT-WORKER RELATIONSHIPS
-- ============================================

INSERT INTO establishment_worker (
    establishment_id, worker_id, aadhaar_card_number, 
    working_from_date, working_to_date, work_location, status
) VALUES
-- Sri Venkateswara Constructions workers
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456780),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789012'),
    '123456789012',
    '2024-01-20', NULL, 'Madhurawada Site', 'active'
),
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456780),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789013'),
    '123456789013',
    '2024-02-01', NULL, 'Madhurawada Site', 'active'
),

-- Vijaya Builders workers
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456781),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789013'),
    '123456789013',
    '2024-03-15', NULL, 'Benz Circle Site', 'active'
),
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456781),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789014'),
    '123456789014',
    '2024-03-20', NULL, 'Benz Circle Site', 'active'
),
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456781),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789015'),
    '123456789015',
    '2024-04-01', NULL, 'Benz Circle Site', 'active'
),

-- Andhra Infrastructure Ltd workers
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456782),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789014'),
    '123456789014',
    '2024-02-10', NULL, 'Guntur Highway Project', 'active'
),
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456782),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789015'),
    '123456789015',
    '2024-02-15', NULL, 'Guntur Highway Project', 'active'
),
(
    (SELECT establishment_id FROM establishment WHERE mobile_number = 9123456782),
    (SELECT worker_id FROM worker WHERE aadhaar_number = '123456789016'),
    '123456789016',
    '2024-02-20', NULL, 'Guntur Highway Project', 'active'
);

-- ============================================
-- ATTENDANCE RECORDS (December 2025, January 2026, February 2026)
-- ============================================

-- Comprehensive attendance data for realistic UI testing
-- Includes: Random absences, varied check-in/out times, some incomplete days

DO $$
DECLARE
    v_date DATE;
    v_worker_id INTEGER;
    v_establishment_id INTEGER;
    v_estmt_worker_id INTEGER;
    v_check_in_hour INTEGER;
    v_check_in_minute INTEGER;
    v_check_out_hour INTEGER;
    v_check_out_minute INTEGER;
    v_is_present BOOLEAN;
    v_is_complete BOOLEAN;
BEGIN
    -- ============================================
    -- RAVI KUMAR (Aadhaar: 123456789012) at Sri Venkateswara Constructions
    -- December 2025: 22 working days, January 2026: 26 working days, February 2026: 2 days
    -- ============================================
    
    SELECT worker_id INTO v_worker_id FROM worker WHERE aadhaar_number = '123456789012';
    SELECT establishment_id INTO v_establishment_id FROM establishment WHERE mobile_number = 9123456780;
    SELECT estmt_worker_id INTO v_estmt_worker_id 
    FROM establishment_worker 
    WHERE worker_id = v_worker_id AND establishment_id = v_establishment_id;
    
    -- December 2025 (excluding Sundays: 7, 14, 21, 28)
    FOR day IN 1..31 LOOP
        v_date := DATE '2025-12-01' + (day - 1);
        
        -- Skip Sundays
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        -- 85% attendance rate (random absences)
        v_is_present := (random() < 0.85);
        
        IF v_is_present THEN
            -- Random check-in time between 8:00-8:45 AM
            v_check_in_hour := 8;
            v_check_in_minute := floor(random() * 45)::INTEGER;
            
            -- 95% chance of complete day (check-out)
            v_is_complete := (random() < 0.95);
            
            -- Check-in
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                -- Random check-out time between 5:00-6:00 PM
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 60)::INTEGER;
                
                -- Check-out
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- January 2026 (excluding Sundays: 4, 11, 18, 25)
    FOR day IN 1..31 LOOP
        v_date := DATE '2026-01-01' + (day - 1);
        
        -- Skip Sundays
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_is_present := (random() < 0.85);
        
        IF v_is_present THEN
            v_check_in_hour := 8;
            v_check_in_minute := floor(random() * 45)::INTEGER;
            v_is_complete := (random() < 0.95);
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 60)::INTEGER;
                
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- February 2026 (only 1st and 2nd - current date is Feb 2, 2026)
    FOR day IN 1..2 LOOP
        v_date := DATE '2026-02-01' + (day - 1);
        
        -- Skip Sundays
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        -- Present on both days
        v_check_in_hour := 8;
        v_check_in_minute := floor(random() * 45)::INTEGER;
        
        INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
        VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
        
        -- Feb 1st complete, Feb 2nd partial (checked in today, not yet checked out)
        IF day = 1 THEN
            v_check_out_hour := 17;
            v_check_out_minute := floor(random() * 60)::INTEGER;
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Madhurawada Site', 
                    v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
        END IF;
    END LOOP;
    
    -- ============================================
    -- LAKSHMI DEVI (Aadhaar: 123456789014) at Vijaya Builders
    -- ============================================
    
    SELECT worker_id INTO v_worker_id FROM worker WHERE aadhaar_number = '123456789014';
    SELECT establishment_id INTO v_establishment_id FROM establishment WHERE mobile_number = 9123456781;
    SELECT estmt_worker_id INTO v_estmt_worker_id 
    FROM establishment_worker 
    WHERE worker_id = v_worker_id AND establishment_id = v_establishment_id;
    
    -- December 2025
    FOR day IN 1..31 LOOP
        v_date := DATE '2025-12-01' + (day - 1);
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_is_present := (random() < 0.80); -- 80% attendance
        
        IF v_is_present THEN
            v_check_in_hour := 8;
            v_check_in_minute := floor(random() * 30)::INTEGER + 10; -- 8:10-8:40
            v_is_complete := (random() < 0.92);
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 45)::INTEGER;
                
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- January 2026
    FOR day IN 1..31 LOOP
        v_date := DATE '2026-01-01' + (day - 1);
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_is_present := (random() < 0.80);
        
        IF v_is_present THEN
            v_check_in_hour := 8;
            v_check_in_minute := floor(random() * 30)::INTEGER + 10;
            v_is_complete := (random() < 0.92);
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 45)::INTEGER;
                
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- February 2026 (1st only - absent on 2nd)
    v_date := DATE '2026-02-01';
    v_check_in_hour := 9;
    v_check_in_minute := 15;
    
    INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
    VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
            v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
    
    v_check_out_hour := 17;
    v_check_out_minute := 30;
    
    INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
    VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Benz Circle Site', 
            v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
    
    -- ============================================
    -- VENKAT RAO (Aadhaar: 123456789015) at Andhra Infrastructure
    -- ============================================
    
    SELECT worker_id INTO v_worker_id FROM worker WHERE aadhaar_number = '123456789015';
    SELECT establishment_id INTO v_establishment_id FROM establishment WHERE mobile_number = 9123456782;
    SELECT estmt_worker_id INTO v_estmt_worker_id 
    FROM establishment_worker 
    WHERE worker_id = v_worker_id AND establishment_id = v_establishment_id;
    
    -- December 2025
    FOR day IN 1..31 LOOP
        v_date := DATE '2025-12-01' + (day - 1);
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_is_present := (random() < 0.88); -- 88% attendance
        
        IF v_is_present THEN
            v_check_in_hour := 7;
            v_check_in_minute := floor(random() * 30)::INTEGER + 30; -- 7:30-8:00
            v_is_complete := (random() < 0.96);
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 60)::INTEGER + 30; -- 5:30-6:30 PM
                
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- January 2026
    FOR day IN 1..31 LOOP
        v_date := DATE '2026-01-01' + (day - 1);
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_is_present := (random() < 0.88);
        
        IF v_is_present THEN
            v_check_in_hour := 7;
            v_check_in_minute := floor(random() * 30)::INTEGER + 30;
            v_is_complete := (random() < 0.96);
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                    v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
            
            IF v_is_complete THEN
                v_check_out_hour := 17;
                v_check_out_minute := floor(random() * 60)::INTEGER + 30;
                
                INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
                VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                        v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
            END IF;
        END IF;
    END LOOP;
    
    -- February 2026 (both days present)
    FOR day IN 1..2 LOOP
        v_date := DATE '2026-02-01' + (day - 1);
        CONTINUE WHEN EXTRACT(DOW FROM v_date) = 0;
        
        v_check_in_hour := 7;
        v_check_in_minute := 45;
        
        INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_in_date_time, status)
        VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                v_date + make_time(v_check_in_hour, v_check_in_minute, 0), 'i');
        
        -- Only Feb 1st has check-out
        IF day = 1 THEN
            v_check_out_hour := 18;
            v_check_out_minute := 0;
            
            INSERT INTO attendance (establishment_id, worker_id, estmt_worker_id, work_location, check_out_date_time, status)
            VALUES (v_establishment_id, v_worker_id, v_estmt_worker_id, 'Guntur Highway Project', 
                    v_date + make_time(v_check_out_hour, v_check_out_minute, 0), 'o');
        END IF;
    END LOOP;
    
END $$;

-- ============================================
-- ADDITIONAL DEPARTMENT USERS
-- ============================================

-- Password for all department users: Same as role name + @123
-- Inspector@123, DataEntry@123, etc.

INSERT INTO department_user (department_role_id, email_id, password, contact_number, first_name, last_name, status)
VALUES
-- Inspector
(
    (SELECT department_role_id FROM department_role WHERE role_name = 'Inspector'),
    'inspector1@workerconnect.gov.in',
    '$2b$10$YourHashedPasswordHere',
    9988776655,
    'Rajesh',
    'Kumar',
    'active'
),

-- Data Entry Operator
(
    (SELECT department_role_id FROM department_role WHERE role_name = 'Data Entry Operator'),
    'dataentry1@workerconnect.gov.in',
    '$2b$10$YourHashedPasswordHere',
    9988776656,
    'Priya',
    'Sharma',
    'active'
),

-- Viewer
(
    (SELECT department_role_id FROM department_role WHERE role_name = 'Viewer'),
    'viewer1@workerconnect.gov.in',
    '$2b$10$YourHashedPasswordHere',
    9988776657,
    'Anil',
    'Verma',
    'active'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify the data:

-- SELECT COUNT(*) as total_workers FROM worker;
-- SELECT COUNT(*) as total_dependents FROM worker_dependents;
-- SELECT COUNT(*) as total_establishments FROM establishment;
-- SELECT COUNT(*) as total_worker_mappings FROM establishment_worker;
-- SELECT COUNT(*) as total_attendance_records FROM attendance;
-- SELECT COUNT(*) as total_department_users FROM department_user;

-- View worker summary:
-- SELECT 
--     w.worker_id,
--     w.full_name,
--     w.mobile_number,
--     w.aadhaar_number,
--     d.district_name,
--     c.city_name,
--     w.status
-- FROM worker w
-- LEFT JOIN district d ON w.per_district_id = d.district_id
-- LEFT JOIN city_mandal c ON w.per_city_id = c.city_id
-- ORDER BY w.worker_id;

-- View establishment summary:
-- SELECT 
--     e.establishment_id,
--     e.establishment_name,
--     e.contact_person,
--     e.mobile_number,
--     ec.category_name,
--     ew.work_nature_name,
--     e.no_of_male_workers + e.no_of_female_workers as total_workers,
--     e.status
-- FROM establishment e
-- JOIN establishment_category ec ON e.category_id = ec.category_id
-- JOIN establishment_work_nature ew ON e.work_nature_id = ew.work_nature_id
-- ORDER BY e.establishment_id;

-- View worker-establishment relationships:
-- SELECT 
--     w.full_name as worker_name,
--     e.establishment_name,
--     ew.working_from_date,
--     ew.work_location,
--     ew.status
-- FROM establishment_worker ew
-- JOIN worker w ON ew.worker_id = w.worker_id
-- JOIN establishment e ON ew.establishment_id = e.establishment_id
-- ORDER BY e.establishment_name, w.full_name;

-- View recent attendance:
-- SELECT 
--     w.full_name as worker_name,
--     e.establishment_name,
--     a.check_in_date_time,
--     a.check_out_date_time,
--     a.work_location,
--     CASE 
--         WHEN a.check_out_date_time IS NOT NULL 
--         THEN EXTRACT(EPOCH FROM (a.check_out_date_time - a.check_in_date_time))/3600 
--         ELSE NULL 
--     END as hours_worked
-- FROM attendance a
-- JOIN worker w ON a.worker_id = w.worker_id
-- JOIN establishment e ON a.establishment_id = e.establishment_id
-- WHERE a.status = 'i'
-- ORDER BY a.check_in_date_time DESC
-- LIMIT 20;
