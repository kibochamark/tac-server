import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String },

    // date/time
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    reason: { type: String },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Scheduled',
      index: true
    },

    notes: { type: String },

    // For optimistic locking / tracing
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

// Unique constraint to avoid overlapping by same doctor at same time window could be complex, do simple index by doctor & startTime
AppointmentSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });

export default {};
