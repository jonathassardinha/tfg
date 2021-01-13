import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  categories: Category[];
  categorySubscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private newCategoryDialog: MatDialog,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.categorySubscription = this.userService.userFullyLoaded.subscribe(() => {
      this.categories = this.userService.categories;
    });

    let projId = this.route.snapshot.paramMap.get('projId');
    if (this.userService.currentProject && projId !== this.userService.currentProject.id) {
      //TODO change project if ID is different
    }
    await this.userService.loadUserCategories();
    this.categories = this.userService.categories;
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.currentProject.id)
      }
    })
  }
}
