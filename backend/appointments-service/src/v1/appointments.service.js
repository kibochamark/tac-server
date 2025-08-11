import { pool } from '../db.js';

export async function createAppointment(data) {
  // conflict check: overlapping time for same doctor
  await assertNoDoctorConflict(data.doctorId, data.startTime, data.endTime);
  const q = `
    insert into appointments (
      patient_id, patient_name,
      doctor_id, doctor_name,
      department, start_time, end_time,
      reason, status, notes, created_by, updated_by
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    returning *
  `;
  const vals = [
    data.patientId, data.patientName,
    data.doctorId, data.doctorName,
    data.department ?? null,
    new Date(data.startTime), new Date(data.endTime),
    data.reason ?? null,
    data.status ?? 'Scheduled',
    data.notes ?? null,
    data.createdBy ?? null,
    data.updatedBy ?? null,
  ];
  const { rows } = await pool.query(q, vals);
  return rows[0];
}

export async function getAppointment(id) {
  const { rows } = await pool.query('select * from appointments where id = $1', [id]);
  return rows[0] || null;
}

export async function listAppointments(query = {}) {
  const where = [];
  const vals = [];
  let i = 1;
  if (query.doctorId) { where.push(`doctor_id = $${i++}`); vals.push(query.doctorId); }
  if (query.patientId) { where.push(`patient_id = $${i++}`); vals.push(query.patientId); }
  if (query.status) { where.push(`status = $${i++}`); vals.push(query.status); }
  if (query.from) { where.push(`start_time >= $${i++}`); vals.push(new Date(query.from)); }
  if (query.to) { where.push(`start_time <= $${i++}`); vals.push(new Date(query.to)); }
  const sql = `select * from appointments ${where.length ? 'where ' + where.join(' and ') : ''} order by start_time asc`;
  const { rows } = await pool.query(sql, vals);
  return rows;
}

export async function updateStatus(id, status, updatedBy) {
  const { rows } = await pool.query(
    'update appointments set status=$2, updated_by=$3, updated_at=now() where id=$1 returning *',
    [id, status, updatedBy ?? null]
  );
  return rows[0] || null;
}

export async function updateAppointment(id, data) {
  const existing = await getAppointment(id);
  if (!existing) return null;

  const doctorId = data.doctorId ?? existing.doctor_id;
  const startTime = data.startTime ? new Date(data.startTime) : existing.start_time;
  const endTime = data.endTime ? new Date(data.endTime) : existing.end_time;
  await assertNoDoctorConflict(doctorId, startTime, endTime, id);

  const fields = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries({
    patient_id: data.patientId,
    patient_name: data.patientName,
    doctor_id: data.doctorId,
    doctor_name: data.doctorName,
    department: data.department,
    start_time: data.startTime ? new Date(data.startTime) : undefined,
    end_time: data.endTime ? new Date(data.endTime) : undefined,
    reason: data.reason,
    status: data.status,
    notes: data.notes,
    updated_by: data.updatedBy,
  })) {
    if (v !== undefined) { fields.push(`${k} = $${i++}`); vals.push(v); }
  }
  if (!fields.length) return existing;
  vals.push(id);
  const sql = `update appointments set ${fields.join(', ')}, updated_at=now() where id = $${i} returning *`;
  const { rows } = await pool.query(sql, vals);
  return rows[0] || null;
}

async function assertNoDoctorConflict(doctorId, startTime, endTime, ignoreId) {
  const sql = `
    select 1 from appointments
    where doctor_id = $1
      and start_time < $3
      and end_time > $2
      ${ignoreId ? 'and id <> $4' : ''}
    limit 1
  `;
  const vals = [doctorId, new Date(startTime), new Date(endTime)];
  if (ignoreId) vals.push(ignoreId);
  const { rowCount } = await pool.query(sql, vals);
  if (rowCount > 0) throw new Error('Doctor has a conflicting appointment in that window');
}
