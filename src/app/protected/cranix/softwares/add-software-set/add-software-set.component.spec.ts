import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSoftwareSetComponent } from './add-software-set.component';

describe('AddSoftwareSetComponent', () => {
  let component: AddSoftwareSetComponent;
  let fixture: ComponentFixture<AddSoftwareSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSoftwareSetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSoftwareSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
