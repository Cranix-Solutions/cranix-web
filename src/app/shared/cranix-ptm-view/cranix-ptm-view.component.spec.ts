import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CranixPtmViewComponent } from './cranix-ptm-view.component';

describe('CranixPtmViewComponent', () => {
  let component: CranixPtmViewComponent;
  let fixture: ComponentFixture<CranixPtmViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CranixPtmViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CranixPtmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
