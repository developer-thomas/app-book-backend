import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "./usecase";
import { UserRepository } from "../repositories/user.repository";
import { OutputCreateUserDto } from "../dto/output/output-create-user.dto";

@Injectable()
export class CreateUserUseCase extends UseCase {
    
    @Inject(UserRepository)
    private readonly userRepository: UserRepository;
  
    async execute(data: any): Promise<OutputCreateUserDto> {
        const user = await this.userRepository.createUser(data);

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        } 
    }
    
}