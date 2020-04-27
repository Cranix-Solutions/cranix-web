import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import * as agCharts from 'ag-charts-community';

import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SystemService } from 'src/app/services/system.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'cranix-system-status',
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss'],
})
export class SystemStatusComponent implements OnInit {

  objectKeys: string[];
  systemStatus: any;
  series = [
      {
        type: 'pie',
        angleKey: 'count',
        labelKey: 'name'
      }
    ];
    options;

  constructor(
    public genericObject: GenericObjectService,
    public languageService: LanguageService,
    public systemService: SystemService
  ) {
    this.systemService.initModule();
  }

  ngOnInit() { 
    this.systemStatus = {};
    let subM = this.systemService.getStatus().subscribe(
      (val) => {
        this.systemStatus = {};
        this.objectKeys= Object.keys(val);
        for (let key of Object.keys(val)) {
          this.systemStatus[key] = {  
            legend: { enabled: false },
            title: { text: this.languageService.trans(key)},
            autoSize: false,
            with: 200,
            height: 200
          };
          this.systemStatus[key]['series'] = this.series;
          this.systemStatus[key]['data'] = val[key];
        }
        console.log(this.systemStatus);
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }


  update(ev: Event){
    let subM = this.systemService.update().subscribe(
      (val) => {
        console.log(this.systemStatus);
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
  restart(ev: Event){}
  shutDown(ev: Event) {}

}
