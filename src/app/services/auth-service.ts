import { Injectable } from "@angular/core";

import { User, UserRepository } from "../storage/firestore/UserRepository";
import { AppError } from '../errors/app-error';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (
    private userRepository: UserRepository
  ) {}

  async getUsersByEmail(email: string) {
    return (await this.userRepository.getByProperty('email', email));
  }

  async loginUser(email: string) {
    let users: User[];
    try {
      users = await this.getUsersByEmail(email);
    } catch (error) {
      throw new AppError('Login error', 'Error getting users');
    }
    let user: User;
    if (users.length === 0) {
      try {
        user = await this.createUser(email);
      } catch (error) {
        console.log(error);
      throw new AppError('Login error', 'Error creating new user');
      }
    } else {
      user = users[0];
    }
    return user;
  }

  private async createUser(email: string) {
    return this.userRepository.createByEmail(email);
  }
}
