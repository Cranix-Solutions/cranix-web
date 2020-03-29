import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
//own stuff
import { AuthenticationService } from './auth.service';
@Injectable()
export class CanActivateViaAcls implements CanActivate, CanActivateChild,CanLoad {

  constructor(private authService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      console.log('canActivate');
      console.log(next);
      console.log(state);
    return this.authService.isAuthenticated();
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('canActivateChild');
    console.log(next);
    console.log(state);
    return this.authService.isAuthenticated();
  }
  canLoad(route: Route, segments: UrlSegment[]) {
    console.log('canLoad');
    console.log(route);
    console.log(segments);
    return this.authService.isAuthenticated();
  }
}
