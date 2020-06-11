import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//own stuff
import { LanguageService } from 'src/app/services/language.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Group, User } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cranix-group-members',
  templateUrl: './group-members.page.html',
  styleUrls: ['./group-members.page.scss'],
})
export class GroupMembersPage implements OnInit {
  memberOptions;
  noMemberOptions;
  columnDefs = [];
  memberApi;
  noMemberApi;
  memberColumnApi;
  noMemberColumnApi;
  memberSelection: User[] =[];
  noMemberSelection: User[] =[];
  memberData: User[] =[];
  noMemberData: User[] =[];
  group;

  constructor(
    public authService: AuthenticationService,
    private objectS: GenericObjectService,
    public modalCtrl: ModalController,
    private languageS: LanguageService,
    private  groupS: GroupsService,
    public translateServices: TranslateService
  ) {
    this.group = <Group>this.objectS.selectedObject;
    this.columnDefs = [
      {
        headerName:  this.languageS.trans('uid'),
        field: 'uid',
        sortable: true,
        headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
	headerCheckboxSelectionFilteredOnly: true,
	checkboxSelection: this.authService.settings.checkboxSelection,
        suppressMenu : true
      },
      {
        headerName: this.languageS.trans('givenName'),
        sortable: true,
        field: 'givenName',
        suppressMenu : true
      },
      {
        headerName: this.languageS.trans('surName'),
        sortable: true,
        field: 'surName',
        suppressMenu : true
      }
    ]
  }

  ngOnInit() {
    this.readMembers();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    this.memberApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
  }
  onMemberSelectionChanged() {
    this.memberSelection = this.memberApi.getSelectedRows();
  }

  onMemberFilterChanged() {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onNoMemberReady(params) {
    this.noMemberApi = params.api;
    this.noMemberColumnApi = params.columnApi;
    this.noMemberApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("noMemberTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
  }
  onNoMemberSelectionChanged() {
    this.noMemberSelection = this.noMemberApi.getSelectedRows();
  }

  onNoMemberFilterChanged() {
    this.noMemberApi.setQuickFilter((<HTMLInputElement>document.getElementById("noMemberFilter")).value);
    this.noMemberApi.doLayout();
  }
  applyChanges() {
    let members: number[] = [];
    let rmMembers: number[] = [];
    for ( let g of this.noMemberSelection ) {
      members.push(g.id);
    }
    for(let g of this.memberSelection) {
      rmMembers.push(g.id);
    }
    
    for( let g of this.memberData ){
      if( rmMembers.indexOf(g.id) == -1) {
        members.push(g.id)
      }
    }
    this.authService.log('groups');
    this.authService.log(members);
    this.noMemberSelection = [];
    this.memberSelection = [];
    let subM = this.groupS.setGroupMembers(this.group.id,members).subscribe(
      (val) => { this.readMembers() } ,
      (err)  => { this.authService.log(err)},
      () => { subM.unsubscribe()});
  }

  readMembers() {
    let subM = this.groupS.getMembers(this.group.id).subscribe(
      (val) => { this.memberData = val; this.authService.log(val) } ,
      (err)  => { this.authService.log(err)},
      () => { subM.unsubscribe()});
    let subNM = this.groupS.getAvailiableMembers(this.group.id).subscribe(
      (val) => { this.noMemberData = val; this.authService.log(val) } ,
      (err)  => { this.authService.log(err)},
      () => { subNM.unsubscribe()})
    }
}
