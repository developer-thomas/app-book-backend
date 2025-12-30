import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { InputCreateUserDto } from './dto/input/input-create-user.dto';
import { InputUpdateUserDto } from './dto/input/input-update-user.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UseCase } from './usecase/usecase';
import { OutputCreateUserDto } from './dto/output/output-create-user.dto';
import { OutputUpdateUserDto } from './dto/output/output-update-user.dto';
import { OutputGetUsersDto } from './dto/output/output-get-users.dto';

@Controller('users')
export class UsersController {

  @Inject("GetOneUserUseCase")
  private readonly getOneUserUseCase: UseCase;
  
  @Inject("GetAllUsersUseCase")
  private readonly getAllUsersUseCase: UseCase;

  @Inject("CreateUserUseCase")
  private readonly createUserUseCase: UseCase

  @Inject("DeleteUserUseCase")
  private readonly deleteUserUseCase: UseCase;

  @Get()
  @ApiOperation({ summary: "Obtém todos os usuários cadastrados"})
  @ApiOkResponse({type: OutputGetUsersDto })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getAllUsers(): Promise<any> {
    return await this.getAllUsersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: "Obtém um usuário através do seu id"})
  @ApiOkResponse({type: OutputGetUsersDto })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: "id", type: "string" })
  async getOneUser(@Param('id') id: string): Promise<any> {
    return await this.getOneUserUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: "Cria um novo usuário" })
  @ApiOkResponse({ type: OutputCreateUserDto })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async createUser(@Body() createUserDto: InputCreateUserDto): Promise<any> {
    return await this.createUserUseCase.execute(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Deleta um usuário através do seu id"})
  @ApiOkResponse({ example: "Usuário excluído com sucesso!" })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: "id", type: "string" })
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.deleteUserUseCase.execute(id);
  }
}
