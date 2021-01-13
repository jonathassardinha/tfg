import { Component, OnInit } from '@angular/core';
import Source from 'src/app/data/Source';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaggingDialogComponent } from './tagging-dialog/tagging-dialog.component';
import tinymce from 'tinymce';
import { UserService } from 'src/app/services/user-service';
import { SourceService } from 'src/app/services/source-service';

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
    private router: Router,
    private snackbar: MatSnackBar,
    private fragmentDialogRef: MatDialog,
    private userService: UserService,
    private sourceService: SourceService
  ) { }

  async ngOnInit() {
    this.getSourceContent();
    this.configureEditor();
  }

  async getSourceContent() {
    if (!this.userService.currentProject) {
      this.router.navigate(['projects']);
      return;
    }
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    if (!this.userService.sources || this.userService.sources.length === 0) {
      await this.userService.loadUserSources();
      console.log(this.userService.sources);
    }
    this.currSource = this.userService.sources.find(source => source.id === sourceId);
  }

  async updateFile(){
    await this.sourceService.updateSource(this.currSource);
    this.snackbar.open('Documento atualizado', null, {
      duration: 2000,
    });
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
