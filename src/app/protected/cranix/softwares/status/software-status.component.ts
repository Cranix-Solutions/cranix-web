import { Component, OnInit } from '@angular/core';
//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SoftwareService } from 'src/app/services/softwares.service'
import { SoftwareStatus } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-software-status',
  templateUrl: './software-status.component.html',
  styleUrls: ['./software-status.component.scss'],
})
export class SoftwareStatusComponent implements OnInit {
  context;
  defaultColDef = {};
  columnDefs = [];
  softwareApi;
  softwareColumnApi;
  softwareData: SoftwareStatus[] = [];
  softwareDataBack: SoftwareStatus[] = [];
  selectedRooms = [];
  selectedSoftwares = [];
  selectedStati: string[] = [];
  rooms = [];
  softwares = [];
  stati: string[] = [];
  constructor(
    public authService: AuthenticationService,
    public softwareService: SoftwareService,
    private languageS: LanguageService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false
    };
  }

  ngOnInit() {
    this.createColumnDefs();
    this.readSoftwareData();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  exportSelected() {
    this.softwareApi.exportDataAsCsv({ onlySelected: true, fileName: 'installation-status' });
  }
  softwareDataReady(params) {
    this.softwareApi = params.api;
    this.softwareColumnApi = params.columnApi;
  }
  onQuickFilterChanged(quickFilter) {
    this.softwareApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.softwareApi.doLayout();
  }
  sizeAll() {
    var allColumnIds = [];
    this.softwareColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.softwareColumnApi.autoSizeColumns(allColumnIds);
  }
  readSoftwareData() {
    let subM = this.softwareService.getSoftwareStatus().subscribe(
      (val) => {
        this.softwareData = val;
        this.authService.log(val);
        let temp1 = [];
        let temp2 = [];
        for (let obj of this.softwareData) {
          if (temp1.indexOf(obj.softwareName) == -1) {
            temp1.push(obj.softwareName)
            this.softwares.push(
              { key: obj.softwareName, value: obj.softwareName }
            )
          }
          if (temp2.indexOf(obj.roomName) == -1) {
            temp2.push(obj.roomName)
            this.rooms.push(
              { key: obj.roomName, value: obj.roomName }
            )
          }
          if (this.stati.indexOf(obj.status) == -1) {
            this.stati.push(obj.status)
          }
        }
        this.stati.sort()
        this.softwares.sort()
        this.rooms.sort()
      },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }

  readFilteredSoftwareData() {
    if (this.softwareDataBack.length == 0) {
      this.softwareDataBack = this.softwareData;
    }
    this.softwareData = [];
    let sRooms:    string[] = [];
    let sSoftware: string[] = [];
    for( let m of this.selectedRooms ) {
      sRooms.push(m.value)
    }
    for( let m of this.selectedSoftwares ) {
      sSoftware.push(m.value)
    }
    for (let obj of this.softwareDataBack) {
      if (sRooms.length == 0 || sRooms.indexOf(obj.roomName) != -1) {
        if (sSoftware.length == 0 || sSoftware.indexOf(obj.softwareName) != -1) {
          if (this.selectedStati.length == 0 || this.selectedStati.indexOf(obj.status) != -1) {
            this.softwareData.push(obj)
          }
        }
      }
    }
  }

  createColumnDefs() {
    this.columnDefs = [
      {
        field: 'softwareName',
        headerName: this.languageS.trans('software'),
        headerCheckboxSelection: true
      },
      {
        field: 'version',
        headerName: this.languageS.trans('version'),
      },
      {
        field: 'roomName',
        headerName: this.languageS.trans('room')
      },
      {
        field: 'deviceName',
        headerName: this.languageS.trans('device')
      },
      {
        field: 'status',
        headerName: this.languageS.trans('status')
      }
    ];
  }
}
