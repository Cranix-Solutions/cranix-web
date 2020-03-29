import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupEditPage } from './group-edit.page';

describe('GroupEditPage', () => {
  let component: GroupEditPage;
  let fixture: ComponentFixture<GroupEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
