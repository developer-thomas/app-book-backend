import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';

@Injectable()
export class PlaceEntity {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlaceDto) {
    const availableFrom = new Date(data.availableFrom);
    const availableTo = new Date(data.availableTo);

    return this.prisma.place.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        availableFrom,
        availableTo,
        userId: data.userId,
        placeLocation: {
          create: {
            lat: data.location.lat,
            lng: data.location.lng,
            address: data.location.address,
            staticMapImageUrl: data.location.staticMapImageUrl
          }
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
      }
    });
  }

  async findAll() {
    return this.prisma.place.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
          }
        },
        placeLocation: {
          select: {
            id: true,
            lat: true,
            lng: true,
            address: true,
            staticMapImageUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: number) {
    return this.prisma.place.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        booking: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        placeLocation: {
          select: {
            id: true,
            lat: true,
            lng: true,
            address: true,
            staticMapImageUrl: true,
          }
        }
      }
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.place.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
          }
        },
        placeLocation: {
          select: {
            id: true,
            lat: true,
            lng: true,
            address: true,
            staticMapImageUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findAvailable(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.prisma.place.findMany({
      where: {
        AND: [
          {
            availableFrom: {
              lte: start
            }
          },
          {
            availableTo: {
              gte: end
            }
          },
          {
            booking: {
              none: {
                OR: [
                  {
                    AND: [
                      { startDate: { lte: start } },
                      { endDate: { gte: start } }
                    ]
                  },
                  {
                    AND: [
                      { startDate: { lte: end } },
                      { endDate: { gte: end } }
                    ]
                  },
                  {
                    AND: [
                      { startDate: { gte: start } },
                      { endDate: { lte: end } }
                    ]
                  }
                ]
              }
            }
          }
        ]
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
        price: 'asc'
      }
    });
  }

  async update(id: number, data: UpdatePlaceDto) {
    const updateData: any = { ...data };

    // Converter strings de data para Date se fornecidas
    if (data.availableFrom) {
      updateData.availableFrom = new Date(data.availableFrom);
    }
    if (data.availableTo) {
      updateData.availableTo = new Date(data.availableTo);
    }

    return this.prisma.place.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        placeLocation: {
          select: {
            id: true,
            lat: true,
            lng: true,
            address: true,
            staticMapImageUrl: true,
          }
        }
      }
    });
  }

  async delete(id: number) {
    return this.prisma.place.delete({
      where: { id }
    });
  }

  async exists(id: number) {
    const place = await this.prisma.place.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!place;
  }

  async hasActiveBookings(id: number) {
    const activeBookings = await this.prisma.booking.findMany({
      where: {
        placeId: id,
        startDate: {
          gte: new Date()
        }
      },
      select: { id: true }
    });
    return activeBookings.length > 0;
  }

  async userExists(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    return !!user;
  }
}
