import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(
    email: User['email'],
    withPassword = false,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: {
        password: withPassword,
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });
  }
  findById(id: number, withPassword = false) {
    return this.userRepository.findOne({
      where: { id },
      select: { password: withPassword },
    });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateRefreshToken(userId: number, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.userRepository.save({ id: userId, hashedRefreshToken: hash });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.save({
      id: userId,
      hashedRefreshToken: undefined,
    });
  }
}
