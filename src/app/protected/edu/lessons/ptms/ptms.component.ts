import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ParentTeacherMeeting, PTMTeacherInRoom, Room } from 'src/app/shared/models/data-model';

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
  newPtms: ParentTeacherMeeting[]
  myPTMTeacherInRoom: PTMTeacherInRoom
  now: Date;

  constructor(
    public authService: AuthenticationService,
    private objectService: GenericObjectService,
    private utilsService: UtilsService,
    public ptmService: ParentsService
  ) {
    this.now = new Date()
    this.readDatas()
  }

  ngOnInit(): void {
    console.log("ngOnInit called")
  }
  readDatas() {
    this.ptmService.get().subscribe((val) => {
      this.newPtms = val
    })
  }

  selectPTM(){
    this.selectedPTM = this.ptmService.adaptPtmTimes(this.selectedPTM)
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
  selectRoom(){
    let me = this.objectService.getObjectById("user",this.authService.session.userId);
    this.myPTMTeacherInRoom.teacher=me
    if(this.myPTMTeacherInRoom.id != 0) {
      this.ptmService.cancelRoomRegistration(this.myPTMTeacherInRoom.id).subscribe(
        (val)=>{ 
          this.objectService.responseMessage(val)
        }
      )
    }
    this.ptmService.registerRoom(this.selectedPTM.id,this.myPTMTeacherInRoom).subscribe(
      (val) => { 
        this.objectService.responseMessage(val)
        this.readDatas()
      }
    )
  }
}
