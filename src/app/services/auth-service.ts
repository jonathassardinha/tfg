import { Injectable } from "@angular/core";

import { UserRepository } from "../storage/firestore/UserRepository";
import { AppError } from '../errors/app-error';
import User from '../data/User';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (
    private userRepository: UserRepository
  ) {}

  async getUsersByUsername(username: string) {
    return (await this.userRepository.getByProperty('username', username));
  }

  async signupUser(username: string) {
    let users: User[];
    try {
      users = await this.getUsersByUsername(username);
    } catch (error) {
      throw new AppError('Login error', 'Error getting users');
    }
    if (users.length !== 0) throw new AppError('Singup error', 'User already exists');
    return await this.userRepository.createByUsername(username);
  }

  async loginUser(username: string) {
    let users: User[];
    try {
      users = await this.getUsersByUsername(username);
    } catch (error) {
      throw new AppError('Login error', 'Error getting users');
    }
    return users[0];
  }
}
