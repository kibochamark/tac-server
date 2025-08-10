# Appointments Service (Node.js + Express + Mongoose)

Microservice for managing patient appointments. Aligns with TAC dashboard screenshots and tasks.

Features
- Create appointment (conflict check by doctor/time window)
- View single appointment
- List appointments with filters (doctor, patient, status, date range)
- Update appointment details
- Update status (Scheduled, Completed, Cancelled, No-Show)
- Mock email notification on creation
- Health check: GET /health

How to run
1. Copy `.env.example` to `.env` and adjust values.
2. Install deps:
```bash
cd backend/appointments-service
npm install
```
3. Start service:
```bash
npm run dev
```
Service runs on http://localhost:4003

HTTP examples
```
POST http://localhost:4003/api/v1/appointments
Content-Type: application/json

{
  "patientId": "p1", "patientName": "John Doe",
  "doctorId": "d1", "doctorName": "Dr. Sarah Wilson",
  "startTime": "2025-07-25T10:00:00.000Z",
  "endTime": "2025-07-25T10:30:00.000Z",
  "reason": "Follow up"
}
```
```
GET http://localhost:4003/api/v1/appointments?doctorId=d1&from=2025-07-25T00:00:00.000Z&to=2025-07-26T00:00:00.000Z
```
```
PATCH http://localhost:4003/api/v1/appointments/{{id}}
Content-Type: application/json

{ "status": "Cancelled" }
```

Notes on Prisma
- The main repo uses Prisma for other modules. This service uses Mongoose against MongoDB. It remains independent as a microservice. No Prisma required here.
