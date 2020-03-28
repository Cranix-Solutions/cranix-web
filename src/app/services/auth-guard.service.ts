import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad } from '@angular/router';
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
    console.log('canActivate');
    console.log(next);
    console.log(state);
    return this.authService.isAuthenticated();
  }
  canLoad(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('canActivate');
    console.log(next);
    console.log(state);
    return this.authService.isAuthenticated();
  }
}