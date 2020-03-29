import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviceEditPage } from './device-edit.page';

describe('DeviceEditPage', () => {
  let component: DeviceEditPage;
  let fixture: ComponentFixture<DeviceEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
