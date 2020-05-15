import { Component, OnInit } from '@angular/core';

import { SystemConfig } from 'src/app/shared/models/data-model';
import { SystemService } from 'src/app/services/system.service';
@Component({
  selector: 'cranix-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.scss'],
})
export class SystemConfigComponent implements OnInit {

  configs: SystemConfig[] = [];
  toShow = "Basis";
  constructor(
    public systemService: SystemService
  ) { }

  ngOnInit() {
    let sub = this.systemService.getSystemConfiguration().subscribe(
      (val) => { this.configs = val },
      (err) => { console.log(err) },
      () => { sub.unsubscribe() }
    )
  }

  segmentChanged(event) {
    this.toShow = event.detail.value;
    console.log(event)
  }
}
