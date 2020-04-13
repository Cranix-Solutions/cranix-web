import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//own
import { CustomersPageModule } from 'src/app/protected/cephalix/customers/customers.module';
import { InstitutesPageModule } from 'src/app/protected/cephalix/institutes/institutes.module';
import { TicketsPageModule } from 'src/app/protected/cephalix/tickets/tickets.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomersPageModule,
    IonicModule,
    InstitutesPageModule,
    TicketsPageModule
  ],
  providers:[]
})
export class CephalixModule { }
