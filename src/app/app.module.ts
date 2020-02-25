import { NgModule } from '@angular/core';
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

import { CranixSharedModule } from './shared/cranix-shared.module';
import { UtilsService } from './services/utils.service';
import { SystemService } from './services/system.service';
import { LanguageService } from './services/language.service';

import { ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActionsComponent } from './shared/actions/actions.component';
import { ObjectsEditComponent } from './shared/objects-edit/objects-edit.component';
import {SelectColumnsComponent } from './shared/select-columns/select-columns.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then( m => m.LoginPageModule)
  },
  { path: 'pages', 
   // canActivate: [AuthGuard],
    loadChildren: () => import('./protected/protected.module' ).then(m => m.ProtectedPageModule)
  }
];

@NgModule({
  declarations: [AppComponent,ActionsComponent,ObjectsEditComponent,SelectColumnsComponent],
  entryComponents: [ActionsComponent,ObjectsEditComponent,SelectColumnsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
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
    StatusBar,
    SplashScreen,
    UtilsService,
    TranslateService,
    SystemService,
    LanguageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
