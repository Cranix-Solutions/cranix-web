import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstitutesPage } from './institutes.page';

describe('InstitutesPage', () => {
  let component: InstitutesPage;
  let fixture: ComponentFixture<InstitutesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
