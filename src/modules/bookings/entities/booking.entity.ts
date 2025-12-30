import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Injectable()
export class BookingEntity {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDto) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    return this.prisma.booking.create({
      data: {
        placeId: data.placeId,
        userId: data.userId,
        startDate,
        endDate,
        totalPrice: data.totalPrice,
      },
      include: {
        place: {
          select: {
            id: true,
            title: true,
            price: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        place: {
          select: {
            id: true,
            title: true,
            price: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        place: {
          select: {
            id: true,
            title: true,
            price: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        place: {
          select: {
            id: true,
            title: true,
            price: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByPlaceId(placeId: number) {
    return this.prisma.booking.findMany({
      where: { placeId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findActiveByPlaceId(placeId: number) {
    return this.prisma.booking.findMany({
      where: { 
        placeId,
        startDate: {
          gte: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async update(id: number, data: UpdateBookingDto) {
    const updateData: any = { ...data };

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        place: {
          select: {
            id: true,
            title: true,
            price: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }

  async delete(id: number) {
    const deleted = this.prisma.booking.delete({
      where: { id }
    });

    return deleted
  }

  async exists(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!booking;
  }

  async userExists(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    return !!user;
  }

  async placeExists(placeId: number) {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: { id: true }
    });
    return !!place;
  }

  async isPlaceAvailable(placeId: number, startDate: Date, endDate: Date, excludeBookingId?: number) {
    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        placeId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } }
            ]
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } }
            ]
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } }
            ]
          }
        ]
      },
      select: { id: true }
    });
    return overlappingBookings.length === 0;
  }

  async hasConflictingBookings(placeId: number, startDate: string, endDate: string, excludeBookingId?: number) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return !(await this.isPlaceAvailable(placeId, start, end, excludeBookingId));
  }

  async getPlacePrice(placeId: number) {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: { price: true }
    });
    return place?.price;
  }
}
