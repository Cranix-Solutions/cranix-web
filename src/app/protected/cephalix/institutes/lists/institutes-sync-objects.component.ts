import { Component, OnInit } from '@angular/core';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Institute, SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';

@Component({
  selector: 'cranix-institutes-sync-objects',
  templateUrl: './institutes-sync-objects.component.html'
})
export class InstitutesSyncObjectsComponent implements OnInit {

  context;
  memberOptions;
  columnDefs = [];
  memberApi;
  memberColumnApi;
  memberSelection: SynchronizedObject[] = [];
  memberData: SynchronizedObject[] = [];
  autoGroupColumnDef;
  institute;
  selectedList: string[] = [];

  constructor(
    public authService:     AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    private languageS: LanguageService
  ) {
    this.institute = <Institute>this.objectService.selectedObject;

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
        field: 'objectType',
        rowGroup: true,
        hide: true,
        cellStyle: { 'justify-content': "left" },
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.objectType + "s");
        }
      },
      {
        headerName: this.languageS.trans('name'),
        field: 'objectName',
      }
    ];
    this.autoGroupColumnDef = {
      headerName: this.languageS.trans('objectType'),
      field: 'objectType',
      headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: this.authService.settings.checkboxSelection,
      cellStyle: { 'justify-content': "left" },
      valueGetter: function (params) { return " "; },
      minWidth: 250
    };
  }

  ngOnInit() {
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
    let subM = this.cephalixService.getObjectsToSynchronize().subscribe(
      (val) => { this.memberData = val; console.log(val) },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
  startSync(en: Event) {
    for (let institute of this.cephalixService.selectedInstitutes) {
      for (let sel of this.memberSelection) {
        let sub = this.cephalixService.putObjectToInstitute(institute.id, sel.objectType, sel.cephalixId)
          .subscribe(
            (val) => { console.log("Start sync:") },
            (err) => { console.log },
            () => { sub.unsubscribe() })
      }
    }
  }
  stopSync(en: Event) {
    for (let institute of this.cephalixService.selectedInstitutes) {
      for (let sel of this.memberSelection) {
        let sub = this.cephalixService.deleteObjectFromInstitute(institute.id, sel.objectType, sel.cephalixId)
          .subscribe(
            (val) => { console.log("Stop sync:") },
            (err) => { console.log },
            () => { sub.unsubscribe() })
      }
    }
  }
}
