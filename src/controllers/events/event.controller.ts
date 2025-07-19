import { Request, Response, NextFunction } from "express";
import { EventService } from "../../services/events/event.service";
import { upsertEventSchema } from "../../validations/event.validation";

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = EventService.getEvents();
    res
      .status(200)
      .json({ events, message: "Events fetched Successfully" });
  } catch (error) {
    next(error);
  }
};
export const getPaginatedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const events = await EventService.getPaginatedEvents(
      Number(page),
      Number(limit)
    );
    res.status(200).json({
       ...events,
      message: "Paginated events fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const upsertEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = upsertEventSchema.parse(req.body);
    const events = EventService.upsertEvent(validatedInput);
    res
      .status(200)
      .json({ events, message: "Events fetched Successfully" });
  } catch (error) {
    next(error);
  }
};

export const userRegisteredEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const events = await EventService.userRegisteredEvents(Number(userId));
    res.status(200).json({
      events,
      message: "Registered events fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getEventsDetailsWithRegisteredUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    const events = await EventService.getEventsDetailsWithRegisteredUsers(
      Number(eventId)
    );
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
export const getEventDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const eventDetails = await EventService.getEventDetails(Number(eventId));
    res.status(200).json(eventDetails);
  } catch (error) {
    next(error);
  }
};
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const response = await EventService.deleteEvent(Number(eventId));
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
