import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgChartsAngularModule } from 'ag-charts-angular';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
} from "@angular/material";
import { ToolbarComponent } from 'src/app/protected/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { AgGridModule } from 'ag-grid-angular';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import  { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';
import { GroupActionBTNRenderer } from 'src/app/pipes/ag-group-renderer';
import { UserActionBTNRenderer } from 'src/app/pipes/ag-user-renderer';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { RoomActionBTNRenderer } from 'src/app/pipes/ag-room-renderer';
import { DeviceActionBTNRenderer } from 'src/app/pipes/ag-device-renderer';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { GroupIdCellRenderer } from 'src/app/pipes/ag-groupid-renderer';
import { HwconfIdCellRenderer } from 'src/app/pipes/ag-hwconfid-renderer';
import { RoomIdCellRenderer } from 'src/app/pipes/ag-roomid-render';
import { DeviceIdCellRenderer } from 'src/app/pipes/ag-deviceid-renderer';
import { InstituteIdCellRenderer } from 'src/app/pipes/ag-instituteid-renderer';
import { InstituteUUIDCellRenderer, WindowRef } from 'src/app/pipes/ag-uuid-renderer';
import { UpdateRenderer } from 'src/app/pipes/ag-update-renderer';
import { UserIdCellRenderer } from 'src/app/pipes/ag-userid-renderer';
import { UserIdToNameCellRenderer } from 'src/app/pipes/ag-userid-to-name-renderer';

@NgModule({
  declarations: [ 
    ActionBTNRenderer, 
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    DeviceActionBTNRenderer,
    EditBTNRenderer, 
    GroupIdCellRenderer,
    GroupActionBTNRenderer,
    HwconfIdCellRenderer,
    InstituteIdCellRenderer,
    InstituteUUIDCellRenderer,
    RoomActionBTNRenderer,
    RoomIdCellRenderer,
    UpdateRenderer,
    UserActionBTNRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer,
    ToolbarComponent,
    YesNoBTNRenderer
  ],
  imports: [
    AgChartsAngularModule,
  CommonModule,
  AgGridModule.withComponents( [
    ActionBTNRenderer, 
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    DeviceActionBTNRenderer,
    EditBTNRenderer, 
    GroupIdCellRenderer,
    GroupActionBTNRenderer,
    HwconfIdCellRenderer,
    InstituteIdCellRenderer,
    InstituteUUIDCellRenderer,
    RoomIdCellRenderer,
    RoomActionBTNRenderer,
    UpdateRenderer,
    UserActionBTNRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer,
    YesNoBTNRenderer
  ]),
  FormsModule,
  IonicModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
  ReactiveFormsModule,
  PipesModule,
  TranslateModule,
  ], exports: [
    AgChartsAngularModule,
    CommonModule,
    AgGridModule,
    FormsModule,
    IonicModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    ToolbarComponent,
  ],
  providers:[ WindowRef ]
})
export class CranixSharedModule { }
