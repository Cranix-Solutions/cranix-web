import { Component, OnInit } from '@angular/core';
//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { HwconfsService } from 'src/app/services/hwconfs.service';
import { Hwconf, Device, Room } from 'src/app/shared/models/data-model';
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
  columnDefs = [];
  defaultColDef = {
    cellStyle: { 'justify-content': "center" },
    resizable: true,
    sortable: true,
    hide: false,
    suppressHeaderMenuButton: true
  }
  memberApi;
  memberColumnApi;
  memberData:  Device[] = [];
  memberDataB: Device[] = [];
  hwconf;
  modules = [];
  sentImage=0;
  sendingImage: boolean = false;
  networkCard: string    = "eth0";
  selectedRooms = [];
  rooms: Room[] = [];
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
  }

  ngOnInit() {
    this.createColumnDef();
    this.readMembers();
  }

  createColumnDef() {
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
          cellRenderer: RoomIdCellRenderer,
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

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    //this.memberApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.memberApi.doLayout();
  }

  onResize($event) {
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
      (val) => {
        this.memberData  = val;
        this.memberDataB = val;
        let roomIds: number[] = [];
        for( let dev of val ) {
          if( roomIds.indexOf(dev.roomId) == -1 ) {
            roomIds.push(dev.roomId)
            this.rooms.push(this.objectService.getObjectById('room',dev.roomId))
          }
        }
        this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
  }
  readFilteredMember() {
    let sRooms: number[]= [];
    for(let room of this.selectedRooms ){
      sRooms.push(room.id);
    }
    if( sRooms.length == 0 ) {
      this.memberData = this.memberDataB
    } else {
      this.memberData = [];
      for( let dev of this.memberDataB ) {
        if( sRooms.indexOf(dev.roomId) != -1 ) {
          this.memberData.push(dev);
        }
      }
    }
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
        if(what == 'startmulticastclone' ) {
          this.sendingImage = true;
        } else {
          this.sendingImage = false;
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe(); }
    )
  }

  startSending(){
    console.log("startSending")
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
    this.sendingImage = false;
    this.hwconfService.stopMulticast().subscribe(
      (val) => {
        this.objectService.responseMessage(val);
      }
    )
  }
}
