import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Category from 'src/app/data/Category';
import Code from 'src/app/data/Code';
import Project from 'src/app/data/Project';
import { UserService } from 'src/app/services/user-service';
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

  fragmentText: string;
  currSourceId: string;

  availableCategories: Category[] = []
  selectedCategory: Category;

  loadingCodes = false;

  fragmentForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    parentCategory: new FormControl(null),
    useParentColor: new FormControl({value: false, disabled: true})
  });
  selectedColor: string = "#0000FF";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<TaggingDialogComponent>,
    public categoryDialog: MatDialog,
    public userService: UserService
  ) { }

  async ngOnInit() {
    this.currSourceId = this.userService.currentSource.id;
    this.fragmentText = this.data.selection.getContent();
    if (!this.userService.categories || this.userService.categories.length === 0) {
      this.loadingCodes = true;
      await this.userService.loadUserCategories();
      this.loadingCodes = false;
    }
    this.availableCategories = this.userService.categories;
  }

  async submit() {
    if (this.fragmentForm.valid) {
      let code = new Code(
        '',
        this.fragmentForm.get('name').value,
        this.fragmentText,
        this.selectedColor,
        {
          id: this.currSourceId,
          range: null
        },
        "black"
      )
      let parentCategory = this.fragmentForm.get('parentCategory').value;
      this.loadingCodes = true;
      await this.userService.addCodeToProject(code, parentCategory);
      this.loadingCodes = false;
      this.dialogRef.close()
    } else {
      this.fragmentForm.markAsDirty()
    }

  }

  changeParent(parentCategory) {
    if (parentCategory) this.fragmentForm.controls.useParentColor.enable();
    else this.fragmentForm.controls.useParentColor.disable();
  }

  newCategoryDialog() {
    let subscription = this.categoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false
    }).afterClosed();
    subscription.subscribe(() => {
      this.availableCategories = this.userService.categories;
    })
  }
}
