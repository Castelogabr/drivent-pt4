import { Booking } from '@prisma/client';
import { prisma } from '@/config';

type NewBookings = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateBookings = Omit<Booking, 'createdAt' | 'updatedAt'>;

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBooking(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
async function getBookingsRoom(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

const bookingRepository = {
  getBooking,
  createBooking,
  getBookingsRoom,
};

export default bookingRepository;
