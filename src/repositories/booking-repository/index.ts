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

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}
async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      Room: {
        connect: {
          id: roomId,
        },
      },
    },
  });
}

const bookingRepository = {
  getBooking,
  getBookingById,
  getBookingsRoom,
  createBooking,
  findBookingByUserId,
  updateBooking,
};

export default bookingRepository;
