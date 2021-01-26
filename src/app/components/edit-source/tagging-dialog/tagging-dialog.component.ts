import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Code from 'src/app/data/Code';
import Fragment from 'src/app/data/Fragment'
import Project from 'src/app/data/Project';
import Source from 'src/app/data/Source';
import { CategoryService } from 'src/app/services/category-service';
import { CodeService } from 'src/app/services/code-service';
import { FragmentService } from 'src/app/services/fragment-service';
import { ProjectService } from 'src/app/services/project-service';
import { NewCodeDialogComponent } from '../new-code-dialog/new-code-dialog.component';

interface DialogData {
  source: Source;
  fragment: Fragment;
}

@Component({
  selector: 'app-tagging-dialog',
  templateUrl: './tagging-dialog.component.html',
  styleUrls: ['./tagging-dialog.component.scss']
})

export class TaggingDialogComponent implements OnInit, OnDestroy {

  selectedFragment: Fragment;
  currentSource: Source;

  availableCodes: Code[] = []
  codeSubscription: Subscription

  currentProject: Project
  projectSubscription: Subscription

  taggingForm = new FormControl([], [Validators.required])
  codeFilter = new FormControl()

  public filteredCodes: ReplaySubject<Code[]> = new ReplaySubject<Code[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  private _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TaggingDialogComponent>,
    public codeDialog: MatDialog,
    private projectService: ProjectService,
    private codeService: CodeService,
    private fragmentService: FragmentService
  ) { }

  ngOnInit() {
    this.currentSource = this.data.source;
    this.selectedFragment = this.data.fragment
    this.currentProject = this.projectService.currentProject
    this.availableCodes = this.codeService.codes

    this.filteredCodes.next(this.availableCodes.slice());
    this.codeFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterCodes();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  newCodeDialog() {
    this.codeDialog.open(
      NewCodeDialogComponent, {
        data: {
          code: null
        }
      }
    ).afterClosed().subscribe(
      (newCode: Code) => {
        if (newCode)
          this.availableCodes.push(newCode)
          this.filterCodes()
      }
    )
  }

  async submit() {
    if (this.taggingForm.valid) {
      await this.saveFragment()
      this.dialogRef.close(true)
    } else {
      this.taggingForm.markAsDirty()
    }
  }

  async saveFragment(){
    let codes = this.taggingForm.value
    await this.fragmentService.saveFragment(
      this.selectedFragment,
      this.currentProject,
      this.currentSource,
      codes
    )
  }

  filterCodes() {
    if (!this.availableCodes) {
      return;
    }
    // get the search keyword
    let search = this.codeFilter.value;
    if (!search) {
      this.filteredCodes.next(this.availableCodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCodes.next(
      this.availableCodes.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
