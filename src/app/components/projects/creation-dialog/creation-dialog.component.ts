import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../services/user-service';

export interface CreationDialogData {
  typeOfCreation: 'user' | 'project';
}

@Component({
  selector: 'app-creation-dialog',
  templateUrl: 'creation-dialog.component.html',
})
export class CreationDialog {

  nameControl = new FormControl('', [Validators.required]);

  description: string = '';
  isCreating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreationDialogData,
    public dialogRef: MatDialogRef<CreationDialog>,
    public userService: UserService
  ) {}

  async submitForm() {
    if (this.nameControl.valid) {
      this.isCreating = true;
      if (this.data.typeOfCreation === 'user')
        await this.userService.signupUser(this.nameControl.value);
      if (this.data.typeOfCreation === 'project')
        await this.userService.addProjectToUser(this.nameControl.value, this.description);
      this.isCreating = false;
      this.dialogRef.close();
    } else {
      this.nameControl.markAsDirty();
    }
  }
}