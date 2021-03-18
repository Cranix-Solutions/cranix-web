import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//own modules
import { CranixSharedModule } from './shared/cranix-shared.module';

//own services
import { CephalixService } from './services/cephalix.service';
import { DevicesService } from './services/devices.service';
import { EductaionService } from './services/education.service';
import { GenericObjectService } from './services/generic-object.service';
import { GroupsService } from './services/groups.service';
import { HwconfsService } from './services/hwconfs.service';
import { InformationsService } from './services/informations.services';
import { LanguageService } from './services/language.service';
import { PrintersService } from './services/printers.service';
import { RoomsService } from './services/rooms.service';
import { SecurityService } from './services/security-service';
import { SoftwareService } from './services/softwares.service';
import { SystemService } from './services/system.service';
import { UsersService } from './services/users.service';
import { UtilsService } from './services/utils.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    CranixSharedModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CephalixService,
    DevicesService,
    EductaionService,
    GenericObjectService,
    GroupsService,
    HwconfsService,
    InformationsService,
    LanguageService,
    PrintersService,
    RoomsService,
    SecurityService,
    SoftwareService,
    SystemService,
    TranslateService,
    TranslateStore,
    UsersService,
    UtilsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}

