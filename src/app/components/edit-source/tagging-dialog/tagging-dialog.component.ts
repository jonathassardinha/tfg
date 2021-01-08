import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Category from 'src/app/data/Category';
import Code from 'src/app/data/Code';
import Project from 'src/app/data/Project';
import { CategoryService } from 'src/app/services/category-service';
import { CodeService } from 'src/app/services/code-service';
import { ProjectService } from 'src/app/services/project-service';
import { EditorSelection } from 'tinymce';
import { NewCategoryDialogComponent } from '../../categories/new-category-dialog/new-category-dialog.component';

interface DialogData {
  projectId: string;
  sourceId: string;
  selection: EditorSelection;
}

@Component({
  selector: 'app-tagging-dialog',
  templateUrl: './tagging-dialog.component.html',
  styleUrls: ['./tagging-dialog.component.scss']
})

export class TaggingDialogComponent implements OnInit {

  selectedFragment: EditorSelection;
  fragmentText: string;
  currSource: string;

  availableCategories: Category[] = []
  categorySubscription: Subscription

  currentProject: Project
  projectSubscription: Subscription


  fragmentForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    categories: new FormControl([], [Validators.required])
  })
  selectedColor: string = "#0000FF";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<TaggingDialogComponent>,
    public categoryDialog: MatDialog,
    private projectService: ProjectService,
    private codeService: CodeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    // this.getCategories();
    this.currSource = this.data.sourceId;
    this.selectedFragment = this.data.selection;
    this.fragmentText = this.decodeHtml(this.selectedFragment.getContent());
    this.setupSubscriptions()
  }

  decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // async getCategories(){
  //   let projId = '1'
  //   let project = await this.databaseService.getProjectById(projId)
  //   this.availableCategories = await this.databaseService.getCategoriesByIds(project.categories)
  // }

  setupSubscriptions(){
    this.projectSubscription = this.projectService.getProject(this.data.projectId).subscribe(
      project => this.currentProject = project
    )

    // this.categorySubscription = this.categoryService.getAllCategories().subscribe(
    //   categories => {
    //     this.availableCategories = categories.filter(category => this.currentProject.categories.includes(category.id))
    //   }
    // )
  }

  newCategoryDialog() {
    this.categoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.currentProject.id)
      }
    })
  }

  submit() {
    if (this.fragmentForm.valid) {
      let code = new Code(
        '',
        this.fragmentForm.get('name').value,
        this.fragmentText,
        this.selectedColor,
        { id: this.currSource,
          range: null },
          //range: this.selectedFragment.getRng() },
        "black"
      )
      let categories = this.fragmentForm.get('categories').value
      this.codeService.saveCode(code, categories)
      this.dialogRef.close()
    } else {
      this.fragmentForm.markAsDirty()
    }

  }


}
