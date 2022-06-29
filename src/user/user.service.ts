import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserInput } from './dto/create-user-input';
import { UpdateUserInput } from './dto/update-user-input';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    })

    if(!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(data);
    const userSaved = await this.userRepository.save(user);

    if (!userSaved) {
      throw new InternalServerErrorException('Problema para criar um usuario')
    }

    return userSaved;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);

    await this.userRepository.update(user, { ...data });

    const userUpdated = this.userRepository.create({ ...user, ...data });
    return userUpdated
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findUserById(id)

    const deleted = await this.userRepository.delete(user)

    deleted ? true : false;
  }
}
