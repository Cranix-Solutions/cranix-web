import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, UrlSegment } from '@angular/router';
//own stuff
import { AuthenticationService } from './auth.service';
@Injectable()
export class CanActivateViaAcls implements CanActivate, CanActivateChild,CanLoad {

  constructor(private authService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      /*console.log('canActivate');
      console.log(next);
      console.log(state);*/
    return this.authService.isRouteAllowed(state.url);
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*console.log('canActivateChild');
    console.log(next);
    console.log(state);*/
    return this.authService.isAuthenticated();
  }
  canLoad(route, segments: UrlSegment[]) {
    console.log('canLoad');
    console.log(route);
    return this.authService.isRouteAllowed(route.path);
  }
}
