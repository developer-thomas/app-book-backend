import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllUsersUseCase } from './usecase/get-all-users.usecase';
import { GetOneUserUseCase } from './usecase/get-one-user.usecase';
import { DeleteUserUseCase } from './usecase/delete-user.usecase';

const CreateUserUseCaseProvider = {
  provide: 'CreateUserUseCase',
  useClass: CreateUserUseCase,
};

const GetAllUsersUseCaseProvider = {
  provide: "GetAllUsersUseCase",
  useClass: GetAllUsersUseCase
}

const GetOneUserUseCaseProvider = {
  provide: "GetOneUserUseCase",
  useClass: GetOneUserUseCase
}

const DeleteUserUseCaseProvider = {
  provide: "DeleteUserUseCase",
  useClass: DeleteUserUseCase
}

@Module({
  controllers: [UsersController],
  providers: [
    UserRepository, 
    PrismaService, 
    CreateUserUseCaseProvider, 
    GetAllUsersUseCaseProvider,
    GetOneUserUseCaseProvider,
    DeleteUserUseCaseProvider
],
  exports: [
    UserRepository, 
    CreateUserUseCaseProvider,
    GetAllUsersUseCaseProvider,
    GetOneUserUseCaseProvider,
    DeleteUserUseCaseProvider
  ]
})
export class UsersModule {}
