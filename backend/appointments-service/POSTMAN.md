# Appointments Service API (Postman Guide)

Base URL
- Set a Postman environment variable: baseUrl = http://localhost:5000
- Header for JSON requests: Content-Type: application/json

Notes
- ID is a UUID returned as `id` from the API.
- Allowed status values: "Scheduled", "Completed", "Cancelled", "No-Show".
- Dates are ISO 8601 (e.g., 2025-07-25T10:00:00.000Z).
- If GET/PATCH by id returns 400 due to validation, update `appointments.routes.js` to use `param('id').isUUID()` instead of `isMongoId()`.

Endpoints

1) Health
- GET {{baseUrl}}/health
- 200: { "status": "ok", "service": "appointments-service", "db": "up" }

2) Create appointment
- POST {{baseUrl}}/api/v1/appointments
- Body (JSON):
{
  "patientId": "p1",
  "patientName": "John Doe",
  "doctorId": "d1",
  "doctorName": "Dr. Sarah Wilson",
  "department": "Cardiology",
  "startTime": "2025-07-25T10:00:00.000Z",
  "endTime": "2025-07-25T10:30:00.000Z",
  "reason": "Follow up",
  "status": "Scheduled",
  "notes": "Bring reports",
  "createdBy": "admin@tac",
  "updatedBy": "admin@tac"
}
- Tests (Postman): store id for later
pm.environment.set('appointmentId', pm.response.json().id);

3) List appointments
- GET {{baseUrl}}/api/v1/appointments?doctorId=d1&from=2025-07-25T00:00:00.000Z&to=2025-07-26T00:00:00.000Z
- Optional query params: doctorId, patientId, status, from, to

4) Get by id
- GET {{baseUrl}}/api/v1/appointments/{{appointmentId}}

5) Update appointment
- PATCH {{baseUrl}}/api/v1/appointments/{{appointmentId}}
- Body (JSON): include any updatable fields
{
  "startTime": "2025-07-25T11:00:00.000Z",
  "endTime": "2025-07-25T11:30:00.000Z",
  "notes": "Rescheduled",
  "updatedBy": "admin@tac"
}

6) Update status
- PATCH {{baseUrl}}/api/v1/appointments/{{appointmentId}}/status
- Body (JSON):
{
  "status": "Completed",
  "updatedBy": "admin@tac"
}

Typical workflow in Postman
1. Call Health to confirm service is up.
2. Create appointment; Tests tab stores `appointmentId`.
3. List appointments (optionally filter by doctorId/date range).
4. Get by id using `{{appointmentId}}`.
5. Update appointment or Update status.

Troubleshooting
- 409/400 with conflict message: time window overlaps another appointment for the same doctor.
- 400 validation on id: change route validator to `isUUID()`.
- 503 on /health: database connection issue; verify `DATABASE_URL`.
