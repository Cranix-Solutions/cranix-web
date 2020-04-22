import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatTableModule,
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
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
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
    EditBTNRenderer, 
    GroupIdCellRenderer,
    HwconfIdCellRenderer,
    InstituteIdCellRenderer,
    InstituteUUIDCellRenderer,
    RoomIdCellRenderer,
    UpdateRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer,
    ToolbarComponent,
  ],
  imports: [
  CommonModule,
  AgGridModule.withComponents( [
    ActionBTNRenderer, 
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    EditBTNRenderer, 
    GroupIdCellRenderer,
    HwconfIdCellRenderer,
    InstituteIdCellRenderer,
    InstituteUUIDCellRenderer,
    RoomIdCellRenderer,
    UpdateRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer
  ]),
  FormsModule,
  IonicModule,
  MatTableModule,
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
    CommonModule,
    AgGridModule,
    FormsModule,
    IonicModule,
    MatTableModule,
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
