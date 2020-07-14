import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypositiveComponent } from './mypositive.component';

describe('MypositiveComponent', () => {
  let component: MypositiveComponent;
  let fixture: ComponentFixture<MypositiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypositiveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypositiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
