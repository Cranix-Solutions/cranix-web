import { Component, OnInit } from '@angular/core';
//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { HwconfsService } from 'src/app/services/hwconfs.service';
import { Hwconf, Device } from 'src/app/shared/models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { CrxActionMap } from 'src/app/shared/models/server-models';
import { DevicesService } from 'src/app/services/devices.service';
import { RoomIdCellRenderer } from 'src/app/pipes/ag-roomid-render';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'cranix-hwconf-members',
  templateUrl: './hwconf-members.page.html',
  styleUrls: ['./hwconf-members.page.scss'],
})
export class HwconfMembersPage implements OnInit {
  context;
  memberOptions;
  columnDefs = [];
  defaultColDef = {
    cellStyle: { 'justify-content': "center" },
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu: true
  }
  memberApi;
  memberColumnApi;
  memberData: Device[] = [];
  autoGroupColumnDef;
  hwconf;
  modules = [];
  roomGrouping: boolean = true;

  sentImage=0;
  sendingImage: boolean = false;
  networkCard: string    = "eth0";
  //TODO
  networkCards: string[] = ["eth0","eth1"];
  constructor(
    public  authService: AuthenticationService,
    public  objectService: GenericObjectService,
    private languageService: LanguageService,
    private hwconfService: HwconfsService,
    private deviceService: DevicesService
  ) {
    this.hwconf = <Hwconf>this.objectService.selectedObject;
    this.hwconfService.getMultiDevs().subscribe(
      (val) => {
        this.networkCards = val;
        this.networkCard = val[0];
      }
    )

    this.context = { componentParent: this };
    this.autoGroupColumnDef = {
      headerName: this.languageService.trans('roomId'),
      field: 'roomId',
      headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: this.authService.settings.checkboxSelection,
      valueGetter: function (params) {
        return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
      },
      minWidth: 100
    };
  }

  ngOnInit() {
    this.createColumnDef();
    this.readMembers();
  }

  createColumnDef() {
    if (this.roomGrouping) {
      this.columnDefs = [
        {
          field: 'roomId',
          rowGroup: true,
          hide: true,
          valueGetter: function (params) {
            if (params.data) {
              return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
            }
          }
        },
        {
          headerName: this.languageService.trans('name'),
          field: 'name',
        },
        {
          headerName: this.languageService.trans('ip'),
          field: 'ip',
        },
        {
          headerName: this.languageService.trans('mac'),
          field: 'mac',
        }
      ]
    } else {
      this.columnDefs = [

        {
          headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: this.authService.settings.checkboxSelection,
          headerName: this.languageService.trans('name'),
          field: 'name',
        },
        {
          headerName: this.languageService.trans('room'),
          field: 'roomId',
          cellRendererFramework: RoomIdCellRenderer,
        },
        {
          headerName: this.languageService.trans('ip'),
          field: 'ip',
        },
        {
          headerName: this.languageService.trans('mac'),
          field: 'mac',
        }
      ]
    }
    this.roomGrouping = !this.roomGrouping;
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

  onQuickFilterChanged(quickFilter) {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
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
      (val) => { this.memberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }

  triggerClone(event, what) {
    if (this.memberApi.getSelectedRows().length == 0) {
      this.objectService.selectObject();
      return;
    }
    let actionMap = new CrxActionMap;
    actionMap.name = what;
    for (let dev of this.memberApi.getSelectedRows()) {
      actionMap.objectIds.push(dev.id);
    }
    this.objectService.requestSent();
    let sub = this.deviceService.executeAction(actionMap).subscribe(
      (val) => {
        let response = this.languageService.trans("List of the results:");
        for (let resp of val) {
          response = response + "<br>" + this.languageService.transResponse(resp);
        }
        this.objectService.okMessage(response)
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe(); }
    )
  }

  startSending(){
    this.sendingImage = true;
  }

  sendImage(id: number){
    this.sentImage=id;
    this.hwconfService.startMultiCast(id,this.networkCard).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        interval(5000).pipe(takeWhile(() => this.sentImage > 0)).subscribe(
          (func => { this.checkSending() })
        )
      }
    )
  }

  checkSending(){
    this.hwconfService.getRunningMulticast().subscribe(
      (val) => { if(!val) { this.sentImage = 0 }}
    )
  }

  stopMulticast(){
    this.sentImage = 0;
    this.hwconfService.stopMulticast().subscribe(
      (val) => {
        this.objectService.responseMessage(val);
      }
    )
  }
}
