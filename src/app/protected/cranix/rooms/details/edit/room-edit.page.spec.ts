import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomEditPage } from './room-edit.page';

describe('RoomEditPage', () => {
  let component: RoomEditPage;
  let fixture: ComponentFixture<RoomEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
