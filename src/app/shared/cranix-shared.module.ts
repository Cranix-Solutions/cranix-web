import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from 'src/app/protected/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { AgGridModule } from 'ag-grid-angular';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ApplyBTNRenderer } from 'src/app/pipes/ag-apply-renderer';
import { ApplyCheckBoxBTNRenderer } from 'src/app/pipes/ag-apply-checkbox-renderer';
import { CustomerActionRenderer } from 'src/app/pipes/ag-customer-action-renderer';
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';
import { CheckBoxBTNRenderer } from 'src/app/pipes/ag-checkbox-renderer';
import { GroupActionBTNRenderer } from 'src/app/pipes/ag-group-renderer';
import { GroupMembersPage } from 'src/app/shared/actions/group-members/group-members.page';
import { UserActionBTNRenderer } from 'src/app/pipes/ag-user-renderer';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { RoomActionBTNRenderer } from 'src/app/pipes/ag-room-renderer';
import { DeviceActionBTNRenderer } from 'src/app/pipes/ag-device-renderer';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { SoftwareEditBTNRenderer } from 'src/app/pipes/ag-software-edit-renderer';
import { GroupIdCellRenderer } from 'src/app/pipes/ag-groupid-renderer';
import { HwconfIdCellRenderer } from 'src/app/pipes/ag-hwconfid-renderer';
import { PrinterActionBTNRenderer } from 'src/app/pipes/ag-printer-renderer';
import { RoomIdCellRenderer } from 'src/app/pipes/ag-roomid-render';
import { DeviceIdCellRenderer } from 'src/app/pipes/ag-deviceid-renderer';
import { InstituteStatusRenderer } from 'src/app/pipes/ag-institute-status-renderer'
import { SyncObjectRenderer } from 'src/app/pipes/ag-sync-object-renderer'
import { InstituteActionCellRenderer } from 'src/app/pipes/ag-institute-action-renderer';
import { UpdateRenderer } from 'src/app/pipes/ag-update-renderer';
import { UserIdCellRenderer } from 'src/app/pipes/ag-userid-renderer';
import { UserIdToNameCellRenderer } from 'src/app/pipes/ag-userid-to-name-renderer';
import { FileSystemUsageRenderer } from 'src/app/pipes/ag-filesystem-usage-renderer';
import { CanActivateViaAcls } from '../services/auth-guard.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { AddDeviceComponent } from 'src/app/protected/cranix/devices/add-device/add-device.component';
import { AddPrinterComponent } from 'src/app/protected/cranix/devices/add-printer/add-printer.component';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { CreateSupport } from 'src/app/shared/actions/create-support/create-support-page';
import { SetpasswordComponent } from 'src/app/shared/actions/setpassword/setpassword.component'
import { SetquotaComponent } from 'src/app/shared/actions/setquota/setquota.component';
import { ManageDhcpComponent } from 'src/app/shared/actions/manage-dhcp/manage-dhcp.component'
import { FilesUploadComponent } from 'src/app/shared/actions/files-upload/files-upload.component'
import { FilesCollectComponent } from 'src/app/shared/actions/files-collect/files-collect.component'
import { DownloadSoftwaresComponent } from 'src/app/shared/actions/download-softwares/download-softwares.component'
import { SetContractComponent } from 'src/app/shared/actions/set-contract/set-contract.component'
import { SetValidityComponent } from 'src/app/shared/actions/set-validity/set-validity.component'
import { ShowImportComponent } from 'src/app/shared/actions/show-import/show-import.component'
import { WindowRef } from 'src/app/shared/models/ohters'
import { CranixMdListComponent } from 'src/app/shared/cranix-md-list/cranix-md-list.component'
import { QuillModule } from 'ngx-quill';
import { simpleToolbarOptions } from 'src/app/shared/models/constants'
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    ActionsComponent,
    AddDeviceComponent,
    AddPrinterComponent,
    ApplyBTNRenderer,
    ApplyCheckBoxBTNRenderer,
    ActionBTNRenderer,
    CreateSupport,
    CranixMdListComponent,
    CustomerActionRenderer,
    ObjectsEditComponent,
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    DeviceActionBTNRenderer,
    DownloadSoftwaresComponent,
    EditBTNRenderer,
    FilesCollectComponent,
    FileSystemUsageRenderer,
    FilesUploadComponent,
    GroupIdCellRenderer,
    GroupActionBTNRenderer,
    GroupMembersPage,
    HwconfIdCellRenderer,
    InstituteActionCellRenderer,
    InstituteStatusRenderer,
    ManageDhcpComponent,
    PrinterActionBTNRenderer,
    RoomActionBTNRenderer,
    RoomIdCellRenderer,
    SetpasswordComponent,
    SetquotaComponent,
    ShowImportComponent,
    SoftwareEditBTNRenderer,
    SelectColumnsComponent,
    SyncObjectRenderer,
    SetContractComponent,
    SetValidityComponent,
    UpdateRenderer,
    UserActionBTNRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer,
    ToolbarComponent,
    YesNoBTNRenderer,
    CheckBoxBTNRenderer
  ],
  imports: [
    CommonModule,
    AgChartsAngularModule,
    AgGridModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
    QuillModule.forRoot({
      modules: { toolbar: simpleToolbarOptions},
    }),
  ], exports: [
    CommonModule,
    AgChartsAngularModule,
    AgGridModule,
    FormsModule,
    IonicModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    ToolbarComponent,
    CranixMdListComponent
  ],
  providers: [WindowRef,CanActivateViaAcls ]
})
export class CranixSharedModule { }
