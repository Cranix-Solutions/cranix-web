import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { ParentsService } from 'src/app/services/parents.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PTMTeacherInRoom, ParentTeacherMeeting, Room, TeachingSubject, User } from 'src/app/shared/models/data-model';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer'

@Component({
  selector: 'app-manage-parents',
  templateUrl: './manage-parents.component.html',
  styleUrl: './manage-parents.component.css'
})
export class ManageParentsComponent {
  segment: string = "parents"
  rowData: any[] = []
  selectedPTM: ParentTeacherMeeting = new ParentTeacherMeeting()
  selectedParent: User
  selectedChildren: User[]
  children: User[]
  parents: User[]
  isRegisterRoomOpen: boolean = false
  isRegisterEventOpen: boolean = false
  isAddEditParentOpen: boolean = false
  objectKeys = []
  parentKeys = ['givenName', 'surName', 'emailAddress', 'telefonNummer']
  requestKeys = ['parentId', 'givenName', 'surName', 'birthDay', 'className']
  gridApi
  columnDefs = []
  defaultColumDefs = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressHeaderMenuButton: true
  }
  context
  freeRooms: Room[] = []
  freeTeachers: User[] = []
  ptmTeacherInRoom: PTMTeacherInRoom

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    private languageS: LanguageService,
    private parentsService: ParentsService,
    private utilsService: UtilsService
  ) {

    this.context = { componentParent: this };
    this.loadData()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  segmentChanged(event) {
    console.log(event)
    this.segment = event.detail.value
    this.loadData()
  }

  loadData() {
    switch (this.segment) {
      case 'parents': {
        this.objectKeys = this.parentKeys
        this.createdColDef()
        this.parentsService.getChildren().subscribe((val) => { this.children = val })
        this.parentsService.getParents().subscribe((val) => {
          this.rowData = val
        })
        break;
      }
      case 'requests': {
        this.objectKeys = this.requestKeys
        this.createdColDef()
        this.parentsService.getParentRequests().subscribe((val) => { this.rowData = val })
        break;
      }
      case 'ptm': {
        this.parentsService.getNextPTM().subscribe(
          (val) => {
            if (val) {
              console.log(val)
              this.selectedPTM = val
              this.selectedPTM.start = this.utilsService.toIonISOString(new Date(val.start))
              this.selectedPTM.end = this.utilsService.toIonISOString(new Date(val.end))
              this.selectedPTM.startRegistration = this.utilsService.toIonISOString(new Date(val.startRegistration))
              this.selectedPTM.endRegistration = this.utilsService.toIonISOString(new Date(val.endRegistration))
            } else {
              this.selectedPTM = new ParentTeacherMeeting();
            }
            console.log(this.selectedPTM)
          }
        )
      }
    }
  }

  createdColDef() {
    let cols = []
    cols.push({
      field: 'id',
      pinned: 'left',
      width: 110,
      cellRenderer: EditBTNRenderer,
      headerName: ""
    })
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      cols.push(col)
    }
    this.columnDefs = cols;
  }

  addEditPTM() {
    if (this.selectedPTM.id > 0) {
      this.parentsService.modifyPtm(this.selectedPTM).subscribe((val) => {
        this.objectService.responseMessage(val)
        this.loadData()
      })
    } else {
      console.log(this.selectedPTM)
      this.parentsService.addPtm(this.selectedPTM).subscribe((val) => {
        this.objectService.responseMessage(val)
        this.loadData()
      })
    }
  }

  doRegisterRoom() {
    this.parentsService.registerRoom(this.selectedPTM.id, this.ptmTeacherInRoom).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.isRegisterRoomOpen = false
      }
    )
  }

  registerRoom() {
    this.parentsService.getFreeRooms(this.selectedPTM.id).subscribe(
      (val) => {
        this.freeRooms = val
        this.freeTeachers = this.parentsService.getFreeTeachers(this.selectedPTM.id).subscribe(
          (val) => {
            this.freeTeachers = val
            this.ptmTeacherInRoom = new PTMTeacherInRoom()
            this.isRegisterRoomOpen = true
          }
        )
      })
  }

  redirectToEdit(parent: User) {
    if (parent) {
      this.selectedParent = parent
    } else {
      this.selectedParent = new User()
    }
    this.isAddEditParentOpen = true;
  }

  addEditParent(){
    this.selectedParent.role='parents'
    if(this.selectedParent.id){
      this.parentsService.modifyParent(this.selectedParent).subscribe((val) => {
        this.objectService.responseMessage(val)
      })
    } else {
      this.parentsService.addParent(this.selectedParent).subscribe((val) => {
        this.objectService.responseMessage(val)
        console.log(val.objectId)
      })
    }
  }
}
