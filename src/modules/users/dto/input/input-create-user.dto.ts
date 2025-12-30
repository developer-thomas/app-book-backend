import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
export class InputCreateUserDto {
  @ApiProperty({ type: String, example: 'Paulo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Nome deve possuir no máximo 200 caracteres' })
  firstName: string;

  @ApiProperty({ type: String, example: 'Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, {
    message: 'Sobrenome deve possuir no máximo 200 caracteres',
  })
  lastName: string;

  @ApiProperty({ type: String, example: 'Adm_12345' })
  @IsNotEmpty()
  @MaxLength(22, { message: 'Senha não deve ser maior que 22 caracteres'})
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minSymbols: 1, minNumbers: 1, minUppercase: 1 })
  password: string;

  @ApiProperty({ type: String, example: 'paulo@gmail.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

