import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { CategoryService } from 'src/app/services/category-service';
import { Subscription } from 'rxjs';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project-service';
import { UserService } from 'src/app/services/user-service';

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

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    parent: new FormControl (null),
    useParentColor: new FormControl({value: false, disabled: true})
  }, {

  })

  constructor(
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public userService: UserService
  ) { }

  async ngOnInit() {
    if (!this.userService.categories || this.userService.categories.length === 0) {
      this.loadingCategories = true;
      await this.userService.loadUserCategories();
      this.loadingCategories = false;
    }
    this.availableCategories = this.userService.categories;
  }

  async submit() {
    if (this.categoryForm.valid) {
      const category = new Category('', this.categoryForm.get('name').value, this.selectedColor, 'black', [], [], this.categoryForm.get('parent').value);
      this.loadingCategories = true;
      await this.userService.addCategoryToProject(category);
      this.loadingCategories = false;
      this.dialogRef.close();
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null;
    if (this.selectedParent) this.categoryForm.controls.useParentColor.enable();
    else this.categoryForm.controls.useParentColor.disable();
  }

}
