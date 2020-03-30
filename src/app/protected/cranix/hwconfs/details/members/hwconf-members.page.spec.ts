import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HwconfMembersPage } from './hwconf-members.page';

describe('HwconfMembersPage', () => {
  let component: HwconfMembersPage;
  let fixture: ComponentFixture<HwconfMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HwconfMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HwconfMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
