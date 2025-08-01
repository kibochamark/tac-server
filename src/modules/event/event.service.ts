import { PrismaClient, Severity, Eventstatus } from '@prisma/client';


const prisma = new PrismaClient();

// Create a new event
export const createEvent = async (data: {
  patientId: string;
  loggerId: string;
  type: string;
  severity: Severity;
  description: string;
   imageUrl?: string;
}) => {
  return prisma.event.create({
    data: {
      patientId: data.patientId,
      loggerId: data.loggerId,
      type: data.type,
      severity: data.severity,
      description: data.description,
      imageUrl: data.imageUrl || null,
    },
  });
};

// Fetch all events for a patient
export const getEventsByPatient = async (patientId: string) => {
  return prisma.event.findMany({
    where: { patientId },
    orderBy: { dateLogged: 'desc' },
  });
};

// Update event status

export const updateEventStatus = async (eventId: string, status: Eventstatus) => {
  return await prisma.event.update({
    where: { id: eventId },
    data: {
      status: { set: status }
    }
  });
};
export const getAllEvents = async () => {
  return await prisma.event.findMany({
    include: {
      patient: true,
      logger: true,
    },
  });
};
export const getEventByIdService = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
  });
};

