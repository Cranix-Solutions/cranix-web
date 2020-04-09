import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'cranix-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss'],
})
export class ProtectedPage implements OnInit {

  public appPages = [ ];
  private defAppPages = [
    {
      title: 'Customers',
      url: '/pages/cephalix/customers',
      icon: 'albums'
    },
    {
      title: 'Institutes',
      url: '/pages/cephalix/institutes/all',
      icon: 'business'
    },
    {
      title: 'Tickets',
      url: '/pages/cephalix/tickets',
      icon: 'pricetags'
    },
    {
      title: 'Groups',
      url: '/pages/cranix/groups',
      icon: 'people'
    },
    {
      title: 'Users',
      url: '/pages/cranix/users/all',
      icon: 'person'
    },
    {
      title: 'HWConfs',
      url: '/pages/cranix/hwconfs',
      icon: 'file-tray-stacked'
    },
    {
      title: 'Rooms',
      url: '/pages/cranix/rooms',
      icon: 'home'
    },
    {
      title: 'Devices',
      url: '/pages/cranix/devices',
      icon: 'laptop'
    }
  ];

  constructor(
    public authService: AuthenticationService,
    public translateService: TranslateService
  ) { 
    for( let page of this.defAppPages ) {
      if( this.authService.isRouteAllowed(page.url)) {
        this.appPages.push(page);
      }
    }
  }
  ngOnInit() {
  }

}
