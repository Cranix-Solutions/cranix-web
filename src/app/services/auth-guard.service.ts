import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, UrlSegment } from '@angular/router';
//own stuff
import { AuthenticationService } from './auth.service';
@Injectable()
export class CanActivateViaAcls implements CanActivate, CanActivateChild,CanLoad {

  constructor(public authService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isRouteAllowed(state.url);
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated();
  }
  canLoad(route, segments: UrlSegment[]) {
    return this.authService.isRouteAllowed(route.path);
  }
}
