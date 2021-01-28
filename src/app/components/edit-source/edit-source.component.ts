import { AfterContentInit, AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import Source from 'src/app/data/Source';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaggingDialogComponent } from './tagging-dialog/tagging-dialog.component';
import tinymce from 'tinymce';
import { UserService } from 'src/app/services/user-service';
import { SourceService } from 'src/app/services/source-service';
import { FragmentService } from 'src/app/services/fragment-service';
import Fragment from 'src/app/data/Fragment';
import Code from 'src/app/data/Code';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit, AfterContentInit {
  @ViewChild('fragmentBuilder', { read: ViewContainerRef }) fragmentListRef: ViewContainerRef;

  tinyMceConfig: any;

  currentProjectId: string = '';

  currentSourceId: string = '';
  currentSource: Source = new Source('', '', '', []);
  fragments: Fragment[];

  availableCodes: Code[] = [];

  editorConfigured = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private sourceService: SourceService,
    private fragmentService: FragmentService,
    private taggingDialogRef: MatDialog
  ) { }

  async ngOnInit() {
    if (!this.userService.currentProject) {
      this.router.navigate(['projects']);
      return;
    }

    await this.getPageContent();
  }

  async ngAfterContentInit() {
    this.configureEditor();
    this.editorConfigured = true;
    this.drawFragmentsPanel();
  }

  async updateFile(){
    await this.sourceService.updateContent(this.currentSource);
    this.snackbar.open('Document updated', null, {
      duration: 2000,
    });
  }

  async getPageContent() {
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    this.currentSource = await this.sourceService.getSourceById(sourceId);
    if (this.currentSource && this.currentSource.fragments)
      this.fragments = await this.fragmentService.getFragmentsByIds(this.currentSource.fragments);
    await this.userService.loadUserCodes();
    this.availableCodes = this.userService.codes;
    if (this.editorConfigured) this.drawFragmentsPanel();
  }

  configureEditor(){
    let component = this
    this.tinyMceConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      height: 500,
      menubar: false,
      placeholder: 'Wait for your documento to load',
      plugins: [
        'advlist autolink lists link image charmap print',
        'preview anchor searchreplace visualblocks code',
        'fullscreen insertdatetime media table paste',
        'help wordcount quickbars'
      ],
      toolbar: false,
      quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink | tagging',
      contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
      setup: function(editor) {
        editor.ui.registry.addButton('tagging', {
          icon: 'permanent-pen',
          text: 'Tag fragment',
          onAction: () => component.tagFragment()
        });
      }
    }
  }

  verifyFields() {
    return (this.currentSource.content)
  }

  tagFragment() {
    if (tinymce.activeEditor.selection.getContent() != '') {
      var fragment = this.fragmentService.buildFragment(tinymce.activeEditor, this.currentSource.id)
      this.taggingDialogRef.open(
        TaggingDialogComponent, {
          data: {
            source: this.currentSource,
            fragment: fragment
          },
          autoFocus: false
        }
      ).afterClosed().subscribe(
        async (success) => {
          if (success) {
            this.getPageContent();
          }
        }
      )
    } else {
      alert('Select a fragment of text to continue')
    }
  }

  drawFragmentsPanel() {
    if (this.currentSource.id !== '') {
      let container = document.getElementById("fragmentlist");
      this.removeAllChildren(container);
      this.fragmentService.drawFragments(tinymce.activeEditor, this.fragmentListRef, this.fragments, this.availableCodes);
      if (tinymce.activeEditor.getBody())
        container.style.height = tinymce.activeEditor.getBody().scrollHeight + "px";
      this.syncScrolls();
    }
  }

  syncScrolls() {
    var leftDiv = tinymce.editors[0].getWin();
    var rightDiv = document.getElementById("sidepanel");
    leftDiv.onscroll = function() {
      rightDiv.scrollTop = leftDiv.scrollY;
    }
  }

  removeAllChildren(parent: Node){
    let fragmentElement = this.fragmentListRef.element.nativeElement
    parent.childNodes.forEach(
      node => node != fragmentElement ? parent.removeChild(node) : ""
    )
  }

  @HostListener('window:resize')
  onResize() {
    this.drawFragmentsPanel();
  }

}
