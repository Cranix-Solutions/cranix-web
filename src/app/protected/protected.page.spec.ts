import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProtectedPage } from './protected.page';

describe('ProtectedPage', () => {
  let component: ProtectedPage;
  let fixture: ComponentFixture<ProtectedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProtectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
