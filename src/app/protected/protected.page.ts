import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from 'src/app/services/auth.service';
import { MenuController } from '@ionic/angular';

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
      icon: 'room'
    },
    {
      title: 'Devices',
      url: '/pages/cranix/devices',
      icon: 'desktop'
    },
    {
      title: 'Softwares',
      url: '/pages/cranix/softwares',
      icon: 'software'
    },
    {
      title: 'System',
      url: '/pages/cranix/system',
      icon: 'settings'
    },
    {
      title: 'Security',
      url: '/pages/cranix/security',
      icon: 'security'
    },
    {
      title: 'Lessons',
      url: '/pages/edu/lessons/roomcontrol',
      icon: 'school'
    },
    {
      title: 'Profile',
      url: '/pages/cranix/profile/myself',
      icon: 'man'
    },
    {
      title: 'MyGroups',
      url: '/pages/cranix/mygroups',
      icon: "people"
    }
  ];

  constructor(
    public authService: AuthenticationService,
    public translateService: TranslateService,
    public menuCtrl: MenuController
  ) { 
    console.log(`Urls are: ${JSON.stringify(this.defAppPages)}`)
    for( let page of this.defAppPages ) {
      console.log(`Checking acl ${JSON.stringify(page)}`)
      if( this.authService.isRouteAllowed(page.url)) {
        this.appPages.push(page);
        console.log(`Adding url to menu: ${JSON.stringify(page)}`)
      }
      
    }

  }
  ngOnInit() {
  }

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
}
