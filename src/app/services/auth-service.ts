import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { User, UserRepository } from "../storage/firestore/UserRepository";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  public userLogEvent: EventEmitter<string> = new EventEmitter();

  constructor (
    private userRepository: UserRepository
  ) {}

  async getUsersByEmail(email: string) {
    return (await this.userRepository.getByProperty('email', email));
  }

  async loginUser(email: string, storeEmail: boolean = true) {
    let users = await this.getUsersByEmail(email);
    if (users.length === 0) {
      this.user = await this.createUser(email);
    } else {
      this.user = users[0];
    }
    if (storeEmail) localStorage.setItem('userEmail', email);
    this.userLogEvent.emit('login');
  }

  logoutUser() {
    this.user = null;
    localStorage.removeItem('userEmail');
    this.userLogEvent.emit('logout');
  }

  private async createUser(email: string) {
    return this.userRepository.createByEmail(email);
  }
}
