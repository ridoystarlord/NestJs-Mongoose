import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
import { LoginDto, SignUpDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: LoginDto) {
    const dbUser = await this.validateUser(user.email, user.password);
    if (!dbUser) {
      throw new NotFoundException('User not Found');
    }
    return {
      token: this.jwtService.sign({ _id: dbUser?._id?.toString() }),
    };
  }

  async signUp(body: SignUpDto): Promise<User | undefined> {
    const hashPassword = await bcrypt.hash(body.password, 10);
    return this.userModel.create({
      name: body.name,
      email: body.email,
      password: hashPassword,
    });
  }
}
