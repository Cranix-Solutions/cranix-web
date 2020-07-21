import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilesCollectComponent } from './files-collect.component';

describe('FilesCollectComponent', () => {
  let component: FilesCollectComponent;
  let fixture: ComponentFixture<FilesCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesCollectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilesCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
