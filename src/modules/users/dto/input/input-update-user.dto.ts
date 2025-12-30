import { ApiProperty } from "@nestjs/swagger";

export class InputUpdateUserDto {
    id: string;

    @ApiProperty({ type: String, example: 'Paulo' })
    firstName: string;

    @ApiProperty({ type: String, example: 'Silva' })
    lastName: string;

    @ApiProperty({ type: String, example: 'Adm_12345' })
    password: string;

    @ApiProperty({ type: String, example: 'paulo@gmail.com' })
    email: string;
}