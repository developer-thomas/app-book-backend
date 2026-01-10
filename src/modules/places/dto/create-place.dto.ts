import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min, IsUrl, ValidateNested } from 'class-validator';
import { LocationDto } from './location.dto';
import { Type } from 'class-transformer';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  availableFrom: string;

  @IsDateString()
  availableTo: string;

  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
  
}