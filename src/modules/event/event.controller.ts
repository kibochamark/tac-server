import { Request, Response } from 'express';
import { createEvent, getEventsByPatient, updateEventStatus } from './event.service';
import { getAllEvents as fetchAllEvents } from './event.service';
import { getEventByIdService } from './event.service';


export const logEvent = async (req: Request, res: Response) => {
  try {
    const { patientId, type, severity, description } = req.body;
    const loggerId = (req as any).user.userId; // from auth middleware
    const imageUrl = req.file?.path;

    const event = await createEvent({ patientId, loggerId, type, severity, description, imageUrl });
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listEvents = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const events = await getEventsByPatient(patientId);
    res.json(events);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await fetchAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await getEventByIdService(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};


export const changeEventStatus = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const event = await updateEventStatus(eventId, status);
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


