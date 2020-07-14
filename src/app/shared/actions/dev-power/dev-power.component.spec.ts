import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DevPowerComponent } from './dev-power.component';

describe('DevPowerComponent', () => {
  let component: DevPowerComponent;
  let fixture: ComponentFixture<DevPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevPowerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DevPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
