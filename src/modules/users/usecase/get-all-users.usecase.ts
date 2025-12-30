import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "./usecase";
import { UserRepository } from "../repositories/user.repository";
import { OutputGetUsersDto } from "../dto/output/output-get-users.dto";

@Injectable()
export class GetAllUsersUseCase implements UseCase{

    @Inject(UserRepository)
    private readonly userRepository: UserRepository;

    async execute(): Promise<OutputGetUsersDto[]> {
        const users = await this.userRepository.findAll()
        
        return users.map((user) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            created_at: user.createdAt,
            updated_at: user.updatedAt
        }))
    }
}