import { InputCreateUserDto } from "../dto/input/input-create-user.dto";
import { User } from "@prisma/client";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { InputUpdateUserDto } from "../dto/input/input-update-user.dto";


@Injectable()
export class UserRepository {

    constructor(private prismaService: PrismaService) { }
    
    async findAll(): Promise<User[]> {
        const users = await this.prismaService.user.findMany();
        
        return users;
    }

    async findUserByEmail(data: any): Promise<User | null> {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: data.email
            }
        })

        return user;
    }

    async findUserById(id: number): Promise<User> {

        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user) {
            throw new NotFoundException("Usuário não encontrado na base de dados");
        }

        return user;
    }

    /**
     * 
     * @param data Body para atuailização do usuário
     * @returns Retorna o próprio usuário atualizado
     */
    async createUser(data: InputCreateUserDto):Promise<User> {
        
        // const exists = await this.findUserByEmail(data.email);
        
        // if(exists) {
        //     throw new ConflictException("Usuário já existe na base de dados");
        // }

        return await this.prismaService.user.create({
            data
        })
    }

    async deleteUser(id: number): Promise<User> {
        const user = await this.findUserById(id);

        return await this.prismaService.user.delete({
            where: {
                id
            }
        })
    }
}
