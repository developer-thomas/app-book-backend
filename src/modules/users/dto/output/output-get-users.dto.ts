import { ApiProperty } from "@nestjs/swagger";
import { OutputCreateUserDto } from "./output-create-user.dto";

export class OutputGetUsersDto extends OutputCreateUserDto {
    @ApiProperty({example: 'REGISTERED'})
    status: string;

    @ApiProperty({example: new Date()})
    created_at: Date;

    @ApiProperty({example: new Date()})
    updated_at: Date;
}