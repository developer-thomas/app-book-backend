import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private bookingEntity: BookingEntity) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      // Validar se o lugar existe
      const placeExists = await this.bookingEntity.placeExists(createBookingDto.placeId);
      if (!placeExists) {
        throw new BadRequestException('Place not found');
      }

      // Validar se o usuário existe
      const userExists = await this.bookingEntity.userExists(createBookingDto.userId);
      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      // Validar datas
      const startDate = new Date(createBookingDto.startDate);
      const endDate = new Date(createBookingDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      if (startDate < new Date()) {
        throw new BadRequestException('Start date cannot be in the past');
      }

      // Verificar se o lugar está disponível no período
      const isAvailable = await this.bookingEntity.isPlaceAvailable(
        createBookingDto.placeId,
        startDate,
        endDate
      );

      if (!isAvailable) {
        throw new BadRequestException('Place is not available for the selected period');
      }

      // Criar a reserva usando a entity
      const booking = await this.bookingEntity.create(createBookingDto);

      return booking;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create booking');
    }
  }

  async findAll() {
    try {
      const bookings = await this.bookingEntity.findAll();
      
      return {
        success: true,
        message: 'Bookings retrieved successfully',
        data: bookings,
        count: bookings.length
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve bookings');
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingEntity.findById(id);

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      return {
        booking
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve booking');
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      // Verificar se a reserva existe
      const bookingExists = await this.bookingEntity.exists(id);
      if (!bookingExists) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // Se placeId está sendo atualizado, verificar se o lugar existe
      if (updateBookingDto.placeId) {
        const placeExists = await this.bookingEntity.placeExists(updateBookingDto.placeId);
        if (!placeExists) {
          throw new BadRequestException('Place not found');
        }
      }

      // Se userId está sendo atualizado, verificar se o usuário existe
      if (updateBookingDto.userId) {
        const userExists = await this.bookingEntity.userExists(updateBookingDto.userId);
        if (!userExists) {
          throw new BadRequestException('User not found');
        }
      }

      // Validar datas se fornecidas
      if (updateBookingDto.startDate && updateBookingDto.endDate) {
        const startDate = new Date(updateBookingDto.startDate);
        const endDate = new Date(updateBookingDto.endDate);

        if (startDate >= endDate) {
          throw new BadRequestException('Start date must be before end date');
        }

        if (startDate < new Date()) {
          throw new BadRequestException('Start date cannot be in the past');
        }
      }

      // Verificar disponibilidade se datas ou lugar foram alterados
      if (updateBookingDto.startDate || updateBookingDto.endDate || updateBookingDto.placeId) {
        const currentBooking = await this.bookingEntity.findById(id);
        if (!currentBooking) {
          throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        
        const placeId = updateBookingDto.placeId || currentBooking.placeId;
        const startDate = updateBookingDto.startDate || currentBooking.startDate.toISOString();
        const endDate = updateBookingDto.endDate || currentBooking.endDate.toISOString();

        const hasConflicts = await this.bookingEntity.hasConflictingBookings(
          placeId,
          startDate,
          endDate,
          id
        );

        if (hasConflicts) {
          throw new BadRequestException('Place is not available for the selected period');
        }
      }

      // Atualizar a reserva usando a entity
      const booking = await this.bookingEntity.update(id, updateBookingDto);

      return booking;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update booking');
    }
  }

  async remove(id: number) {
    try {
      // Verificar se a reserva existe
      const bookingExists = await this.bookingEntity.exists(id);
      if (!bookingExists) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // Verificar se a reserva já começou
      const booking = await this.bookingEntity.findById(id);
      if (booking && new Date(booking.startDate) <= new Date()) {
        throw new BadRequestException('Cannot delete booking that has already started');
      }

      // Deletar a reserva usando a entity
      await this.bookingEntity.delete(id)

      return {
        success: true,
        message: `Booking with ID ${id} has been deleted successfully`
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete booking');
    }
  }

  // Método adicional para buscar reservas por usuário
  async findByUserId(userId: number) {
    try {
      const bookings = await this.bookingEntity.findByUserId(userId);
      
      return bookings
      
    } catch (error) {
      throw new BadRequestException('Failed to retrieve user bookings');
    }
  }

  // Método adicional para buscar reservas por lugar
  async findByPlaceId(placeId: number) {
    try {
      const bookings = await this.bookingEntity.findByPlaceId(placeId);
      
      return {
        success: true,
        message: 'Place bookings retrieved successfully',
        data: bookings,
        count: bookings.length
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve place bookings');
    }
  }

  // Método adicional para buscar reservas ativas de um lugar
  async findActiveByPlaceId(placeId: number) {
    try {
      const bookings = await this.bookingEntity.findActiveByPlaceId(placeId);
      
      return {
        success: true,
        message: 'Active place bookings retrieved successfully',
        data: bookings,
        count: bookings.length
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve active place bookings');
    }
  }
}
