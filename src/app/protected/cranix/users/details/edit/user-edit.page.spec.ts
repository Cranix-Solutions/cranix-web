import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserEditPage } from './user-edit.page';

describe('UserEditPage', () => {
  let component: UserEditPage;
  let fixture: ComponentFixture<UserEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
