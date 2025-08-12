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

  findByEmail(email: User['email']): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
  findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
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
