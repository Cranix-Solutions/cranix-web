import { Component, Input, OnInit } from '@angular/core';
import { PTMEvent, PTMTeacherInRoom, ParentTeacherMeeting, User } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'cranix-ptm-view',
  templateUrl: './cranix-ptm-view.component.html',
  styleUrl: './cranix-ptm-view.component.css'
})
export class CranixPtmViewComponent implements OnInit {

  context
  parents: User[] =[]
  rowData = []
  events = {}
  defaultColDef = {
    resizable: true,
    sortable: false,
    hide: false,
    minWidth: 80,
    suppressHeaderMenuButton: true
  }
  columnDefs = []
  colDefIsReady = false
  gridApi
  ptm: ParentTeacherMeeting
  isRegisterEventOpen: boolean = false
  selectedEvent: PTMEvent
  selectedPTMinRoom: PTMTeacherInRoom
  @Input() id: number;
  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    private parentsService: ParentsService,
    private utilService: UtilsService
  ) {
    this.context = { componentParent: this };
    this.parentsService.getParents().subscribe((val) => {this.parents = val})
  }

  compare(a: any, b: any) {
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  }
  ngOnInit(): void {
    console.log(this.id)
    this.parentsService.getPTMById(this.id).subscribe(
      (val) => {
        this.ptm = val
        this.createData()
      }
    )
  }
  createData() {
    let data = []
    let colDef = []
    for (let ptmTeacherInRoom of this.ptm.ptmTeacherInRoomList) {
      let roomEvents = {
        teacher: ptmTeacherInRoom.teacher.surName + ', ' + ptmTeacherInRoom.teacher.givenName,
        room: ptmTeacherInRoom.room.description ? ptmTeacherInRoom.room.description : ptmTeacherInRoom.room.name
      }
      if (!this.colDefIsReady) {
        colDef.push(
          {
            field: 'teacher',
            pinned: 'left',
            minWidth: 120,
            lockPinned: true,
            headerName: this.languageS.trans('Teacher'),
          },
          {
            field: 'room',
            pinned: 'left',
            minWidth: 120,
            lockPinned: true,
            headerName: this.languageS.trans('Room'),
          }
        )
      }
      for (let ptmEvent of ptmTeacherInRoom.events.sort(this.compare)) {
        let time = this.utilService.getDouble(new Date(ptmEvent.start).getHours()) + ':' + this.utilService.getDouble(new Date(ptmEvent.start).getMinutes())
        this.events[ptmEvent.id] = ptmEvent
        roomEvents[time] = ptmEvent.id
        if (!this.colDefIsReady) {
          colDef.push(
            {
              field: time,
              headerName: time,
              cellRenderer: EventRenderer
            }
          )
        }
      }
      this.columnDefs = colDef
      this.colDefIsReady = true
      data.push(roomEvents)
    }
    this.rowData = data
    //console.log(this.columnDefs)
    //console.log(this.rowData)
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectPTMinRoom(event: PTMEvent){
    for(let tmp of this.ptm.ptmTeacherInRoomList){
      for(let e of tmp.events){
        if(event.id == e.id){
          return tmp
        }
      }
    }
  }

  registerEvent(event: PTMEvent) {
    this.selectedEvent = event
    this.selectedPTMinRoom = this.selectPTMinRoom(event)
    this.isRegisterEventOpen = true
    console.log(event)
  }

  cancelEvent(event: PTMEvent) {
    console.log(event)
  }
}

@Component({
  selector: 'event-renderer',
  styleUrl: './cranix-ptm-view.component.css',
  template: `@if(event.parent){
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="danger"></ion-icon>
    </ion-button>
  }
  @else
  {
    <ion-button fill="clear" size="small" (click)="register()">
      <ion-icon name="pencil-outline" color="success"></ion-icon>
    </ion-button>
  }`
})
export class EventRenderer implements ICellRendererAngularComp {
  public event: PTMEvent;
  public context
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.event = this.context.events[params.value];
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    this.context.cancelEvent(this.event)
  }
  refresh(params: any): boolean {
    return true;
  }
}
