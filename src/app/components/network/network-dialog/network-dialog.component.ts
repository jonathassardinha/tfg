import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Network from 'src/app/data/Network';
import { UserService } from 'src/app/services/user-service';
import { NetworkService } from '../../../services/network-service';

@Component({
  selector: 'app-network-dialog',
  templateUrl: 'network-dialog.component.html',
})
export class NetworkDialog {

  nameControl = new FormControl('', [Validators.required]);
  isCreatingNetwork = false;

  constructor(
    public dialogRef: MatDialogRef<NetworkDialog>,
    public networkService: NetworkService,
    public userService: UserService
  ) {}

  async submitForm() {
    if (this.nameControl.valid) {
      this.isCreatingNetwork = true;
      await this.userService.addNetworkToUserProject(new Network('', this.nameControl.value, "New Network", [], {}));
      this.isCreatingNetwork = false;
      this.dialogRef.close();
    } else {
      this.nameControl.markAsDirty();
    }
  }
}