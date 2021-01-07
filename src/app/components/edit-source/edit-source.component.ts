import { Component, Directive, OnInit } from '@angular/core';
import Source from 'src/app/data/Source';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { DatabaseService } from 'src/app/services/database-service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaggingDialogComponent } from './tagging-dialog/tagging-dialog.component';
import tinymce from 'tinymce';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit {

  currSource = new Source('', '', '');
  tinyMceConfig: any;

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private databaseService: DatabaseService,
    private fragmentDialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.getSourceContent();
    this.configureEditor();
  }

  async getSourceContent() {
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    let source = await this.databaseService.getSourceById(sourceId);
    this.currSource = new Source(sourceId, source.title, source.content);
  }

  updateFile(): void {
    this.databaseService.updateSource(this.currSource).then(
      () => {
        this.snackbar.open('Documento atualizado', null, {
          duration: 2000,
        })
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
      toolbar:[
        'undo redo | formatselect | bold italic | \
        alignleft aligncenter alignright alignjustify \
        bullist numlist outdent indent | help | tagging',
      ],
      setup: function(editor) {
        editor.ui.registry.addButton('tagging', {
          icon: 'permanent-pen',
          text: 'Tag fragment',
          onAction: function (_) {
            component.tagFragment()
          }
        });
      }
    }
  }

  tagFragment(){
    let projectId = this.route.snapshot.paramMap.get('projId');
    this.fragmentDialogRef.open(TaggingDialogComponent,{
      autoFocus: false,
      data: {
        projectId: projectId,
        sourceId: this.currSource.id,
        selection: tinymce.activeEditor.selection
      }
    })
  }

}
