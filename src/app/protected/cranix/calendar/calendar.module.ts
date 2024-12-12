import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService  } from '@ngx-translate/core';
import { IonicSelectableHeaderTemplateDirective } from 'ionic-selectable'

import { CalendarComponent } from './calendar.component';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';


const routes: Routes = [
  {
    path: 'calendar',
    canActivate: [CanActivateViaAcls],
    component: CalendarComponent
  }
];

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    IonicSelectableHeaderTemplateDirective,
    RouterModule.forChild(routes),
    CranixSharedModule
  ],
  providers: [TranslateService]
})
export class CalendarModule { }
