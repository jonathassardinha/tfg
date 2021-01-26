import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Category from 'src/app/data/Category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialogComponent } from 'src/app/components/categories/new-category-dialog/new-category-dialog.component'
import { UserService } from 'src/app/services/user-service';
import Code from 'src/app/data/Code';
import { NewCodeDialogComponent } from '../edit-source/new-code-dialog/new-code-dialog.component';
import { MatSidenav } from '@angular/material/sidenav';
import Fragment from 'src/app/data/Fragment';
import { FragmentService } from 'src/app/services/fragment-service';

interface ListItem {
  level: number,
  node: Code | Category
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('codeDetails') codeDetailsRef: MatSidenav;

  selectedCode: Code = null

  categories: Category[];
  codes: Code[];
  fragments: Fragment[] = []
  treeList: ListItem[]

  loadingCategories = false;
  isLoadingFragments: boolean = false

  constructor(
    private router: Router,
    private newCategoryDialog: MatDialog,
    private userService: UserService,
    private fragmentService: FragmentService
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
    this.buildTree();
  }

  openNewCategoryDialog() {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.userService.currentProject.id),
        category: null
      }
    })
  }

  edit(item: ListItem) {
    if (item.node instanceof Code) this.editCode(item.node)
    if (item.node instanceof Category) this.editCategory(item.node)
  }

  editCategory(category: Category) {
    this.newCategoryDialog.open(NewCategoryDialogComponent, {
      autoFocus: false,
      data: {
        projectId: String(this.userService.currentProject.id),
        category: category
      }
    })
  }

  editCode(code: Code) {
    this.newCategoryDialog.open(NewCodeDialogComponent, {
      autoFocus: false,
      data: {
        code: code
      }
    })
  }

  async openSidenav(item: ListItem) {
    if (item.node instanceof Code && item.node != this.selectedCode) {
      this.selectedCode = item.node
      this.codeDetailsRef.open()
      this.isLoadingFragments = true
      this.fragments = await this.fragmentService.getFragmentsByIds(item.node.fragments)
      this.isLoadingFragments = false
    }
  }

  buildTree() {
    this.treeList = []
    let parentCategories = this.categories.filter(category => !category.parent)
    let parentCodes = this.codes.filter(codes => !codes.parent)
    parentCategories.forEach(category => {
      this.place(category, 0)
    })
    parentCodes.forEach(code => this.treeList.push({
      node: code,
      level: 0
    }))
  }

  place(category: Category, level: number) {
    this.treeList.push({
      node: category,
      level: level
    })

    let childCategories = this.categories.filter(cat => cat.parent === category.id)
    childCategories.forEach(cat => {
      this.place(cat, level + 1)
    })

    let childCodes = this.codes.filter(code => code.parent === category.id)
    childCodes.forEach(code => this.treeList.push({
      node: code,
      level: level + 1
    }))
  }
}
