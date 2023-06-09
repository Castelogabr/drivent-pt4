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

  const room = await hotelRepository.findById(roomId);
  if (!room) throw notFoundError();
  const bookings = await bookingRepository.getBookingsRoom(roomId);

  if (room.capacity <= bookings.length) throw notFoundError();

  return bookingRepository.createBooking(roomId, userId);
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  await checkBooking(userId);

  const room = await hotelRepository.getRoomAndBookingById(roomId);
  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const bookingUpdated = await bookingRepository.updateBooking(bookingId, roomId);
  return bookingUpdated;
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
