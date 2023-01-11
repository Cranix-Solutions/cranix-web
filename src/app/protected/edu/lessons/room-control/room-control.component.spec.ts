import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomControlComponent } from './room-control.component';

describe('RoomControlComponent', () => {
  let component: RoomControlComponent;
  let fixture: ComponentFixture<RoomControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomControlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
