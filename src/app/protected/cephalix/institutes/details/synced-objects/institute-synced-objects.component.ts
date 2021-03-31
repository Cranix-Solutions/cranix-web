import { Component, OnInit } from '@angular/core';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Institute, SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';

@Component({
  selector: 'cranix-institute-synced-objects',
  templateUrl: './institute-synced-objects.component.html'
})
export class InstituteSyncedObjectsComponent implements OnInit {

  context;
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false
  };
  columnDefs = [];
  memberApi;
  memberColumnApi;
  memberSelection: SynchronizedObject[] = [];
  memberData: SynchronizedObject[] = [];
  modules = [];
  institute;

  constructor(
    public authService:     AuthenticationService,
    public cephalixService: CephalixService,
    public objectService:   GenericObjectService,
    private languageS:      LanguageService
  ) {
    this.institute = <Institute>this.objectService.selectedObject;
    this.context = { componentParent: this };
    this.columnDefs = [
      {
        field: 'objectType',
        valueGetter: function(params) {
          return  params.context['componentParent'].languageS.trans(params.data.objectType);
        },
      },
      {
        headerName: this.languageS.trans('name'),
        field: 'objectName',
      },
      {
        headerName: this.languageS.trans('lastSync'),
        field: 'lastSync',
        cellRendererFramework: DateTimeCellRenderer
      }
    ];
  }

  ngOnInit() {
    this.cephalixService.selectedInstitutes.length;
    this.readMembers();
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
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

  onResize($event) {
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
    let subM = this.cephalixService.getSynchronizedObjects(this.institute.id).subscribe(
      (val) => { this.memberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }

}
