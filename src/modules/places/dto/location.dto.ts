import { IsNumber, Min, Max, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { Type, Transform } from "class-transformer";

export class LocationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  staticMapImageUrl: string;
}