import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'
import { PTMEvent, PTMTeacherInRoom, ParentTeacherMeeting, Room, User } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'cranix-ptm-view',
  templateUrl: './cranix-ptm-view.component.html',
  styleUrl: './cranix-ptm-view.component.css'
})
export class CranixPtmViewComponent implements OnInit {
  context
  ptmTeacherInRoom: PTMTeacherInRoom
  ptm: ParentTeacherMeeting
  students: User[] = []
  freeRooms: Room[]
  rowData = []
  events = {}
  me: User
  isPtmManager: boolean = false
  isParent: boolean = false
  defaultColDef = {
    resizable: true,
    sortable: false,
    hide: false,
    minWidth: 80,
    suppressHeaderMenuButton: true
  }
  columnDefs = []
  gridApi
  isRegisterRoomOpen: boolean = false
  isRegisterEventOpen: boolean = false
  selectedEvent: PTMEvent
  selectedEventRegistered: boolean = false
  selectedPTMinRoom: PTMTeacherInRoom
  freeTeachers: User[] = []
  @Input() id: number;
  constructor(
    public alertController: AlertController,
    public authService: AuthenticationService,
    private languageS: LanguageService,
    private objectService: GenericObjectService,
    private parentsService: ParentsService,
    private utilService: UtilsService
  ) {
    this.context = { componentParent: this }
    this.isParent = this.authService.session.role == 'parent'
    this.students = []
    if (this.isParent) {
      this.me = this.objectService.getObjectById("user", this.authService.session.userId)
      this.parentsService.getMyChildren().subscribe((val) => { this.students = val })
    } else {
      for (let s of this.objectService.allObjects['user']) {
        if (s.role == 'students') this.students.push(s)
      }
    }
    this.isPtmManager = this.authService.isAllowed('ptm.manage')
  }
  compare(a: any, b: any) {
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  }
  ngOnInit(): void {
    console.log(this.id)
    this.readData(true)
  }
  readData(doColdef: boolean) {
    this.parentsService.getPTMById(this.id).subscribe(
      (val) => {
        this.ptm = val
        this.parentsService.getFreeTeachers(this.id).subscribe(
          (val) => {
            this.freeTeachers = val
            this.createData(doColdef)
          }
        )
      }
    )
  }
  onQuickFilterChanged() {
    let filter = (<HTMLInputElement>document.getElementById("teacherFilter")).value.toLowerCase();
    this.gridApi.setGridOption('quickFilterText', filter);
  }

  createData(doColdef: boolean) {
    let colDefIsReady = !doColdef
    let data = []
    let colDef = []
    for (let ptmTeacherInRoom of this.ptm.ptmTeacherInRoomList) {
      let roomEvents = {
        teacher: ptmTeacherInRoom.teacher.surName + ', ' + ptmTeacherInRoom.teacher.givenName,
        room: ptmTeacherInRoom.room.description ? ptmTeacherInRoom.room.description : ptmTeacherInRoom.room.name,
        ptmId: ptmTeacherInRoom.id,
        teacherId: ptmTeacherInRoom.teacher.id
      }
      if (!colDefIsReady) {
        colDef.push(
          {
            field: 'teacher',
            pinned: 'left',
            minWidth: 100,
            lockPinned: true,
            headerName: this.languageS.trans('Teacher'),
            sortable: true
          },
          {
            field: 'room',
            pinned: 'left',
            minWidth: 80,
            lockPinned: true,
            headerName: this.languageS.trans('Room'),
            cellRenderer: RoomRenderer
          }
        )
      }
      for (let ptmEvent of ptmTeacherInRoom.events.sort(this.compare)) {
        let time = this.utilService.getDouble(new Date(ptmEvent.start).getHours()) + ':' + this.utilService.getDouble(new Date(ptmEvent.start).getMinutes())
        this.events[ptmEvent.id] = ptmEvent
        roomEvents[time] = ptmEvent.id
        if (!colDefIsReady) {
          colDef.push(
            {
              field: time,
              headerName: time,
              width: 80,
              cellRenderer: EventRenderer
            }
          )
        }
      }
      colDefIsReady = true
      data.push(roomEvents)
    }
    if (doColdef) {
      this.columnDefs = colDef
    }
    for (let user of this.freeTeachers) {
      data.push(
        {
          teacher: user.surName + ', ' + user.givenName,
          room: "0",
          ptmId: 0,
          teacherId: user.id
        }
      )
    }
    this.rowData = data
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectPTMinRoom(event: PTMEvent) {
    for (let tmp of this.ptm.ptmTeacherInRoomList) {
      for (let e of tmp.events) {
        if (event.id == e.id) {
          return tmp
        }
      }
    }
  }

  registerEvent(event: PTMEvent) {
    this.selectedEvent = event
    this.selectedPTMinRoom = this.selectPTMinRoom(event)
    this.isRegisterEventOpen = true
    this.selectedEventRegistered = this.selectedEvent.student != null
    if (!this.selectedEvent.student && this.isParent) {
      this.selectedEvent.parent = this.me
    }
    console.log(event)
  }

  cancelEvent() {
    this.parentsService.cancelEvent(this.selectedEvent.id).subscribe((val) => {
      this.objectService.responseMessage(val)
      this.isRegisterEventOpen = false
      this.readData(false)
    })
  }
  doRegister() {
    this.parentsService.registerEvent(this.selectedEvent).subscribe((val) => {
      this.objectService.responseMessage(val)
      this.isRegisterEventOpen = false
      this.readData(false)
    })
  }
  registerRoom(teacherId: number, ptmId: number) {
    console.log(teacherId, ptmId)
    this.parentsService.getFreeRooms(this.id).subscribe(
      (val) => {
        this.freeRooms = val
        if (ptmId != 0) {
          for (let teacherInRoom of this.ptm.ptmTeacherInRoomList) {
            if (ptmId == teacherInRoom.id) {
              this.ptmTeacherInRoom = teacherInRoom
              break
            }
          }
        } else {
          this.ptmTeacherInRoom = new PTMTeacherInRoom()
          this.ptmTeacherInRoom['teacher'] = this.objectService.getObjectById("user", teacherId)
        }
        console.log(this.ptmTeacherInRoom)
        this.isRegisterRoomOpen = true;
      })
  }
  doRegisterRoom() {
    console.log(this.ptmTeacherInRoom)
    this.parentsService.registerRoom(this.id, this.ptmTeacherInRoom).subscribe((val) => {
      this.objectService.responseMessage(val)
      this.isRegisterEventOpen = false
      this.readData(false)
      this.isRegisterRoomOpen = false;
    }
    )
  }
  async cancelRoomRegistration() {
    const alert = await this.alertController.create({
      header: this.languageS.trans('Confirm!'),
      subHeader: this.languageS.trans('Do you realy want to delete?'),
      message: this.languageS.trans('Remove registrations for:') + this.ptmTeacherInRoom.teacher.surName +"," + this.ptmTeacherInRoom.teacher.givenName,
      buttons: [
        {
          text: this.languageS.trans('Cancel'),
          role: 'cancel',
        }, {
          text: 'OK',
          handler: () => {
            this.objectService.requestSent();
            var a = this.parentsService.cancelRoomRegistration(this.ptmTeacherInRoom.id).subscribe({
              next: (val) => {
                this.objectService.responseMessage(val);
                this.readData(false)
                this.isRegisterRoomOpen = false;
              },
              error: (err) => {
                this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
              },
              complete: () => { a.unsubscribe() }
            })
          } 
        }
      ]
    }); 
    await alert.present();
  }
}

@Component({
  selector: 'room-renderer',
  template: `@if(params.value != "0") {
  @if(context.isPtmManager) {
  <ion-button fill="clear" size="small" (click)="context.registerRoom(params.data.teacherId, params.data.ptmId)">
  {{params.value}}  
  </ion-button>
  } @else {
  {{params.value}}
  }
} @else {
  <ion-button fill="clear" size="small" (click)="context.registerRoom(params.data.teacherId, params.data.ptmId)">
    <ion-icon name="room-outline" color="success"></ion-icon>
  </ion-button>
}`
})
export class RoomRenderer implements ICellRendererAngularComp {
  public context
  public params
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.params = params
  }
  refresh(params: any): boolean {
    return true;
  }
}


@Component({
  selector: 'event-renderer',
  template: `@if(event){
  @if(event.blocked){
  <ion-button fill="clear" size="small">
    <ion-icon name="lock-closed" color="primary"></ion-icon>
  </ion-button>
  }@else if(isSelectable()){
    <ion-button fill="clear" size="small" (click)="register()">
      <ion-icon name="person-add-outline" color="success"></ion-icon>
    </ion-button>
  }@else{
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="danger"></ion-icon>
    </ion-button>
  }
}`
})
export class EventRenderer implements ICellRendererAngularComp {
  public event: PTMEvent;
  public context
  private role: string
  public myId: number
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.myId = this.context.authService.session.userId
    this.role = this.context.authService.session.role
    this.event = this.context.events[params.value];
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    //TODO
    this.context.registerEvent(this.event)
  }
  isCancelable() {
    if (this.event.parent) {
      if (this.event.parent.id == this.myId || this.context.isPtmManager) {
        return true
      }
    }
  }
  isSelectable() {
    if (this.event.student) return false
    if (this.role == 'parents') {
      let count = 0
      for (let ev of this.context.events) {
        //TODO
      }
    }
    return true
  }
  refresh(params: any): boolean {
    return true;
  }
}
