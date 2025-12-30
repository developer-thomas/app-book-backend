import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PlaceEntity } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(private placeEntity: PlaceEntity) {}

  async create(createPlaceDto: CreatePlaceDto) {
    try {
      // Validar se o usuário existe
      const userExists = await this.placeEntity.userExists(createPlaceDto.userId);
      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      // Validar datas
      const availableFrom = new Date(createPlaceDto.availableFrom);
      const availableTo = new Date(createPlaceDto.availableTo);

      if (availableFrom >= availableTo) {
        throw new BadRequestException('Available from date must be before available to date');
      }

      // Criar o lugar usando a entity
      const place = await this.placeEntity.create(createPlaceDto);
      return place
     
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create place');
    }
  }

  async findAll() {
    try {
      const places = await this.placeEntity.findAll();
      
      return places;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve places');
    }
  }

  async findOne(id: number) {
    try {
      const place = await this.placeEntity.findById(id);

      if (!place) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }

      return place
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve place');
    }
  }

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    try {
      // Verificar se o lugar existe
      const placeExists = await this.placeEntity.exists(id);
      if (!placeExists) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }

      // Se userId está sendo atualizado, verificar se o usuário existe
      if (updatePlaceDto.userId) {
        const userExists = await this.placeEntity.userExists(updatePlaceDto.userId);
        if (!userExists) {
          throw new BadRequestException('User not found');
        }
      }

      // Validar datas se fornecidas
      if (updatePlaceDto.availableFrom && updatePlaceDto.availableTo) {
        const availableFrom = new Date(updatePlaceDto.availableFrom);
        const availableTo = new Date(updatePlaceDto.availableTo);

        if (availableFrom >= availableTo) {
          throw new BadRequestException('Available from date must be before available to date');
        }
      }

      // Atualizar o lugar usando a entity
      const place = await this.placeEntity.update(id, updatePlaceDto);

      return  place
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update place');
    }
  }

  async remove(id: number) {
    try {
      // Verificar se o lugar existe
      const placeExists = await this.placeEntity.exists(id);
      if (!placeExists) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }

      // Verificar se há reservas ativas
      const hasActiveBookings = await this.placeEntity.hasActiveBookings(id);
      if (hasActiveBookings) {
        throw new BadRequestException('Cannot delete place with active bookings');
      }

      // Deletar o lugar usando a entity
      await this.placeEntity.delete(id);

      return {
        success: true,
        message: `Place with ID ${id} has been deleted successfully`
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete place');
    }
  }

  // Método adicional para buscar lugares por usuário
  async findByUserId(userId: number) {
    try {
      const places = await this.placeEntity.findByUserId(userId);
      
      return places;
     
    } catch (error) {
      throw new BadRequestException('Failed to retrieve user places');
    }
  }

  // Método adicional para buscar lugares disponíveis em um período
  async findAvailable(startDate: string, endDate: string) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new BadRequestException('Start date must be before end date');
      }

      const places = await this.placeEntity.findAvailable(startDate, endDate);

      return {
        success: true,
        message: 'Available places retrieved successfully',
        data: places,
        count: places.length,
        searchPeriod: {
          startDate,
          endDate
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve available places');
    }
  }
}
