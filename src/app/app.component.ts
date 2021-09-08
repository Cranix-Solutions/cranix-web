import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
//own services
import { AuthenticationService } from './services/auth.service';
import { GenericObjectService } from './services/generic-object.service';
import { LanguageService } from './services/language.service';
import { SecurityService } from './services/security-service';
import { InformationsService } from './services/informations.services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private genericObjectS: GenericObjectService,
    private informationServcie: InformationsService,
    private languageService: LanguageService,
    private platform: Platform,
    private router: Router,
    private securityService: SecurityService,
  ) {
    this.platform.ready();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.languageService.setInitialAppLanguage();
      this.authService.authenticationState.subscribe(state => {
        console.log("authenticationState",state)
        console.log("cephalix_token",sessionStorage.getItem('cephalix_token'))
        console.log("shortName",sessionStorage.getItem('shortName'))
        if (state) {
          if (this.authService.isAllowed('room.manage')) {
            this.securityService.getActualAccessStatus();
          }
          this.genericObjectS.initialize(true);
          if( this.authService.isAllowed('cephalix.manage')) {
            console.log('pages/cephalix/institutes/all');
            this.router.navigate(['pages/cephalix/institutes/all']);
          } else if ( this.authService.isAllowed('user.manage') ) {
            console.log('pages/cranix/users/all');
            this.router.navigate(['pages/cranix/users/all']);
          } else if ( this.authService.session['role'] == 'teachers' ) {
            console.log('pages/cranix/mygroups');
            this.router.navigate(['pages/cranix/mygroups']);
          } else {
            console.log('pages/cranix/profile/myself');
            this.router.navigate(['pages/cranix/profile/myself']);
          }
        } else if (sessionStorage.getItem('cephalix_token')) {
          this.authService.token     = sessionStorage.getItem('cephalix_token');
          this.authService.loadSession();
          this.router.navigate(['pages/cranix/users/all']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
