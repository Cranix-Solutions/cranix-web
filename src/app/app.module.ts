import { NgModule } from '@angular/core';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

//own modules 
import { CranixSharedModule } from './shared/cranix-shared.module';
import { DownloadSoftwaresComponent } from 'src/app/shared/actions/download-softwares/download-softwares.component';
import { UtilsService } from './services/utils.service';
import { SystemService } from './services/system.service';
import { LanguageService } from './services/language.service';

import { ActionsComponent } from './shared/actions/actions.component';
import { ShowImportComponent } from 'src/app/shared/actions/show-import/show-import.component';
import { CanActivateViaAcls } from './services/auth-guard.service';
import { CephalixService } from './services/cephalix.service';
import { DevicesService } from './services/devices.service';
import { EductaionService } from './services/education.service';
import { GenericObjectService } from './services/generic-object.service';
import { GroupsService } from './services/groups.service';
import { HwconfsService } from './services/hwconfs.service';
import { ObjectsEditComponent } from './shared/objects-edit/objects-edit.component';
import { RoomsService } from './services/rooms.service';
import { SoftwareService } from './services/softwares.service';
import { SecurityService } from './services/security-service';
import { SelectColumnsComponent } from './shared/select-columns/select-columns.component';
import { UsersService } from './services/users.service';
import { PrintersService } from './services/printers.service';
import { GroupMembersPage } from 'src/app/protected/cranix/groups/details/members/group-members.page'
import { UserGroupsPage } from 'src/app/protected/cranix/users/details/groups/user-groups.page';
import { RoomPrintersPage } from 'src/app/protected/cranix/rooms/details/printers/room-printers.page';
import { DevicePrintersComponent } from 'src/app/protected/cranix/devices/details/printers/device-printers.component';
import { AddDeviceComponent } from 'src/app/protected/cranix/devices/add-device/add-device.component';
import { AddPrinterComponent } from 'src/app/protected/cranix/devices/add-printer/add-printer.component';
//import '@ag-grid-enterprise/all-modules'
import { AddOutgoingRuleComponent } from './protected/cranix/security/firewall/add-rules/add-outgoing-rule.component';
import { AddRemoteRuleComponent } from './protected/cranix/security/firewall/add-rules/add-remote-rule.component';
import { AddEditRoomAccessComponent } from 'src/app/protected/cranix/security/room-access/add-edit-room-access/add-edit-room-access.component';
import { FilesUploadComponent } from 'src/app/shared/actions/files-upload/files-upload.component'
import { FilesCollectComponent } from 'src/app/shared/actions/files-collect/files-collect.component'
import { FirewallCanDeactivate, ProxyCanDeactivate } from 'src/app/services/security-service'
import { SetpasswordComponent } from 'src/app/shared/actions/setpassword/setpassword.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedPageModule)
  }
];

@NgModule({
  declarations: [
    AddDeviceComponent,
    AddEditRoomAccessComponent,
    AddOutgoingRuleComponent,
    AddPrinterComponent,
    AddRemoteRuleComponent,
    AppComponent,
    ActionsComponent,
    DownloadSoftwaresComponent,
    FilesUploadComponent,
    FilesCollectComponent,
    ShowImportComponent,
    ObjectsEditComponent,
    DevicePrintersComponent,
    GroupMembersPage,
    UserGroupsPage,
    RoomPrintersPage,
    SelectColumnsComponent,
    SetpasswordComponent
  ],
  entryComponents: [
    AddDeviceComponent,
    AddEditRoomAccessComponent,
    AddOutgoingRuleComponent,
    AddPrinterComponent,
    AddRemoteRuleComponent,
    ActionsComponent,
    DownloadSoftwaresComponent,
    FilesUploadComponent,
    FilesCollectComponent,
    ShowImportComponent,
    ObjectsEditComponent,
    DevicePrintersComponent,
    GroupMembersPage,
    UserGroupsPage,
    RoomPrintersPage,
    SelectColumnsComponent,
    SetpasswordComponent],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes),
    HttpClientModule,
    CranixSharedModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })],
  providers: [
    AddDeviceComponent,
    AddEditRoomAccessComponent,
    AddOutgoingRuleComponent,
    AddRemoteRuleComponent,
    CanActivateViaAcls,
    CephalixService,
    DevicesService,
    FirewallCanDeactivate,
    GenericObjectService,
    EductaionService,
    GroupsService,
    HwconfsService,
    StatusBar,
    ProxyCanDeactivate,
    RoomsService,
    SoftwareService,
    SecurityService,
    SplashScreen,
    UsersService,
    UtilsService,
    TranslateService,
    PrintersService,
    SystemService,
    LanguageService,
    SpinnerDialog,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
