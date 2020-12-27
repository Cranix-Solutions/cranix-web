import { Component, OnInit } from '@angular/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';

@Component({
  selector: 'cranix-institutes-sync-objects',
  templateUrl: './institutes-sync-objects.component.html'
})
export class InstitutesSyncObjectsComponent implements OnInit {

  context;
  columnDefs = [];
  memberApi;
  memberColumnApi;
  memberSelection: SynchronizedObject[] = [];
  memberData: SynchronizedObject[] = [];
  autoGroupColumnDef;
  modules = [ AllModules, RowGroupingModule ];
  institute;
  constructor(
    public authService:     AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    private languageS: LanguageService
  ) {
    this.context = { componentParent: this };
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
      minWidth: 250
    };
  }

  ngOnInit() {
    this.readMembers();
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
  }

  onMemberFilterChanged() {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById("memberFilter")).value);
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
    let subM = this.cephalixService.getObjectsToSynchronize().subscribe(
      (val) => { this.memberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }
  startSync(en: Event) {
    this.objectService.requestSent();
    for (let institute of this.cephalixService.selectedInstitutes) {
      for (let sel of this.memberApi.getSelectedRows()) {
        let sub = this.cephalixService.putObjectToInstitute(institute.id, sel.objectType, sel.cephalixId)
          .subscribe(
            (val) => { this.authService.log("Start sync:") },
            (err) => { this.authService.log },
            () => { sub.unsubscribe() })
      }
    }
  }
  stopSync(en: Event) {
    this.objectService.requestSent();
    for (let institute of this.cephalixService.selectedInstitutes) {
      for (let sel of this.memberApi.getSelectedRows()) {
        let sub = this.cephalixService.deleteObjectFromInstitute(institute.id, sel.objectType, sel.cephalixId)
          .subscribe(
            (val) => { this.authService.log("Stop sync:") },
            (err) => { this.authService.log },
            () => { sub.unsubscribe() })
      }
    }
  }
}
