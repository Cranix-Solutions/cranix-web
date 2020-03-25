import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupMembersPage } from './group-members.page';

describe('GroupMembersPage', () => {
  let component: GroupMembersPage;
  let fixture: ComponentFixture<GroupMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
