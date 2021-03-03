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
  memberApi;
  memberColumnApi;
  memberSelection: SoftwareStatus[] = [];
  memberData: SoftwareStatus[] = [];
  autoGroupColumnDef = {
    headerName: "",
    //headerName: this.languageS.trans('software') + " " + this.languageS.trans('version'),
    minWidth: 250
  };
  institute;
  rowGroupPanelShow = "always";
  modules = [];
  grouping = "roomGrouping"

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
    this.roomDeviceGrouping();
    this.readMembers();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  exportSelected() {
    this.memberApi.exportDataAsCsv({onlySelected:true,fileName:'installation-status'});
  }
  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
  }
  onQuickFilterChanged(quickFilter) {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.memberApi.doLayout();
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
      (val) => { this.memberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }
  toggleColumnDef() {
    if (this.grouping == "roomGrouping") {
      this.grouping = "softwareGrouping";
      this.softwareVersionGrouping();
    } else if (this.grouping == "softwareGrouping") {
      this.grouping = "statusGrouping";
      this.installationStatusGrouping();
    } else if (this.grouping == "statusGrouping") {
      this.grouping ="noGrouping";
      this.noGrouping();
    } else {
      this.grouping = "roomGrouping";
      this.roomDeviceGrouping();
    }
  }
  roomDeviceGrouping() {
    this.authService.log("roomDeviceGrouping  was called");
    this.columnDefs = [
      {
        field: 'roomName',
        rowGroup: true,
        hide: true
      },
      {
        field: 'deviceName',
        rowGroup: true,
        hide: true
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
  }
  /**
   * Order the table by groups software name and version
   */
  softwareVersionGrouping() {
    this.authService.log("softwareVersionGrouping  was called");
    this.columnDefs = [
      {
        field: 'softwareName',
        rowGroup: true,
        hide: true
      },
      {
        field: 'version',
        rowGroup: true,
        hide: true
      },
      {
        field: 'roomName',
        rowGroup: true,
        hide: true
      },
      {
        field: 'deviceName',
        headerName: this.languageS.trans('device'),
        cellStyle: { 'justify-content': "left" }
      },
      {
        field: 'status',
        headerName: this.languageS.trans('status')
      }
    ];
  }

  /**
   * Make table grouping  by installation status and software name.
   * This grouping is good for searching failed installations
   */
  installationStatusGrouping() {
    this.authService.log("installationStatusGrouping  was called");
    this.columnDefs = [
      {
        field: 'status',
        rowGroup: true,
        hide: true
      },
      {
        field: 'softwareName',
        rowGroup: true,
        hide: true
      },
      {
        field: 'roomName',
        rowGroup: true,
        hide: true
      },
      {
        field: 'deviceName',
        headerName: this.languageS.trans('device'),
        cellStyle: { 'justify-content': "left" }
      },
      {
        field: 'version',
        headerName: this.languageS.trans('version'),
      },
    ];
  }

   /**
   * Make table grouping  by installation status and software name.
   * This grouping is good for searching failed installations
   */
  noGrouping() {
    this.authService.log("installationStatusGrouping  was called");
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
