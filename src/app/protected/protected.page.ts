import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';

import { AuthenticationService } from 'src/app/services/auth.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'cranix-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss'],
})
export class ProtectedPage implements OnInit {
  public activePath = "";
  public appPages = [];
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
      url: '/pages/cranix/profile',
      icon: 'man'
    },
    {
      title: 'MyGroups',
      url: '/pages/cranix/mygroups',
      icon: "people"
    }
  ];

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    public translateService: TranslateService,
    public menuCtrl: MenuController,
    public utilService: UtilsService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        let path = event.url.split("/");
        this.activePath = "/" + path[1] + "/" + path[2] + "/" + path[3]
      }
    })
    for (let page of this.defAppPages) {
      console.log(page)
      if (this.authService.isRouteAllowed(page.url)) {
        console.log("show it")
        this.appPages.push(page);
      }
    } 
  }
  ngOnInit() {
  }

  async openMenu() {
    await this.menuCtrl.open();
  }

  async toggleMenu() {
    await this.menuCtrl.toggle(); //Add this method to your button click function
  }
}
