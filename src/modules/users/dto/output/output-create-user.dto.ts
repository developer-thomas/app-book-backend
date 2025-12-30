import { ApiProperty } from "@nestjs/swagger";

export class OutputCreateUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
    
    @ApiProperty()
    email: string;
}