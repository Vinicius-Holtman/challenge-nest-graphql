import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserInput } from './dto/create-user-input';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const user = await this.userRepository.create(data);
    const userSaved = await this.userRepository.save(user);

    if (!userSaved) {
      throw new InternalServerErrorException('Problema para criar um usuario')
    }

    return userSaved;
  }
}
