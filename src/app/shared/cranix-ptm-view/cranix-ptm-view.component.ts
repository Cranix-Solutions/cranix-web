import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'
import { PTMEvent, PTMTeacherInRoom, ParentTeacherMeeting, Room, User } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { EventRenderer } from 'src/app/pipes/ag-ptm-event-renderer'
import { RoomRenderer } from 'src/app/pipes/ag-ptm-room-renderer'

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
  eventsTeacherStudent = {}
  eventsTimeStudent = {}
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
      if(!this.eventsTeacherStudent[ptmTeacherInRoom.teacher.id]) {
        this.eventsTeacherStudent[ptmTeacherInRoom.teacher.id] = {}
      }
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
        if(!this.eventsTimeStudent[time]){
          this.eventsTimeStudent[time] = {}
        }
        if( ptmEvent.student ) {
          this.eventsTeacherStudent[ptmTeacherInRoom.teacher.id][ptmEvent.student.id] = 1
          this.eventsTimeStudent[time][ptmEvent.student.id] = 1
        }
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
      this.selectedEvent.parent = this.authService.session.user;
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
