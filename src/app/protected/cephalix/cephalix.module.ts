import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//own
import { CephalixService } from 'src/app/services/cephalix.service';
//import { ToolbarModule } from 'src/app/protected/toolbar/toolbar.module';
import { InstitutesPageModule } from 'src/app/protected/cephalix/institutes/institutes.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    InstitutesPageModule,    
  ],
  providers:[CephalixService]
})
export class CephalixModule { }
