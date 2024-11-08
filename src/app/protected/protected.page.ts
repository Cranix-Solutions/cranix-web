import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss'],
})
export class ProtectedPage implements OnInit {
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
      title: 'Calendar',
      url: '/pages/cranix/calendar',
      icon: 'calendar'
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
      url: '/pages/edu/lessons',
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
    },
    {
      title: "Informations",
      url: '/pages/cranix/informations',
      icon: 'library'
    }
  ];

  public disabled: boolean = false;

  constructor(
    public location: Location,
    public authService: AuthenticationService
  ) {

    console.log(this.location.path())
    for (let page of this.defAppPages) {
      if (this.authService.isRouteAllowed(page.url)) {
        if (page.title == 'Lessons') {
          if (this.authService.isAllowed('challenge.manage')) {
            page.url = "/pages/edu/lessons/challenges"
          } else {
            page.url = "/pages/edu/lessons/tests"
          }
        }
        this.appPages.push(page);
      }
    }
  }
  ngOnInit() {
  }
}
