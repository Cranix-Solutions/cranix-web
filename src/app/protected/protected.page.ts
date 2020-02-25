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
      icon: 'list'
    },
    {
      title: 'Institutes',
      url: '/pages/cephalix/institutes',
      icon: 'list'
    },
    {
      title: 'Groups',
      url: '/pages/cranix/groups',
      icon: 'list'
    },
    {
      title: 'Users',
      url: '/pages/cranix/users',
      icon: 'list'
    },
    {
      title: 'HWConfs',
      url: '/pages/cranix/hwconfs',
      icon: 'list'
    },
    {
      title: 'Rooms',
      url: '/pages/cranix/rooms',
      icon: 'list'
    },
    {
      title: 'Devices',
      url: '/pages/cranix/devices',
      icon: 'list'
    }
  ];

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnInit() {
  }

}
