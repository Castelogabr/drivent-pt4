import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const booking = await bookingService.postBooking(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === 'ForbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const roomId = Number(req.body.roomId);
    const bookingId = Number(req.params.bookingId);
    const { userId } = req;

    if (!roomId || !bookingId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    await bookingService.updateBooking(userId, roomId, bookingId);

    return res.status(httpStatus.OK).send({ bookingId: bookingId });
  } catch (error) {
    if (error.name === 'Forbidden') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
