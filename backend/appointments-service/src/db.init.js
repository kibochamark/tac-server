import { pool } from './db.js';

export async function initDb() {
  const ddl = `
    -- Ensure pgcrypto for gen_random_uuid()
    create extension if not exists pgcrypto;

    create table if not exists appointments (
      id           uuid primary key default gen_random_uuid(),
      patient_id   text        not null,
      patient_name text        not null,
      doctor_id    text        not null,
      doctor_name  text        not null,
      department   text,
      start_time   timestamptz not null,
      end_time     timestamptz not null,
      reason       text,
      status       text        not null default 'Scheduled',
      notes        text,
      created_by   text,
      updated_by   text,
      created_at   timestamptz not null default now(),
      updated_at   timestamptz not null default now(),
      check (end_time > start_time)
    );

    create index if not exists idx_appointments_doctor_time on appointments(doctor_id, start_time);
    create unique index if not exists ux_appointments_doctor_start on appointments(doctor_id, start_time);
  `;
  await pool.query(ddl);
}
