import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Category from 'src/app/data/Category';
import { DatabaseService } from 'src/app/services/database-service';
import { CategoryService } from 'src/app/services/category-service';
import { Subscription } from 'rxjs';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project-service';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss']
})
export class NewCategoryDialogComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  availableCategories: Category[];
  categorySubscription: Subscription;

  selectedParent: Category;
  selectedColor = "#0000FF";

  categoryForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    parent: new FormControl (null)
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string },
    public route: ActivatedRoute,
    public databaseService: DatabaseService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public categoryService: CategoryService,
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectSubscription = this.projectService.getProject(this.data.projectId).subscribe(
      project => this.currentProject = project
    )
    this.categorySubscription = this.categoryService.getAllCategories().subscribe(
      categories => {
        this.availableCategories = categories.filter(category => this.currentProject.categories.includes(category.id) && category.parent == null)
      }
    )
  }

  submit() {
    if (this.categoryForm.valid) {
      const category = new Category('', this.categoryForm.get('name').value, this.selectedColor, 'black', this.categoryForm.get('parent').value);
      this.categoryService.saveCategory(category, String(this.currentProject.id));
      this.dialogRef.close();
    } else {
      this.categoryForm.markAsDirty();
    }
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null
  }

  async getTopLevelCategories(){
    const projId = '1'
    let project = await this.projectService.getProjectById(projId)
    this.availableCategories = this.categoryService.getParentcategories(await this.categoryService.getCategoriesByIds(project.categories))
  }

}
