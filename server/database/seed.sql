ALTER SEQUENCE clients_id_seq RESTART WITH 1;

INSERT INTO clients (first_name, last_name, dob, mobile, email) VALUES ('Ron', 'Zertnert', '1990-01-01', '123-456-7890', '1M9jg@example.com'),
('Destroy', 'Orbison', '1991-02-02', '987-654-3210', 'ZP4bK@example.com'),
('Gertrude', 'Diamond', '1992-03-03', '555-555-5555', 'qoIiJ@example.com'), 
('Mary', 'Jane', '1993-04-04', '111-222-3333', '2VtF4@example.com');
ALTER SEQUENCE clients_id_seq RESTART WITH 5;

INSERT INTO medical_history (client_id) VALUES (1), (2),
(3),
(4);
ALTER SEQUENCE medical_history_id_seq RESTART WITH 5;

INSERT INTO tcm (client_id) VALUES (1), (2),
(3),
(4);
ALTER SEQUENCE tcm_id_seq RESTART WITH 5;

-- TREATMENTS 
-- MINIMUM 1X PER SEED CLIENT

INSERT INTO treatments (client_id, date, duration_minutes, notes) VALUES 
(1, '2023-01-01', 60, 'First treatment'), 
(1, '2024-01-01', 60, 'Second treatment'), 
(2, '2023-02-02', 120, 'First treatment'), 
(3, '2023-03-03', 180, 'First treatment'), 
(3, '2024-03-03', 180, 'Second treatment'), 
(4, '2023-04-04', 240, 'First treatment');
ALTER SEQUENCE treatments_id_seq RESTART WITH 5;

-- APPOINTMENTS 
-- MINIMUM 1X PER SEED CLIENT

INSERT INTO appointments (client_id, start_time, end_time, appointment_type, notes) VALUES 
(1, timezone('UTC', CURRENT_DATE) + TIME '09:00:00', timezone('UTC', CURRENT_DATE) + TIME '10:00:00', 'ACC', 'First appointment'), 
(2, timezone('UTC', CURRENT_DATE) + TIME '11:00:00', timezone('UTC', CURRENT_DATE) + TIME '12:00:00', 'ACC', 'Second appointment'), 
(3, timezone('UTC', CURRENT_DATE) + TIME '13:30:00', timezone('UTC', CURRENT_DATE) + TIME '14:00:00', 'ACC', 'Third appointment'), 
(4, timezone('UTC', CURRENT_DATE) + TIME '15:00:00', timezone('UTC', CURRENT_DATE) + TIME '16:00:00', 'Private', 'Fourth appointment');
ALTER SEQUENCE appointments_id_seq RESTART WITH 5;

INSERT INTO forms (id, custom_fields) VALUES 
('clients', '{}'),
('medical_history', '{}'),
('tcm', '{}'),
('treatments', '{}');

-- TODO: add other tables for attachments and communications. 

INSERT INTO categories (id, title, color) VALUES 
(1, 'ACC', 'blue'),
(2, 'Private', 'green');
ALTER SEQUENCE categories_id_seq RESTART WITH 3;