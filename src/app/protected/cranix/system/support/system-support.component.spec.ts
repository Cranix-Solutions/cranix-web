import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SystemSupportComponent } from './system-support.component';

describe('SystemSupportComponent', () => {
  let component: SystemSupportComponent;
  let fixture: ComponentFixture<SystemSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSupportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
