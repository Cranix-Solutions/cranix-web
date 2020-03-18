import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserGroupsPage } from './user-groups.page';

describe('UserGroupsPage', () => {
  let component: UserGroupsPage;
  let fixture: ComponentFixture<UserGroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
