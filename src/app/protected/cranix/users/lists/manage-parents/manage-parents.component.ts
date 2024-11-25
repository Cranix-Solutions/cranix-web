import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { PtmsService } from 'src/app/services/ptms.service';
import { ParentTeacherMeeting } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-manage-parents',
  templateUrl: './manage-parents.component.html',
  styleUrl: './manage-parents.component.css'
})
export class ManageParentsComponent {
  segment: string ="parents"
  rowData: any[] = []
  selectedPTM: ParentTeacherMeeting = new ParentTeacherMeeting()
  isRegisterRoomOpen: boolean = false
  objectKeys = []
  parentKeys = [ 'givenName', 'surName', 'emailAddress']
  requestKeys = [ 'givenName', 'surName', 'birthDay', 'className' ]
  gridApi
  columnDefs = []
  defaultColumDefs = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressHeaderMenuButton: true
  }

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    private ptmsService: PtmsService
  ){
    this.loadData()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  segmentChanged(event){
    console.log(event)
    this.segment = event.detail.value
    this.loadData()
  }

  loadData(){
    switch(this.segment){
      case 'parents': {
        this.objectKeys = this.parentKeys
        break;
      }
      case 'requests': {
        this.objectKeys = this.requestKeys
        break;
      }
      case 'ptm': {
        this.ptmsService.getNextPTM().subscribe(
          (val) => {
            if(val) {
              this.selectedPTM = val
            } else {
              this.selectedPTM = new ParentTeacherMeeting();
            }
          }
        )
      }
    }
  }

  createdColDef(){
    this.columnDefs = []
    for(let key in this.objectKeys){
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      this.columnDefs.push(col)
    }
  }
}
