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

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED') {
    throw forbiddenError();
  }
}

async function postBooking(roomId: number, userId: number) {
  await checkBooking(userId);

  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) {
    throw notFoundError();
  }
  const bookings = await bookingRepository.getBooking(userId);
  if (!bookings) throw forbiddenError();

  const checkBookings = await bookingRepository.getBookingsRoom(bookings.roomId);
  if (room.capacity <= checkBookings.length) throw forbiddenError();

  return await bookingRepository.createBooking(roomId, userId);
}

const bookingService = {
  getBooking,
  postBooking,
};

export default bookingService;
