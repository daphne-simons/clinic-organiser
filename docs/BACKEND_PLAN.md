# Backend Implementation Plan / Research

## PostgreSQL with JSONB columns
Why this is ideal:

- Schema flexibility: Store dynamic form schemas and data in JSONB columns while maintaining relational integrity for core entities (patients, appointments, etc.)
- Query performance: PostgreSQL's JSONB is highly optimized with GIN indexes, allowing fast queries on dynamic fields
- Hybrid approach: Keep structured data (patient ID, timestamps) in regular columns, dynamic form data in JSONB
- Rich querying: Can query, filter, and aggregate on dynamic fields efficiently
- Example structure:

```sql
-- Core patient table
patients (id, name, email, created_at, custom_data JSONB)

-- Form definitions
form_templates (id, name, schema JSONB, created_at)

-- Dynamic entries
form_entries (id, patient_id, form_template_id, data JSONB, created_at)

``` 

### What is JSONB?
JSONB stands for "JSON Binary" - it's PostgreSQL's optimized way of storing JSON data.

The key differences:

Regular JSON column:
- Stores JSON as plain text
- Preserves exact formatting, whitespace, key order
- Slower to query because it has to parse the text every time

JSONB column:
- Stores JSON in a binary format (hence "JSON Binary")
- Removes whitespace, doesn't preserve key order
- Much faster to query because it's pre-parsed
- Supports indexing for lightning-fast lookups

Why it's perfect for your use case:

``` sql
-- Instead of having rigid columns like this:
patients (id, name, email, blood_pressure, allergies, notes)

-- You can have flexible storage like this:
patients (id, name, email, custom_data JSONB)
Where custom_data might contain:
``` 

```json
{
  "blood_pressure": "120/80",
  "allergies": ["peanuts", "shellfish"],
  "treatment_history": [
    {"date": "2024-01-15", "treatment": "acupuncture", "points": ["LI4", "ST36"]}
  ],
  "custom_field_123": "whatever your acupuncturist wants to track"
}
```

The magic: You can query this dynamic data almost as fast as regular columns:

```sql
-- Find patients with high blood pressure
SELECT * FROM patients WHERE custom_data->>'blood_pressure' LIKE '14%/%';

-- Find patients with specific allergies
SELECT * FROM patients WHERE custom_data->'allergies' ? 'peanuts';
This lets your acupuncturist create any fields she wants without you having to modify the database schema!
```

## 1. Backend Project Setup

### Install Dependencies
```bash
# Core dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install pg 
npm install express-rate-limit express-validator
npm install multer uuid

# Development dependencies
npm install -D @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer @types/uuid
npm install -D typescript ts-node nodemon concurrently
npm install -D @types/pg
```

pkg.json should look something like this: 
```json
// package.json
{
  "name": "acupuncture-backend",
  "version": "1.0.0",
  "description": "Backend for acupuncture clinic management",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "migrate": "tsx scripts/migrate.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.0.3",
    "joi": "^17.9.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/pg": "^8.10.2",
    "@types/cors": "^2.8.13",
    "@types/joi": "^17.2.3",
    "typescript": "^5.1.3",
    "nodemon": "^2.0.22",
    "tsx": "^3.12.7"
  }
}
``` 

### TypeScript Configuration
```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
/ tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "removeComments": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 2. Database Setup

### DB Schemas and Migration - PostgreSQL

<!-- // src/database/schema.sql  -->
```sql
-- Create database schema with JSONB support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table with core fields + JSONB for flexibility
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Core client fields
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE,
  gender VARCHAR(20),
  occupation VARCHAR(100),
  mobile VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  address TEXT,
  
  -- Emergency contact info
  emergency_contact_name VARCHAR(100),
  emergency_contact_number VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  
  -- Reference info
  gp VARCHAR(100),
  referred_by VARCHAR(100),
  previously_received_acupuncture VARCHAR(10),
  
  -- Flexible fields stored as JSONB
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  
);

-- Medical history with boolean fields + JSONB for custom conditions
CREATE TABLE medical_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Custom medical conditions and fields
  custom_fields JSONB DEFAULT '{}',
  UNIQUE(client_id)
);

-- TCM assessments with flexible JSONB storage
CREATE TABLE tcm (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  custom_fields JSONB DEFAULT '{}',
);

-- Treatments with core fields + JSONB for treatment details
CREATE TABLE treatments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Core treatment info
  date DATE NOT NULL,
  duration_minutes INTEGER,
  -- Flexible treatment details
  notes TEXT,
  -- All custom treatment data in JSONB
  custom_fields jsonb [default: `{}`]
);

-- Appointments
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  appointment_type VARCHAR(50),
  -- Appointment details
  notes TEXT,
  -- Custom appointment data
  custom_fields JSONB DEFAULT '{}'
);

-- Forms
CREATE TABLE forms (
  id VARCHAR(50) PRIMARY KEY,
  custom_fields JSONB DEFAULT '{}'
)
-- 

-- Indexes for better performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_mobile ON clients(mobile);
CREATE INDEX idx_clients_custom_fields ON clients USING GIN(custom_fields);

CREATE INDEX idx_medical_history_client_id ON medical_history(client_id);
CREATE INDEX idx_medical_history_custom_conditions ON medical_history USING GIN(custom_conditions);

CREATE INDEX idx_tcm_client_id ON tcm(client_id);
CREATE INDEX idx_tcm_assessment_data ON tcm USING GIN(assessment_data);

CREATE INDEX idx_treatments_client_id ON treatments(client_id);
CREATE INDEX idx_treatments_date ON treatments(treatment_date);
CREATE INDEX idx_treatments_data ON treatments USING GIN(treatment_data);

CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_history_updated_at BEFORE UPDATE ON medical_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcm_updated_at BEFORE UPDATE ON tcm FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
``` 

### Migration: 

```typescript
// scripts/migrate.ts
import pool from '../src/database/connection';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrate(): Promise<void> {
  try {
    console.log('Starting database migration...');
    
    const schemaSQL = readFileSync(
      join(__dirname, '../src/database/schema.sql'),
      'utf8'
    );
    
    await pool.query(schemaSQL);
    console.log('Database migration completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

## 3. Environment Configuration

### .env file
```env

// .env
DATABASE_URL=postgresql://username:password@localhost:5432/acupuncture_db
PORT=3000
NODE_ENV=development

```

## 4. Core Server Setup

### src/config/database.ts
```typescript
import { Pool } from 'pg';

// PostgreSQL connection
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// src/database/connection.ts
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

export default pool;

```

### src/types/index.ts

```typescript

TBC 

```



### src/middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

### src/middleware/validation.ts
```typescript
/ src/middleware/validation.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const clientSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  dob: Joi.date().optional(),
  gender: Joi.string().max(20).optional(),
  occupation: Joi.string().max(100).optional(),
  mobile: Joi.string().max(20).optional(),
  email: Joi.string().email().max(100).optional(),
  address: Joi.string().optional(),
  emergency_contact_name: Joi.string().max(100).optional(),
  emergency_contact_number: Joi.string().max(20).optional(),
  emergency_contact_relationship: Joi.string().max(50).optional(),
  gp: Joi.string().max(100).optional(),
  referred_by: Joi.string().max(100).optional(),
  previously_received_acupuncture: Joi.string().max(10).optional(),
  notes: Joi.string().optional(),
  custom_fields: Joi.object().optional()
});

const treatmentSchema = Joi.object({
  client_id: Joi.number().integer().positive().required(),
  treatment_date: Joi.date().required(),
  duration_minutes: Joi.number().integer().positive().optional(),
  treatment_type: Joi.string().max(50).optional(),
  practitioner_name: Joi.string().max(100).optional(),
  points_used: Joi.array().items(Joi.string()).optional(),
  treatment_notes: Joi.string().optional(),
  client_feedback: Joi.string().optional(),
  treatment_data: Joi.object().optional(),
  cost: Joi.number().positive().optional(),
  payment_status: Joi.string().valid('pending', 'paid', 'cancelled').optional()
});

const appointmentSchema = Joi.object({
  client_id: Joi.number().integer().positive().required(),
  scheduled_at: Joi.date().required(),
  duration_minutes: Joi.number().integer().positive().optional(),
  appointment_type: Joi.string().max(50).optional(),
  status: Joi.string().valid('scheduled', 'confirmed', 'cancelled', 'completed').optional(),
  notes: Joi.string().optional(),
  custom_fields: Joi.object().optional()
});

const tcmSchema = Joi.object({
  client_id: Joi.number().integer().positive().required(),
  assessment_data: Joi.object().optional(),
  pulse_quality: Joi.string().max(50).optional(),
  tongue_description: Joi.string().optional(),
  constitution_type: Joi.string().max(50).optional(),
  constitution_description: Joi.string().optional(),
  custom_fields: Joi.object().optional()
});

// etc etc. 

```

# !!! The following Core API Routes are with Redis - TAKE REDIS OUT OF EQUATION.

### src/routes/clients.ts
```typescript
import { Router } from 'express';
import { pool } from '../config/database';
import { redisService } from '../services/redisService';
import { validateClient, validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all clients
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cacheKey = 'clients:all';
    const cached = await redisService.getCachedQuery(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    
    // Cache the result
    await redisService.cacheQuery(cacheKey, result.rows, 300);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    // Check cache first
    const cached = await redisService.getCachedClientData(clientId);
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [clientId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client = result.rows[0];
    
    // Cache the client data
    await redisService.cacheClientData(clientId, client);
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new client
router.post('/', authenticateToken, validateClient, validateRequest, async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      dob,
      gender,
      occupation,
      mobile,
      email,
      address,
      emergency_contact_name,
      emergency_contact_number,
      emergency_contact_relationship,
      gp,
      referred_by,
      previously_received_acupuncture,
      notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO clients (
        first_name, last_name, dob, gender, occupation, mobile, email, address,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship,
        gp, referred_by, previously_received_acupuncture, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        first_name, last_name, dob, gender, occupation, mobile, email, address,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship,
        gp, referred_by, previously_received_acupuncture, notes
      ]
    );

    // Invalidate clients cache
    await redisService.invalidateCache('clients:*');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update client
router.put('/:id', authenticateToken, validateClient, validateRequest, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const updateFields = req.body;

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [clientId, ...Object.values(updateFields)];

    const result = await pool.query(
      `UPDATE clients SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Invalidate cache
    await redisService.invalidateCache(`client:${clientId}`);
    await redisService.invalidateCache('clients:*');

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### src/routes/forms.ts
```typescript
import { Router } from 'express';
import { pool } from '../config/database';
import { redisService } from '../services/redisService';
import { authenticateToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all form templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM form_templates ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching form templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form template by ID
router.get('/templates/:id', authenticateToken, async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    
    // Check cache first
    const cached = await redisService.getCachedFormTemplate(templateId);
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query('SELECT * FROM form_templates WHERE id = $1', [templateId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Form template not found' });
    }

    const template = result.rows[0];
    
    // Cache the template
    await redisService.cacheFormTemplate(templateId, template);
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching form template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new form template
router.post('/templates', authenticateToken, async (req, res) => {
  try {
    const { name, description, schema } = req.body;

    const result = await pool.query(
      'INSERT INTO form_templates (name, description, schema) VALUES ($1, $2, $3) RETURNING *',
      [name, description, JSON.stringify(schema)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating form template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save form data to treatments table
router.post('/submit/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);
    const { client_id, form_data } = req.body;

    const result = await pool.query(
      'INSERT INTO treatments (client_id, custom_data) VALUES ($1, $2) RETURNING *',
      [client_id, JSON.stringify({ template_id: templateId, ...form_data })]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save temporary form data (for multi-step forms)
router.post('/temp-save', authenticateToken, async (req, res) => {
  try {
    const { form_data } = req.body;
    const sessionId = uuidv4();

    await redisService.storeTemporaryFormData(sessionId, form_data);

    res.json({ session_id: sessionId });
  } catch (error) {
    console.error('Error saving temporary form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get temporary form data
router.get('/temp-data/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const data = await redisService.getTemporaryFormData(sessionId);

    if (!data) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching temporary form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### src/routes/treatments.ts
```typescript
import { Router } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get treatments for a client
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    
    const result = await pool.query(
      'SELECT * FROM treatments WHERE client_id = $1 ORDER BY created_at DESC',
      [clientId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching treatments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new treatment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { client_id, custom_data } = req.body;

    const result = await pool.query(
      'INSERT INTO treatments (client_id, custom_data) VALUES ($1, $2) RETURNING *',
      [client_id, JSON.stringify(custom_data)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating treatment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update treatment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const treatmentId = parseInt(req.params.id);
    const { custom_data } = req.body;

    const result = await pool.query(
      'UPDATE treatments SET custom_data = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(custom_data), treatmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating treatment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search treatments by custom data
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    
    // Example: Search for treatments where custom_data contains specific values
    const result = await pool.query(
      `SELECT t.*, c.first_name, c.last_name 
       FROM treatments t 
       JOIN clients c ON t.client_id = c.id 
       WHERE t.custom_data @> $1 
       ORDER BY t.created_at DESC`,
      [JSON.stringify(query)]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching treatments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## 7. Main Server File

### src/server.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import clientsRouter from './routes/clients';
import formsRouter from './routes/forms';
import treatmentsRouter from './routes/treatments';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Routes
app.use('/api/clients', clientsRouter);
app.use('/api/forms', formsRouter);
app.use('/api/treatments', treatmentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
```

## 8. Package.json Scripts

### Update package.json
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "psql -U your_username -d clinic_management -f schema.sql"
  }
}
```

## 9. Deployment & Hosting Options

### Option 1: Railway (Recommended for beginners)
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add PostgreSQL and Redis services
4. Set environment variables in Railway dashboard
5. Deploy automatically on git push

### Option 2: AWS (More complex, but scalable)
1. Use AWS ECS with Docker
2. RDS for PostgreSQL
3. ElastiCache for Redis
4. ALB for load balancing


## 10. Running the Application

### Development
```bash
# Start PostgreSQL and Redis locally
# Then run:
npm run dev
```

### Production
```bash
npm run build
npm start
```
