import { Component, Input, OnInit } from '@angular/core';
import { PTMEvent, PTMTeacherInRoom, ParentTeacherMeeting, User } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EventRenderer } from 'src/app/pipes/ag-event-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-ptm-view',
  templateUrl: './cranix-ptm-view.component.html',
  styleUrl: './cranix-ptm-view.component.css'
})
export class CranixPtmViewComponent implements OnInit {
  context
  students: User[] = []
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
  ptm: ParentTeacherMeeting
  isRegisterEventOpen: boolean = false
  selectedEvent: PTMEvent
  selectedPTMinRoom: PTMTeacherInRoom
  @Input() id: number;
  constructor(
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
      this.me = this.objectService.getObjectById("user",this.authService.session.userId)
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
  readData(doColdef: boolean){
    this.parentsService.getPTMById(this.id).subscribe(
      (val) => {
        this.ptm = val
        this.createData(doColdef)
      }
    )
  }
  createData(doColdef: boolean) {
    let colDefIsReady = !doColdef
    let data = []
    let colDef = []
    for (let ptmTeacherInRoom of this.ptm.ptmTeacherInRoomList) {
      let roomEvents = {
        teacher: ptmTeacherInRoom.teacher.surName + ', ' + ptmTeacherInRoom.teacher.givenName,
        room: ptmTeacherInRoom.room.description ? ptmTeacherInRoom.room.description : ptmTeacherInRoom.room.name
      }
      if (!colDefIsReady) {
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
            width: 100,
            lockPinned: true,
            headerName: this.languageS.trans('Room'),
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
    if( doColdef ) {
      this.columnDefs = colDef
    }
    this.rowData = data
    console.log(this.columnDefs)
    console.log(this.rowData)
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
    if (!this.selectedEvent.student && this.isParent) {
      this.selectedEvent.parent = this.me
      if (this.students.length == 1) {
        this.selectedEvent.student = this.students[0]
      }
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
}
