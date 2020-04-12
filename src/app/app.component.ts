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
    private authService: AuthenticationService,
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
      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.genericObjectS.initialize(true);
          this.router.navigate(['pages/cranix/users/all']);
        } else if (sessionStorage.getItem('cephalix_token')) {
          this.authService.token = sessionStorage.getItem('cephalix_token');
          this.authService.loadSession();
          this.router.navigate(['pages/cranix/users/all']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
