-- Appointments table for PostgreSQL
create extension if not exists "uuid-ossp";

create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id text not null,
  patient_name text not null,
  doctor_id text not null,
  doctor_name text not null,
  department text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  reason text,
  status text not null default 'Scheduled',
  notes text,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent double booking same doctor at same start
create unique index if not exists ux_appt_doctor_start on appointments(doctor_id, start_time);
-- Helpful query index
create index if not exists ix_appt_doctor_start on appointments(doctor_id, start_time);
