import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetquotaComponent } from './setquota.component';

describe('SetquotaComponent', () => {
  let component: SetquotaComponent;
  let fixture: ComponentFixture<SetquotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetquotaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetquotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
