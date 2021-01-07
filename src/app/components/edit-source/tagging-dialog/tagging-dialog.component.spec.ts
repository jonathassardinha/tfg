import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggingDialogComponent } from './tagging-dialog.component';

describe('TaggingDialogComponent', () => {
  let component: TaggingDialogComponent;
  let fixture: ComponentFixture<TaggingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaggingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
