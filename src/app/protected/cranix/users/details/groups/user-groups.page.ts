import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';

//own stuff
import { LanguageService } from 'src/app/services/language.service';
import { UsersService } from 'src/app/services/users.service';
import { Group, User } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-user-groups',
  templateUrl: './user-groups.page.html',
  styleUrls: ['./user-groups.page.scss'],
})
export class UserGroupsPage implements OnInit {
  context;
  memberOptions;
  noMemberOptions;
  columnDefs = [];
  memberApi;
  noMemberApi;
  memberColumnApi;
  noMemberColumnApi;
  memberSelection: Group[] =[];
  noMemberSelection: Group[] =[];
  memberData: Group[] =[];
  noMemberData: Group[] =[];
  user;

  constructor(
    public authService: AuthenticationService,
    private objectS: GenericObjectService,
    private languageS: LanguageService,
    private  userS: UsersService
  ) {
    this.user = <User>this.objectS.selectedObject;
    this.context = { componentParent: this };
    this.memberOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowSelection: 'multiple'
    }
    this.columnDefs = [
      {
        headerName:  this.languageS.trans('name'),
        field: 'name',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      {
        headerName: this.languageS.trans('description'),
        field: 'description',
      },
      {
        headerName: this.languageS.trans('groupType'),
        field: 'groupType',
      }
    ]
    this.noMemberOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowSelection: 'multiple'
    }
  }

  ngOnInit() {
    this.readGroups();
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberColumnApi = params.columnApi;
    this.memberApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
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
    (<HTMLInputElement>document.getElementById("noMemberTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
  }
  onNoMemberSelectionChanged() {
    this.noMemberSelection = this.noMemberApi.getSelectedRows();
  }

  onNoMemberFilterChanged() {
    this.noMemberApi.setQuickFilter((<HTMLInputElement>document.getElementById("noMemberFilter")).value);
    this.noMemberApi.doLayout();
  }
  applyChanges() {
    let groups: number[] = [];
    let rmGroups: number[] = [];
    for ( let g of this.noMemberSelection ) {
      groups.push(g.id);
    }
    for(let g of this.memberSelection) {
      rmGroups.push(g.id);
    }
    
    for( let g of this.memberData ){
      if( rmGroups.indexOf(g.id) == -1) {
        groups.push(g.id)
      }
    }
    console.log('groups');
    console.log(groups);
    this.noMemberSelection = [];
    this.memberSelection = [];
    let subM = this.userS.setUsersGroups(this.user.id,groups).subscribe(
      (val) => { this.readGroups() } ,
      (err)  => { console.log(err)},
      () => { subM.unsubscribe()});
  }

  readGroups() {
    let subM = this.userS.getUsersGroups(this.user.id).subscribe(
      (val) => { this.memberData = val } ,
      (err)  => { console.log(err)},
      () => { subM.unsubscribe()});
    let subNM = this.userS.getUsersAvailableGroups(this.user.id).subscribe(
      (val) => { this.noMemberData = val } ,
      (err)  => { console.log(err)},
      () => { subNM.unsubscribe()})
    }
}
