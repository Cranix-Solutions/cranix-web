import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { AllModules, Logger } from '@ag-grid-enterprise/all-modules';
//import "ag-grid-enterprise";

//own stuff
import { LanguageService } from '../../../../../services/language.service';
import { HwconfsService } from '../../../../../services/hwconfs.service';
import { Hwconf, Device } from '../../../../../shared/models/data-model'

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
  memberSelected: Device[] = [];
  memberData: Device[] = [];
  autoGroupColumnDef;
  hwconf;

  constructor(
    private objectService: GenericObjectService,
    private languageS: LanguageService,
    private hwconfService: HwconfsService
  ) {
    this.hwconf = <Hwconf>this.objectService.selectedObject;

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
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      valueGetter: function (params) {
        return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
      },
      minWidth: 200 
    };
  }

  ngOnInit() {
    this.readMembers();
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    //this.memberApi.sizeColumnsToFit();
  }
  onMemberSelectionChanged() {
    this.memberSelected = this.memberApi.getSelectedRows();
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
