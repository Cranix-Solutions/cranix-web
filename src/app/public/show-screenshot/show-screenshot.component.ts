import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cranix-show-screenshot',
  templateUrl: './show-screenshot.component.html',
  styleUrls: ['./show-screenshot.component.scss'],
})
export class ShowScreenshotComponent implements OnInit {

  screenShot: string;
  deviceName: string;
  userName:   string;
  constructor() { }

  ngOnInit() {
    this.screenShot = sessionStorage.getItem('screenShot');
    this.deviceName = sessionStorage.getItem('deviceName');
    this.userName = sessionStorage.getItem('userName');
    sessionStorage.removeItem('screenShot');
    sessionStorage.removeItem('deviceName');
    sessionStorage.removeItem('userName');
  }
}
