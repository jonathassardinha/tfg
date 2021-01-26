import { Component, Inject, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { Subscription } from 'rxjs';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-service';
import { CategoryService } from 'src/app/services/category-service';

export interface DialogData {
  projectId: string;
  category?: Category;
}

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  availableCategories: Category[];
  loadingCategories = false;

  selectedParent: Category = null;
  selectedColor = "#0000FF";

  editMode: boolean = false;

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    parent: new FormControl (null),
    useParentColor: new FormControl({value: false, disabled: true})
  }, {

  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public userService: UserService,
    public categoryService: CategoryService
  ) { }

  async ngOnInit() {
    if (!this.userService.categories || this.userService.categories.length === 0) {
      this.loadingCategories = true;
      await this.userService.loadUserCategories();
      this.loadingCategories = false;
    }
    this.availableCategories = this.userService.categories;
    if (this.data.category != null) {
      this.editMode = true;
      this.categoryForm.get('name').setValue(this.data.category.name);
      this.categoryForm.get('description').setValue(this.data.category.description);
      this.categoryForm.get('parent').setValue(this.data.category.parent);
      this.selectedColor = this.data.category.color;
      this.changeParent(this.data.category.parent);
    }
  }

  async submit() {
    if (this.categoryForm.valid) {
      this.editMode ? this.updateCategory() : this.saveCategory()
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null;
    if (this.selectedParent) this.categoryForm.controls.useParentColor.enable();
    else this.categoryForm.controls.useParentColor.disable();
  }

  saveCategory() {
    let name = this.categoryForm.get('name').value
    let description = this.categoryForm.get('description').value
    let parent = this.categoryForm.get('parent').value

    let category = new Category('', name, description, this.selectedColor, 'black', parent, [], []);
    this.categoryService.saveCategory(category, String(this.data.projectId));
    this.dialogRef.close();
  }

  updateCategory() {
    let name = this.categoryForm.get('name').value
    let description = this.categoryForm.get('description').value
    let parent = this.categoryForm.get('parent').value

    let categoryInfo: Partial<Category>  = { name: name, description: description, parent: parent, color: this.selectedColor }
    this.categoryService.updateCategoryContent(this.data.category, categoryInfo)
    this.dialogRef.close();
  }

}
