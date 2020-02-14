import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cranix-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss'],
})
export class ProtectedPage implements OnInit {

  
  public appPages = [
    {
      title: 'Institutes',
      url: '/pages/cephalix/institutes',
      icon: 'list'
    },
    {
      title: 'Users',
      url: '/pages/cranix/users',
      icon: 'list'
    },
    {
      title: 'Groups',
      url: 'cranix/groups',
      icon: 'list'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
