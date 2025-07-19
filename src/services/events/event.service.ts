import { prismaClient } from "../../config/db";
import { UpsertEventInput } from "../../validations/event.validation";

export const EventService = {
  getEvents: async () => {
    try {
      const events = await prismaClient.events.findMany();
      return events;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error}`);
    }
  },
  getEventDetails: async (eventId: number) => {
    try {
      const event = await prismaClient.events.findUnique({
        where: { id: eventId },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event details: ${error}`);
    }
  },
  userRegisteredEvents: async (userId: number) => {
    try {
      const registrations = await prismaClient.registrations.findMany({
        where: { userId },
        include: {
          events: true,
        },
      });
      return registrations.map((reg) => reg.events);
    } catch (error) {
      throw new Error(`Failed to fetch registered events: ${error}`);
    }
  },
  upsertEvent: async (input: UpsertEventInput) => {
    const { id, ...eventData } = input;

    if (id) {
      const updatedEvent = await prismaClient.events.update({
        where: { id },
        data: eventData,
      });

      return {
        message: "Event updated successfully",
        event: updatedEvent,
      };
    } else {
      const createdEvent = await prismaClient.events.create({
        data: eventData,
      });

      return {
        message: "Event created successfully",
        id: createdEvent.id,
        event: createdEvent,
      };
    }
  },
  getEventsDetailsWithRegisteredUsers: async (eventId: number) => {
    try {
      const event = await prismaClient.events.findUnique({
        where: { id: eventId },
        include: {
          registrations: {
            include: {
              users: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  mobile: true,
                },
              },
            },
          },
        },
      });

      if (!event) {
        throw new Error("Event not found");
      } else {
        const registeredUsers = event.registrations.map((reg) => ({
          id: reg.users.id,
          username: reg.users.username,
          email: reg.users.email,
          mobile: reg.users.mobile,
          registrationStatus: reg.status,
          registrationDate: reg.registrationDate,
        }));

        const eventDetails = {
          id: event.id,
          name: event.name,
          description: event.description,
          eventDate: event.eventDate,
          startTime: event.startTime,
          endTime: event.endTime,
          address: event.address,
          eventType: event.eventType,
          eventStatus: event.eventStatus,
          organizerName: event.organizerName,
          organizerContact: event.organizerContact,
          imageUrl: event.imageUrl,
          registeredUsers,
        };

        return {
          message: "Event details fetched successfully",
          event: eventDetails,
        };
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw new Error("Internal server error");
    }
  },
  deleteEvent: async (eventId: number) => {
    const event = await prismaClient.events.delete({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      throw new Error("Event does not exist");
    }
    return {id: event.id, message: "event deleted successfully" };
  },
  getPaginatedEvents: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      prismaClient.events.findMany({
        skip,
        take: limit,
      }),
      prismaClient.events.count(),
    ]);

    return {
      page,
      limit,
      events,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  },
};
