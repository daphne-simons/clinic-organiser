# Clinic Organiser

Prototype for an acupuncture clinic management system that features appointment scheduling, client records, treatment notes, and body chart annotations. 

## Getting started

- Clone this repo and `npm i`
- Create a local Postgres db for development and another testing instance (eg one db called `clinic_organiser` and another called `testing_clinic_organiser`)
- Copy the `.env.example` file and rename it to `.env`, then fill the detials in using credentials you created when making the db
- Run `npm run migrate` in your terminal
- Run `npm run seed` in your terminal

## Scripts: 

- `npm run dev` for local development
- `npm run build` for production build
- `npm run preview` for local preview
- `npm run start` for production start
- `npm run drop-all-tables` for dropping all tables
- `npm run migrate` for database migrations
- `npm run seed` for database seeding
- `npm run test` for testing (currently only puppeteer)

## Stack Overview: 

### Frontend:
- React + TypeScript 
- Material UI for rapid UI development
- React Big Calendar [docs here](https://jquense.github.io/react-big-calendar/examples/?path=/docs/guides-timezones--page)
- React Query (TanStack Query) for data fetching/caching
- Fabric.js or Konva.js for body chart drawing functionality
- Electron js

### Backend:
- Node.js + Express 
- PostgreSQL for db
- SQL for querying 
- Multer for file uploads
- Sharp for image processing/optimization

### File Storage:
- AWS S3 or Cloudinary for images/documents (body charts, x-rays, reports)

### Deployment: 
- Database on Railway
- a downloadable executable file with Electron 

### Testing:
- Vitest
- Puppeteer
