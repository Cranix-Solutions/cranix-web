import { Component, OnInit } from '@angular/core';

//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { HwconfsService } from 'src/app/services/hwconfs.service';
import { Hwconf, Device } from 'src/app/shared/models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-hwconf-members',
  templateUrl: './hwconf-members.page.html',
  styleUrls: ['./hwconf-members.page.scss'],
})
export class HwconfMembersPage implements OnInit {
  context;
  memberOptions;
  columnDefs = [];
  memberApi;
  memberColumnApi;
  memberSelection: Device[] = [];
  memberData: Device[] = [];
  autoGroupColumnDef;
  hwconf;

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    private languageS: LanguageService,
    private hwconfService: HwconfsService
  ) {
    this.hwconf = <Hwconf>this.objectService.selectedObject;

    this.context = { componentParent: this };
    this.memberOptions = {
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu : true
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowSelection: 'multiple'
    }
    this.columnDefs = [
      {
        field: 'roomId',
        rowGroup: true,
        hide: true,
        valueGetter: function (params) {
          return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
        }
      },
      {
        headerName: this.languageS.trans('name'),
        field: 'name',
      },
      {
        headerName: this.languageS.trans('ip'),
        field: 'ip',
      },
      {
        headerName: this.languageS.trans('mac'),
        field: 'mac',
      }
    ]
    this.autoGroupColumnDef = { 
      headerName: this.languageS.trans('roomId'),
      field: 'roomId',
      headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: this.authService.settings.checkboxSelection,
      valueGetter: function (params) {
        return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
      },
      minWidth: 200 
    };
  }

  ngOnInit() {
    this.readMembers();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    //this.memberApi.sizeColumnsToFit();
  }
  onMemberSelectionChanged() {
    this.memberSelection = this.memberApi.getSelectedRows();
  }

  onMemberFilterChanged() {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onResize($event) {
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    this.sizeAll();
    //this.gridApi.sizeColumnsToFit();
  }
  sizeAll() {
    var allColumnIds = [];
    this.memberColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.memberColumnApi.autoSizeColumns(allColumnIds);
  }
  readMembers() {
    let subM = this.hwconfService.getMembers(this.hwconf.id).subscribe(
      (val) => { this.memberData = val; console.log(val) },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
}
