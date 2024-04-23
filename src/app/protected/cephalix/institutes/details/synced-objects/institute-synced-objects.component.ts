import { Component, OnInit } from '@angular/core';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Institute, SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';
import { SyncObjectRenderer } from 'src/app/pipes/ag-sync-object-renderer';

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
  segment = "to";
  hwconfs = {};
  syncedObjects: SynchronizedObject[] = [];

  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    private languageS: LanguageService
  ) {
    this.institute = <Institute>this.objectService.selectedObject;
    this.context = { componentParent: this };
    this.columnDefs = [
      {
        field: 'objectType',
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.objectType);
        },
      },
      {
        headerName: this.languageS.trans('name'),
        minsize: '300px',
        field: 'objectName',
      },
      {
        headerName: this.languageS.trans('lastSync'),
        field: 'lastSync'
      },
      {
        headerName: "",
        field: 'cranixId',
        cellRenderer: SyncObjectRenderer
      }
    ];
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
  }

  onMemberFilterChanged() {
    this.memberApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onResize($event) {
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
    switch (this.segment) {
      case 'to': {
        let subM = this.cephalixService.getSynchronizedObjects(this.institute.id).subscribe({
          next: (val) => {
            console.log("readMembers to " + val.length + "object read")
            this.memberData = val;
            this.syncedObjects = val;
          },
          error: (err) => { this.authService.log(err) },
          complete: () => { subM.unsubscribe() }
        });
        break;
      }
      case 'from': {
        let subS = this.cephalixService.getSynchronizedObjects(this.institute.id).subscribe({
          next: (val) => {
            console.log("readMembers to " + val.length + "object read")
            this.memberData = val;
            this.syncedObjects = val;
            let subM = this.cephalixService.getObjectsFromInstitute(this.institute.id, 'hwconf').subscribe({
              next: (val) => {
                this.memberData = []
                console.log("readMembers from " + val.length + "object read")
                for (let obj of val) {
                  this.hwconfs[obj.id] = obj;
                  this.memberData.push(this.isSynced(obj, 'hwconf'))
                }
              },
              error: (err) => { this.authService.log(err) },
              complete: () => { subM.unsubscribe() }
            })
          },
          error: (err) => { this.authService.log(err) },
          complete: () => { subS.unsubscribe() }
        });
        break;
      }
    }
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
    this.readMembers();
  }

  isSynced(obj, objectType) {
    for (let tmp of this.syncedObjects) {
      if (tmp.objectType == objectType && tmp.cranixId == obj.id) {
        console.log(tmp)
        return tmp
      }
    }
    return {
      objectType: 'hwconf',
      objectName: obj.name,
      lastSync: 0,
      instituteId: this.institute.id,
      cephalixId: 0,
      cranixId: obj.id,
      syncRunning: false
    }
  }
  getHWconfFromInstitute(hwconfId: number) {
    this.objectService.requestSent();
    this.cephalixService.getHWconfFromInstitute(this.institute.id, hwconfId, this.hwconfs[hwconfId]).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.readMembers()
      }
    )
  }
  syncHWconfFromInstitute(mapping: SynchronizedObject) {
    this.objectService.requestSent();
    this.cephalixService.syncHWconfFromInstitute(this.institute.id, mapping).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val)
        this.readMembers()
      },
      error: (err) => { this.objectService.errorMessage(err) }
    })
  }
  syncObjectToInstitute(mapping: SynchronizedObject) {
    this.objectService.requestSent();
    this.cephalixService.putObjectToInstitute(this.institute.id, mapping.objectType, mapping.cephalixId).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val)
        this.readMembers()
      },
      error: (err) => { this.objectService.errorMessage(err) }
    })
  }
  stopSyncing(mappingId,direction){
    this.cephalixService.stopSynching(mappingId,direction).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.readMembers()
      }
    )
  }
}
