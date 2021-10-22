import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'cranix-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss'],
})
export class AccessLogComponent implements OnInit {

  gridApi;
  columnApi;
  rowData = [];
  columnDefs = [];
  context;
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu: true
  }
  constructor(
    public authService: AuthenticationService,
    public languageS: LanguageService,
    private systemService: SystemService

  ) {
    this.context = { componentParent: this };
    this.columnDefs = [
      {
        field: 'time',
        headerName: this.languageS.trans('time')
      },{
        field: 'user',
        headerName: this.languageS.trans('user')
      },{
        field: 'sourceIp',
        headerName: this.languageS.trans('sourceIp')
      },{
        field: 'destinationIp',
        headerName: this.languageS.trans('destinationIp')
      },{
        field: 'protocol',
        headerName: this.languageS.trans('protocol')
      },{
        field: 'port',
        headerName: this.languageS.trans('port')
      }
    ]
    
  }

  ngOnInit() { 
    let sub = this.systemService.getFile("/var/log/cranix-internet-access.log").subscribe(
      (val) => {
        for ( let line of val.split("\n")) {
          let lline = line.split(";")
          this.rowData.push(
            {
              time: lline[0],
              user: lline[1],
              sourceIp: lline[2],
              destinationIp: lline[3],
              protocol: lline[4],
              port: lline[5]
            }
          )
        }
        (<HTMLInputElement>document.getElementById("logsTable")).style.height = Math.trunc(window.innerHeight * 0.63) + "px";
      }
    )
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    this.gridApi.setQuickFilter(filter);
    this.gridApi.doLayout();
  }
}
