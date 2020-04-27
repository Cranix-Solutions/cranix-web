import { Component, OnInit } from '@angular/core';
import * as agCharts from 'ag-charts-community';

import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'cranix-system-status',
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss'],
})
export class SystemStatusComponent implements OnInit {

  systemStatus: any = {};
  series = [
      {
        type: 'pie',
        angleKey: 'count',
        labelKey: 'name'
      }
    ];

  constructor(
    public systemService: SystemService
  ) {
  }

  ngOnInit() {
    let subM = this.systemService.getStatus().subscribe(
      (val) => {
        for (let key of Object.keys(val)) {
          this.systemStatus[key]['series'] = this.series;
          this.systemStatus[key]['data'] = val[key];
        }
        console.log(this.systemStatus);
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
}
