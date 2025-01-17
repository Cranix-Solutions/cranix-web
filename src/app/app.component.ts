import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
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
  token: string
  error: string
  constructor(
    public authService: AuthenticationService,
    private genericObjectS: GenericObjectService,
    private languageService: LanguageService,
    private platform: Platform,
    private router: Router,
    private storage: Storage
  ) {
  }

  ngOnInit() {
    console.log("AppComponenet ngOnInit");
    this.storage.create();
    this.initializeApp();
  }

  initializeApp() {
    console.log("AppComponenet initializeApp");
    console.log(this.router.config)
    const params = new URL(window.location.href).searchParams

    this.platform.ready().then(() => {
      if (params.has("token") || this.error) {
        //Sending the token as url parameter grands only access to the page defined in the session of the token.
        this.token = params.get('token') 
        console.log(this.token)
        this.authService.setupSessionByToken(this.token)
      } else {
        this.authService.authenticationState.subscribe(state => {
          console.log("pathname :" + window.location.pathname);
          if (window.location.pathname != '/login') {
            this.authService.requestedPath = window.location.pathname.substring(1);
          }
          if (this.authService.session) {
            console.log("token :" + this.authService.session.token);
          }
          console.log("authenticationState", state)
          console.log("cephalix_token", sessionStorage.getItem('cephalix_token'))
          console.log("shortName", sessionStorage.getItem('shortName'))
          if (state) {
            if (!this.authService.session.mustSetup2fa) {
              this.genericObjectS.initialize(true);
            }
            if (this.authService.session.mustSetup2fa) {
              console.log('initializeApp: 2FA must be set up');
              this.router.navigate(['pages/cranix/profile/crx2fa']);
            } else if (this.authService.session.mustChange) {
              this.genericObjectS.warningMessage(this.languageService.trans('Your password is expired. You have to change it.'));
              console.log('initializeApp: Password must be changed');
              this.router.navigate(['pages/cranix/profile/myself']);
            } else if (this.authService.requestedPath) {
              console.log('initializeApp: requestedPath is defined');
              this.router.navigate([this.authService.requestedPath]);
              this.authService.requestedPath = undefined;
            } else if (this.authService.isAllowed('cephalix.manage')) {
              console.log('pages/cephalix/institutes/all');
              this.router.navigate(['pages/cephalix/institutes/all']);
            } else if (this.authService.isAllowed('user.manage')) {
              console.log('pages/cranix/users/all');
              this.router.navigate(['pages/cranix/users/all']);
            } else if (this.authService.session['role'] == 'teachers') {
              console.log('pages/cranix/mygroups');
              this.router.navigate(['pages/cranix/mygroups']);
            } else {
              console.log('pages/cranix/profile/myself');
              this.router.navigate(['pages/cranix/profile/myself']);
            }
          } else if (sessionStorage.getItem('screenShot')) {
            this.router.navigate(['public/showScreen']);
          } else if (sessionStorage.getItem('cephalix_token')) {
            this.authService.token = sessionStorage.getItem('cephalix_token');
            this.authService.loadSession();
            this.router.navigate(['pages/cranix/users/all']);
          } else {
            this.router.navigate(['login']);
          }
        });
      }
    });
  }
}
