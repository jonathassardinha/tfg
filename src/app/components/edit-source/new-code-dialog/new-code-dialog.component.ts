import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import Category from 'src/app/data/Category';
import Code from 'src/app/data/Code';
import { CategoryService } from 'src/app/services/category-service';
import { CodeService } from 'src/app/services/code-service';

interface DialogData {
  code?: Code
}

@Component({
  selector: 'app-new-code-dialog',
  templateUrl: './new-code-dialog.component.html',
  styleUrls: ['./new-code-dialog.component.scss']
})

export class NewCodeDialogComponent implements OnInit {

  editMode: boolean = false
  availableCategories: Category[];

  codeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    parent: new FormControl(null)
  })
  selectedColor = "#0000FF"
  selectedParent: Category;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<NewCodeDialogComponent>,
    public categoryService: CategoryService,
    public codeService: CodeService
  ) { }

  ngOnInit(): void {
    this.availableCategories = this.categoryService.categories.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    if (this.data.code != null) {
      this.editMode = true
      this.codeForm.get('name').setValue(this.data.code.name)
      this.codeForm.get('description').setValue(this.data.code.description)
      this.codeForm.get('parent').setValue(this.data.code.parent)
      this.selectedColor = this.data.code.color
      this.changeParent(this.data.code.parent)
    }
  }

  changeParent(parentId) {
    this.selectedParent = parentId ? this.availableCategories.find(category => category.id == parentId) : null
  }

  submit() {
    if (this.codeForm.valid) {
      this.editMode ? this.updateCode() : this.saveCode()
    } else {
      this.codeForm.markAsDirty()
    }
  }

  saveCode() {
    let name = this.codeForm.get('name').value
    let description = this.codeForm.get('description').value
    let parent = this.codeForm.get('parent').value
    let code = new Code('', name, description, [], this.selectedColor, parent)
    this.dialogRef.close(code)
  }

  async updateCode() {
    let name = this.codeForm.get('name').value
    let description = this.codeForm.get('description').value
    let parent = this.codeForm.get('parent').value

    let codeInfo: Partial<Code>  = { name: name, description: description, parent: parent, color: this.selectedColor }
    await this.codeService.updateCodeContent(this.data.code, codeInfo)
    this.dialogRef.close(true);
  }

}
