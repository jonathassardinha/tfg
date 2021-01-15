import { Component, OnInit } from '@angular/core';

import Source from 'src/app/data/Source';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common'
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  currSource = new Source('', '', '');
  tinyMceConfig: any;

  constructor(
    private snackbar: MatSnackBar,
    private location: Location,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.configureEditor()
  }

  async saveFile() {
    await this.userService.addSourceToProject(this.currSource);
    this.snackbar.open('Documento salvo', null, {
      duration: 2000,
    });
    this.location.back();
  }

  verifyFields() {
    return (this.currSource.title && this.currSource.content)
  }

  configureEditor(){
    this.tinyMceConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      height: 500,
      menubar: false,
      placeholder: 'Start to write your document here',
      plugins: [
        'advlist autolink lists link image charmap print',
        'preview anchor searchreplace visualblocks code',
        'fullscreen insertdatetime media table paste',
        'help wordcount'
      ],
      toolbar:
        'undo redo | formatselect | bold italic | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | help'
    }
  }

}
