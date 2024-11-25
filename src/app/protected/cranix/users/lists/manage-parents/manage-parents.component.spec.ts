import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParentsComponent } from './manage-parents.component';

describe('ManageParentsComponent', () => {
  let component: ManageParentsComponent;
  let fixture: ComponentFixture<ManageParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageParentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
