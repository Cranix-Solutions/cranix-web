import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//own
import { CephalixService } from 'src/app/services/cephalix.service';
import { InstitutesPageModule } from 'src/app/protected/cephalix/institutes/institutes.module';
import { CustomersPageModule } from 'src/app/protected/cephalix/customers/customers.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    InstitutesPageModule,
    CustomersPageModule
  ],
  providers:[CephalixService]
})
export class CephalixModule { }
