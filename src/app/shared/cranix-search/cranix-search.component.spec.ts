import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CranixSearchComponent } from './cranix-search.component';

describe('CranixSearchComponent', () => {
  let component: CranixSearchComponent;
  let fixture: ComponentFixture<CranixSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CranixSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CranixSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
