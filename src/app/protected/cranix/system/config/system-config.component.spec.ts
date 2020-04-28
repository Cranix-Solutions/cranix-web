import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SystemConfigComponent } from './system-config.component';

describe('SystemConfigComponent', () => {
  let component: SystemConfigComponent;
  let fixture: ComponentFixture<SystemConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemConfigComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
