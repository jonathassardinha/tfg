import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  loadingCategories = false;

  constructor(
    private router: Router,
    private newCategoryDialog: MatDialog,
    private userService: UserService
  ) { }

  async ngOnInit() {
    if (!this.userService.currentProject) {
      this.router.navigate(['projects']);
      return;
    }

    if (!this.userService.categories || this.userService.categories.length === 0) {
      this.loadingCategories = true;
      await this.userService.loadUserCategories();
      this.loadingCategories = false;
    }
    this.categories = this.userService.categories;
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent);
    this.newCategoryDialog.afterAllClosed.subscribe(() => {
      this.categories = this.userService.categories;
    });
  }
}
