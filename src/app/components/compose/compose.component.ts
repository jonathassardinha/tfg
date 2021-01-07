import { Component, OnInit } from '@angular/core';

import Source from 'src/app/data/Source';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { DatabaseService } from 'src/app/services/database-service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  currSource = new Source('', '', '');
  tinyMceConfig: any;

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private databaseService: DatabaseService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.configureEditor()
  }

  saveFile(): void {
    var projId = this.route.snapshot.paramMap.get('projId');
    this.databaseService.saveSource(this.currSource, projId).then(
      () => {
        this.snackbar.open('Documento salvo', null, {
          duration: 2000,
        })
        this.location.back()
      }
    )
  }

  verifyFields() {
    return (this.currSource.title && this.currSource.content)
  }

  configureEditor(){
    const component = this
    this.tinyMceConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      height: 500,
      menubar: false,
      placeholder: 'Comece a escrever seu documento aqui',
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
