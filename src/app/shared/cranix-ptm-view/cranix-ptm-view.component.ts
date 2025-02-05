import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular'
import { PTMEvent, PTMTeacherInRoom, ParentTeacherMeeting, Room, User } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { EventRenderer } from 'src/app/pipes/ag-ptm-event-renderer'
import { RoomRenderer } from 'src/app/pipes/ag-ptm-room-renderer'
import { WindowRef } from 'src/app/shared/models/ohters'
import { SystemService } from 'src/app/services/system.service';
import { interval, takeWhile } from 'rxjs';

@Component({
  selector: 'cranix-ptm-view',
  templateUrl: './cranix-ptm-view.component.html',
  styleUrl: './cranix-ptm-view.component.css'
})
export class CranixPtmViewComponent implements OnInit {
  alive: boolean = true
  context
  ptmTeacherInRoom: PTMTeacherInRoom
  ptm: ParentTeacherMeeting
  students: User[] = []
  selectedStudent: User
  freeRooms: Room[]
  rowData = []
  events = {}
  eventsTeacherStudent = {}
  eventsTimeStudent = {}
  isPtmManager: boolean = false
  isStudent: boolean = false
  instituteName: string
  defaultColDef = {
    resizable: true,
    sortable: false,
    hide: false,
    minWidth: 80,
    suppressHeaderMenuButton: true,
    suppressMovable: true
  }
  columnDefs = []
  gridApi
  isRegisterRoomOpen: boolean = false
  isRegisterEventOpen: boolean = false
  selectedEvent: PTMEvent
  selectedEventRegistered: boolean = false
  selectedPTMinRoom: PTMTeacherInRoom
  freeTeachers: User[] = []
  nativeWindow: any
  @Input() id: number;
  constructor(
    public win: WindowRef,
    public alertController: AlertController,
    public authService: AuthenticationService,
    private languageS: LanguageService,
    private objectService: GenericObjectService,
    private parentsService: ParentsService,
    private utilService: UtilsService,
    private systemService: SystemService
  ) {
    this.nativeWindow = win.getNativeWindow();
    this.systemService.getInstituteName().subscribe((val) => { this.instituteName = val })
    this.context = { componentParent: this }
    this.isStudent = this.authService.session.user.role == 'students'
    this.students = []
    if (!this.isStudent) {
      for (let s of this.objectService.allObjects['user']) {
        if (s.role == 'students') this.students.push(s)
      }
    } else {
      this.selectedStudent = this.authService.session.user
    }
    this.isPtmManager = this.authService.isAllowed('ptm.manage')
  }
  compare(a: any, b: any) {
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  }
  ngOnInit(): void {
    console.log(this.id)
    this.alive = true
    this.readData(true)
    interval(5000).pipe(takeWhile(() => this.alive)).subscribe((func => {
      this.refreshDatat();
    }))
  }
  ngOnDestroy(): void {
    this.alive = false
  }
  refreshDatat(): void{
    this.parentsService.getLastChange(this.id).subscribe((val) => {
      console.log(val);
      let lastChange = new Date(val)
      console.log(lastChange.toISOString())
      if(val && lastChange.getTime() > this.parentsService.lastSeen[this.id]){
        this.readData(false)
      }
    })
  }
  readData(doColdef: boolean) {
    console.log("readData called: " + doColdef)
    this.parentsService.getPTMById(this.id).subscribe(
      (val) => {
        this.ptm = val
        if (!this.isStudent) {
          this.parentsService.getFreeTeachers(this.id).subscribe(
            (val) => {
              this.freeTeachers = val
              this.createData(doColdef)
            }
          )
        } else {
          this.createData(doColdef)
        }
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
    this.eventsTimeStudent = {}
    if (!colDefIsReady) {
      colDef.push(
        {
          field: 'teacher',
          pinned: 'left',
          minWidth: 100,
          lockPinned: true,
          headerName: this.languageS.trans('Teacher'),
          sortable: true
        }
      )
      if (!this.authService.isMD()) {
        colDef.push(
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
    }
    for (let ptmTeacherInRoom of this.ptm.ptmTeacherInRoomList) {
      this.eventsTeacherStudent[ptmTeacherInRoom.teacher.id] = {}
      if (this.selectedStudent) {
        //If student selected show only the corresponding teachers
        if (!this.selectedStudent.classIds.some(classId => ptmTeacherInRoom.teacher.classIds.includes(classId))) {
          continue
        }
      }
      let roomEvents = {
        teacher: ptmTeacherInRoom.teacher.surName + ', ' + ptmTeacherInRoom.teacher.givenName,
        room: ptmTeacherInRoom.room.description ? ptmTeacherInRoom.room.description : ptmTeacherInRoom.room.name,
        ptmId: ptmTeacherInRoom.id,
        teacherId: ptmTeacherInRoom.teacher.id
      }
      for (let ptmEvent of ptmTeacherInRoom.events.sort(this.compare)) {
        let time = this.utilService.getDouble(new Date(ptmEvent.start).getHours()) + ':' + this.utilService.getDouble(new Date(ptmEvent.start).getMinutes())
        this.events[ptmEvent.id] = ptmEvent
        if (!this.eventsTimeStudent[time]) {
          this.eventsTimeStudent[time] = {}
        }
        if (ptmEvent.student) {
          this.eventsTeacherStudent[ptmTeacherInRoom.teacher.id][ptmEvent.student.id] = time
          this.eventsTimeStudent[time][ptmEvent.student.id] = ptmTeacherInRoom.id
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
    for (let teacher of this.freeTeachers) {
      if (this.selectedStudent) {
        //If student selected show only the corresponding teachers
        if (!this.selectedStudent.classIds.some(classId => teacher.classIds.includes(classId))) {
          continue
        }
      }
      data.push(
        {
          teacher: teacher.surName + ', ' + teacher.givenName,
          room: "0",
          ptmId: 0,
          teacherId: teacher.id
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
  deselectStudent(selectStudentModal) {
    selectStudentModal.close()
    this.selectedStudent = null
    this.readData(false)
  }
  registerEvent(event: PTMEvent) {
    this.selectedEvent = event
    this.selectedEventRegistered = this.selectedEvent.student != null
    if (this.selectedStudent) {
      if (!this.selectedEvent.student) {
        this.selectedEvent.student = this.selectedStudent
        this.doRegister()
      } else {
        this.cancelEvent();
      }
    } else {
      this.selectedPTMinRoom = this.selectPTMinRoom(event)
      this.isRegisterEventOpen = true
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
        this.isRegisterRoomOpen = true;
      })
  }
  doRegisterRoom() {
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
      message: this.languageS.trans('Remove registrations for:') + this.ptmTeacherInRoom.teacher.surName + "," + this.ptmTeacherInRoom.teacher.givenName,
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

  printEventForStudent() {
    let start = new Date(this.ptm.start)
    let end = new Date(this.ptm.end)
    let date = this.utilService.toIonDate(start)
    let startTime = this.utilService.toIonTime(start)
    let endTime = this.utilService.toIonTime(end)
    let html = '<h2>' + this.languageS.trans('PTM') + ' ' + date + ': ' + startTime + ' - ' + endTime + '</h2>\n'
    html += '<table>\n'
    html += '<caption>' + this.languageS.trans('Student') + ': ' + this.selectedStudent.surName + ', ' + this.selectedStudent.givenName + '</caption>\n'
    html += '<tr><th>'
    html += this.languageS.trans('Time')
    html += '</th><th>'
    html += this.languageS.trans('room')
    html += '</th><th>'
    html += this.languageS.trans('Teacher')
    html += '</th></tr>\n'
    for (let time in this.eventsTimeStudent) {
      if (this.eventsTimeStudent[time][this.selectedStudent.id]) {
        let id = this.eventsTimeStudent[time][this.selectedStudent.id]
        for (let tmp of this.ptm.ptmTeacherInRoomList) {
          if (tmp.id == id) {
            let room = tmp.room.name
            let teacher = tmp.teacher.surName + ", " + tmp.teacher.givenName
            html += `<tr><td>${time}</td><td>${room}</td><td>${teacher}</td></tr>\n`
            break
          }
        }
      }
    }
    html += '</table>'
    var hostname = window.location.hostname;
    var protocol = window.location.protocol;
    var port = window.location.port;
    sessionStorage.setItem('printPage', html);
    sessionStorage.setItem('instituteName', this.instituteName)
    if (port) {
      this.nativeWindow.open(`${protocol}//${hostname}:${port}`);
      sessionStorage.removeItem('shortName');
    } else {
      this.nativeWindow.open(`${protocol}//${hostname}`);
      sessionStorage.removeItem('shortName');
    }
    sessionStorage.removeItem('printPage');
    sessionStorage.removeItem('instituteName');
  }
}
