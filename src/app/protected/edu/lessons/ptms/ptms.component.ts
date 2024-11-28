import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ParentsService } from 'src/app/services/parents.service';
import { ParentTeacherMeeting, PTMTeacherInRoom, Room } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-ptms',
  standalone: true,
  imports: [],
  templateUrl: './ptms.component.html',
  styleUrl: './ptms.component.css'
})
export class PtmsComponent {
  freeRooms: Room[]
  isAddPTMOpen: boolean = false
  addEditPTMTitle: string = ""
  selectedPTM: ParentTeacherMeeting
  myPTMTeacherInRoom: PTMTeacherInRoom
  now: Date;

  constructor(
    public authService: AuthenticationService,
    private objectService: GenericObjectService,
    public ptmService: ParentsService
  ) {
    this.now = new Date()
    this.readDatas()
  }

  readDatas() {
    this.ptmService.getNextPTM().subscribe((val) => {
      this.selectedPTM = val
      if (val != null) {
        this.ptmService.getFreeRooms(val.id).subscribe((val2) => {
          this.freeRooms = val2
        })
        for (let ptmTiR of this.selectedPTM.ptmTeacherInRoomList) {
          if (ptmTiR.teacher.id == this.authService.session.userId) {
            this.myPTMTeacherInRoom = ptmTiR
            break
          }
        }
        if (!this.myPTMTeacherInRoom) {
          this.myPTMTeacherInRoom = new PTMTeacherInRoom()
        }

      }
    })
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
