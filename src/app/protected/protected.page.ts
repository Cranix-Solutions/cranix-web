import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss'],
})
export class ProtectedPage implements OnInit {

  
  public appPages = [
    {
      title: 'Customers',
      url: '/pages/cephalix/customers',
      icon: 'albums'
    },
    {
      title: 'Institutes',
      url: '/pages/cephalix/institutes',
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
      url: '/pages/cranix/users',
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
    public translateService: TranslateService,
  ) { }

  ngOnInit() {
  }

}
