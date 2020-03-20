import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstituteSyncedObjectsComponent } from './institute-synced-objects.component';

describe('InstituteSyncedObjectsComponent', () => {
  let component: InstituteSyncedObjectsComponent;
  let fixture: ComponentFixture<InstituteSyncedObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteSyncedObjectsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstituteSyncedObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
