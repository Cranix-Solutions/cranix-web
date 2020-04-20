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
  memberOptions;
  columnDefs = [];
  memberApi;
  memberColumnApi;
  memberSelection: SoftwareStatus[] = [];
  memberData: SoftwareStatus[] = [];
  autoGroupColumnDef;
  institute;
  selectedList: string[] = [];

  constructor(
    public authService: AuthenticationService,
    public softwareService: SoftwareService,
    private languageS: LanguageService
    ) {
    this.context = { componentParent: this };
    this.memberOptions = {
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowSelection: 'multiple'
    }
 
   }

  ngOnInit() {
    this.roomDeviceGrouping();
    this.readMembers();
  }
  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
  }

  onMemberSelectionChanged() {
    this.memberSelection = this.memberApi.getSelectedRows();
  }

  onMemberFilterChanged() {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onResize(ev: Event) {
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    //this.sizeAll();
  }
  sizeAll() {
    var allColumnIds = [];
    this.memberColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.memberColumnApi.autoSizeColumns(allColumnIds);
  }
  readMembers() {
    let subM = this.softwareService.getSoftwareStatus().subscribe(
      (val) => { this.memberData = val; console.log(val) },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
  roomDeviceGrouping() {
    this.columnDefs = [
      {
        field: 'roomName',
        rowGroup: true,
        hide: true,
        headerName: this.languageS.trans('room')
      },
      {
        field: 'deviceName',
        rowGroup: true,
        hide: true,
        headerName: this.languageS.trans('device'),
      },
      {
        field: 'softwareName',
        headerName: this.languageS.trans('software'),
      },
      {
        field: 'version',
        headerName: this.languageS.trans('version'),
      },
      {
        field: 'status',
        headerName: this.languageS.trans('status')
      }
    ];
    this.autoGroupColumnDef = {
      headerName: this.languageS.trans('rooms') + " " + this.languageS.trans('devices'),
      minWidth: 250
    };
    /* this.autoGroupColumnDef = {
      headerName: this.languageS.trans('room'),
      field: 'roomName',
      headerCheckboxSelection: false,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      valueGetter: function (params) { return " "; },
      minWidth: 250
    }; */
  }

}
