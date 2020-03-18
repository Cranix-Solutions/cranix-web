import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserDetailsPage } from './user-details.page';

describe('UserDetailsPage', () => {
  let component: UserDetailsPage;
  let fixture: ComponentFixture<UserDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
