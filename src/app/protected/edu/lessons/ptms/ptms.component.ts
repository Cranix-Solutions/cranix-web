import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ParentTeacherMeeting, PTMEvent, PTMTeacherInRoom, Room } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-ptms',
  templateUrl: './ptms.component.html',
  styleUrl: './ptms.component.css'
})
export class PtmsComponent implements OnInit {
  freeRooms: Room[]
  isAddPTMOpen: boolean = false
  addEditPTMTitle: string = ""
  selectedPTM: ParentTeacherMeeting
  nextPtms: ParentTeacherMeeting[] = []
  myPTMTeacherInRoom: PTMTeacherInRoom
  now: Date;

  constructor(
    public authService: AuthenticationService,
    private langService: LanguageService,
    private objectService: GenericObjectService,
    private utilsService: UtilsService,
    public ptmService: ParentsService
  ) {
    this.now = new Date()
    this.readData()
  }

  ngOnInit(): void {
    console.log("ngOnInit called")
  }
  readData() {
    this.ptmService.get().subscribe((val) => {
      this.nextPtms = val
      if (val.length == 1) {
        this.selectPTM(val[0])
      }
    })
  }

  blockEvent(eventId: number, block: boolean) {
    this.ptmService.blockEvent(eventId, block).subscribe((val) => {
      this.objectService.responseMessage(val)
    })
  }
  compare(a: any, b: any) {
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  }
  getStudentOfEvent(event: PTMEvent) {
    if (!event.blocked) {
      return event.student ? event.student.fullName : this.langService.trans('free')
    }else{
      return this.langService.trans('blocked')
    }
  }
  setBlockEvent(event){
    this.ptmService.blockEvent(event.id,!event.blocked).subscribe((val) => {
      this.objectService.responseMessage(val)
      this.readData()
    })
  }
  selectPTM(ptm) {
    this.selectedPTM = this.ptmService.adaptPtmTimes(ptm);
    this.ptmService.getFreeRooms(this.selectedPTM.id).subscribe((val2) => {
      this.freeRooms = val2
    })
    for (let ptmTiR of this.selectedPTM.ptmTeacherInRoomList) {
      if (ptmTiR.teacher.id == this.authService.session.userId) {
        this.myPTMTeacherInRoom = ptmTiR
        console.log(ptmTiR)
        break
      }
    }
    if (!this.myPTMTeacherInRoom) {
      this.myPTMTeacherInRoom = new PTMTeacherInRoom()
    }
  }
  selectRoom() {
    let me = this.objectService.getObjectById("user", this.authService.session.userId);
    this.myPTMTeacherInRoom.teacher = me
    if (this.myPTMTeacherInRoom.id != 0) {
      this.ptmService.cancelRoomRegistration(this.myPTMTeacherInRoom.id).subscribe(
        (val) => {
          this.objectService.responseMessage(val)
        }
      )
    }
    this.ptmService.registerRoom(this.selectedPTM.id, this.myPTMTeacherInRoom).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.readData()
      }
    )
  }
}
