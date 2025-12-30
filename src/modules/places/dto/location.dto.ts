import { IsNumber, Min, Max, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  staticMapImageUrl: string;
}