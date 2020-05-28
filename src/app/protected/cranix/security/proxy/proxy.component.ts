import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cranix-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss'],
})
export class ProxyComponent implements OnInit {

  segment='basic';

  constructor() { }

  ngOnInit() {}
  segmentChanged(event) {
    this.segment = event.detail.value;
  }

  addEditPositiveList(positiveList) {
    //TODO
  }
  writeConfig() {
    //TODO
  }
  restartProxy() {
    //TODO
  }

}
