import faker from '@faker-js/faker';
import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createHotelTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function updateTicketIncludesHotel(ticketId: number) {
  return prisma.ticketType.update({
    where: {
      id: ticketId,
    },
    data: {
      includesHotel: true,
      isRemote: false,
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.number().toString(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}

export async function createRoomWithLimit(hotelId: number, limit: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: limit,
      hotelId,
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}
