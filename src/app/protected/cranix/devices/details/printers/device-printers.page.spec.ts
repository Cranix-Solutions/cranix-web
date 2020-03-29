import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviceMembersPage } from './device-members.page';

describe('DeviceMembersPage', () => {
  let component: DeviceMembersPage;
  let fixture: ComponentFixture<DeviceMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
