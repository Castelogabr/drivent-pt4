import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { forbiddenError } from '@/errors/forbidden-error';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const booking = await bookingRepository.getBooking(userId);

  if (!booking || !enrollment) {
    throw notFoundError();
  }

  return booking;
}

async function checkBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function postBooking(userId: number, roomId: number) {
  await checkBooking(userId);

  const room = await hotelRepository.getRoomAndBookingById(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await checkBooking(userId);

  const room = await hotelRepository.getRoomAndBookingById(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) throw forbiddenError();

  const reservedRoom = await bookingRepository.findBookingByUserId(userId);
  if (!reservedRoom) throw forbiddenError();
  if (reservedRoom.userId !== userId || reservedRoom.userId !== bookingId) throw forbiddenError();
  await bookingRepository.updateBooking(bookingId, roomId);
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
