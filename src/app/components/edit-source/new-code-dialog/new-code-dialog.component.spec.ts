import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCodeDialogComponent } from './new-code-dialog.component';

describe('NewCodeDialogComponent', () => {
  let component: NewCodeDialogComponent;
  let fixture: ComponentFixture<NewCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCodeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
