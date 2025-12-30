import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { PlaceEntity } from './entities/place.entity';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceEntity],
  exports: [PlacesService, PlaceEntity],
})
export class PlacesModule {}