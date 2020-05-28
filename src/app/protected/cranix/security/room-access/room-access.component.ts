import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cranix-room-access',
  templateUrl: './room-access.component.html',
  styleUrls: ['./room-access.component.scss'],
})
export class RoomAccessComponent implements OnInit {

  segment = 'list';
  constructor() { }

  ngOnInit() {}
  segmentChanged(event) {
    this.segment = event.detail.value;
  }
  restartFirewall() {
    //TODO
  }
  addStatus() {
    //TODO
  }
}
