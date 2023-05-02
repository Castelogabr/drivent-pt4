import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: false,
      Room: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function findBookingCountByRoomId(roomId: number) {
  return prisma.booking.groupBy({
    by: ['roomId'],
    _count: {
      roomId: true,
    },
    where: {
      roomId,
    },
  });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
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
  getBookingById,
  getBookingsRoom,
  createBooking,
  findBookingByUserId,
  findBookingCountByRoomId,
};

export default bookingRepository;
