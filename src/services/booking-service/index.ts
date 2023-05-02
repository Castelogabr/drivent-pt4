import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const booking = await bookingRepository.getBooking(userId);

  if (!booking || !enrollment) {
    throw notFoundError();
  }

  return booking;
}

const bookingService = {
  getBooking,
};

export default bookingService;
