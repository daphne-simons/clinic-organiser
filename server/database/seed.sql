ALTER SEQUENCE clients_id_seq RESTART WITH 1;

INSERT INTO clients (first_name, last_name, dob, mobile, email) VALUES ('Ron', 'Zertnert', '1990-01-01', '123-456-7890', '1M9jg@example.com'),
('Destroy', 'Orbison', '1991-02-02', '987-654-3210', 'ZP4bK@example.com'),
('Gertrude', 'Diamond', '1992-03-03', '555-555-5555', 'qoIiJ@example.com'), 
('Mary', 'Jane', '1993-04-04', '111-222-3333', '2VtF4@example.com');

-- INSERT INTO medical_history (client_id) VALUES (1), (2),
-- (3),
-- (4);

-- INSERT INTO tcm (client_id) VALUES (1), (2),
-- (3),
-- (4);

-- -- TREATMENTS 
-- -- MINIMUM 1X PER SEED CLIENT

-- INSERT INTO treatments (client_id, date, duration_minutes, notes) VALUES 
-- (1, '2023-01-01', 60, 'First treatment'), 
-- (1, '2024-01-01', 60, 'Second treatment'), 
-- (2, '2023-02-02', 120, 'First treatment'), 
-- (3, '2023-03-03', 180, 'First treatment'), 
-- (3, '2024-03-03', 180, 'Second treatment'), 
-- (4, '2023-04-04', 240, 'First treatment');

-- -- APPOINTMENTS 
-- -- MINIMUM 1X PER SEED CLIENT

-- INSERT INTO appointments (client_id, start_time, end_time, appointment_type, notes) VALUES 
-- (1, TO_DATE(TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD' || 'T10:00:00'), 'YYYY-MM-DD"THH24:MI:SS'), '2023-01-01T10:30:00', 'ACC', 'First appointment'), 
-- (2, '2023-02-02T11:00:00', '2023-02-02T11:30:00', 'ACC', 'First appointment'), 
-- (3, '2023-03-03T12:00:00', '2023-03-03T12:30:00', 'ACC', 'First appointment'), 
-- (4, '2023-04-04T13:00:00', '2023-04-04T13:30:00', 'Private', 'First appointment');

-- INSERT INTO forms (id, custom_fields) VALUES 
-- ('clients', '{}'),
-- ('medical_history', '{}'),
-- ('tcm', '{}'),
-- ('treatments', '{}');

-- -- TODO: add other tables for attachments and communications. 

