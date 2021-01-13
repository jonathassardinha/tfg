import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-user-login-dialog',
  templateUrl: 'user-login.component.html',
  styleUrls: ['user-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserLoginDialog {

  username: string;
  isLoadingUser = false;

  constructor(
    public dialogRef: MatDialogRef<UserLoginDialog>,
    public authService: AuthService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async loginUser() {
    this.isLoadingUser = true;
    await this.authService.loginUser(this.username);
    this.isLoadingUser = false;
    this.dialogRef.close();
  }

}