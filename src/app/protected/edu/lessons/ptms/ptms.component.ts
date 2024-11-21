import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { PtmsService } from 'src/app/services/ptms.service';
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
  listHeader: string

  constructor(
    public authService: AuthenticationService,
    public ptmService: PtmsService
  ){
    ptmService.getNextPTM().subscribe((val) => {
       this.selectedPTM = val
       if(val != null){
        ptmService.getFreeRooms(val.id).subscribe((val2) => {
          this.freeRooms = val2
        })
        this.myPTMTeacherInRoom = new PTMTeacherInRoom()
        this.listHeader = "Edit PTM"
       }else if(this.authService.isAllowed('ptms.manage')) {
        this.selectedPTM = new ParentTeacherMeeting()
        this.listHeader = "Add new PTM"
       }
      }
    )

  }
  addEditPTM(modal: any){

  }
  deletePTM(){

  }
  setOpen(open: boolean){
    this.isAddPTMOpen = open
  }
}
