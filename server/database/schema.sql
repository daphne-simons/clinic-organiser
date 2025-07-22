CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE,
  gender VARCHAR(20),
  occupation VARCHAR(100),
  mobile VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_number VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  gp VARCHAR(100),
  referred_by VARCHAR(100),
  previously_received_acupuncture VARCHAR(10),
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'
);

CREATE TABLE medical_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  custom_fields JSONB DEFAULT '{}'
);

CREATE TABLE tcm (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  custom_fields JSONB DEFAULT '{}'
);

CREATE TABLE treatments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date DATE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  appointment_type VARCHAR(50),
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'
);

CREATE TABLE forms (
  id VARCHAR(50) PRIMARY KEY,
  custom_fields JSONB DEFAULT '{}'
)