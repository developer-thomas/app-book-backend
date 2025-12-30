import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "./usecase";
import { UserRepository } from "../repositories/user.repository";
import { OutputGetUsersDto } from "../dto/output/output-get-users.dto";

@Injectable()
export class GetOneUserUseCase implements UseCase{

    @Inject(UserRepository)
    private readonly userRepository: UserRepository;

    async execute(id: string): Promise<OutputGetUsersDto> {
        const user = await this.userRepository.findUserById(+id);
        
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            created_at: user.createdAt,
            updated_at: user.updatedAt
        }
    }
}