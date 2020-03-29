import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad } from '@angular/router';
//own stuff
import { AuthenticationService } from './auth.service';
import { Route } from '@angular/compiler/src/core';

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
    console.log('canActivate');
    console.log(next);
    console.log(state);
    return this.authService.isAuthenticated();
  }
  canLoad(route: Route) {
    console.log('canActivate');
   
    return this.authService.isAuthenticated();
  }
}