import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "./usecase";
import { UserRepository } from "../repositories/user.repository";
import { OutputGetUsersDto } from "../dto/output/output-get-users.dto";

@Injectable()
export class DeleteUserUseCase implements UseCase {

    @Inject(UserRepository)
    private readonly userRepository: UserRepository;

    async execute(id: number): Promise<any> {
        await this.userRepository.deleteUser(id);
        
        return {
            message: "Usuário excluído com sucesso!"
        }
    }
}