import { IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID do lugar a ser reservado',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  placeId: number;

  @ApiProperty({
    description: 'ID do usuário que está fazendo a reserva',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'Data de início da reserva',
    example: '2025-11-15T00:00:00Z',
    format: 'date-time'
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Data de fim da reserva',
    example: '2025-11-20T00:00:00Z',
    format: 'date-time'
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Preço total da reserva',
    example: 750.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({
    description: 'Número de hóspedes para a reserva',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  numberOfGuests: number;
}
