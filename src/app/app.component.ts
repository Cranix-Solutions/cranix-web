import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
//own services
import { AuthenticationService } from './services/auth.service';
import { GenericObjectService } from './services/generic-object.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private authS: AuthenticationService,
    private genericObjectS: GenericObjectService,
    private languageService: LanguageService,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.languageService.setInitialAppLanguage();
      this.authS.authenticationState.subscribe(state => {
        if (state) {
          this.genericObjectS.initialize(true);
          this.router.navigate(['pages/cephalix/institutes']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
