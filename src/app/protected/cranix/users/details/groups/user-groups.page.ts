import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';

//own stuff
import { LanguageService } from '../../../../../services/language.service';
import { UsersService } from '../../../../../services/users.service';
import { Group } from '../../../../../shared/models/data-model'

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
  memberSelected: Group[] =[];
  noMemberSelected: Group[] =[];
  memberData: Group[] =[];
  noMemberData: Group[] =[];
  user;

  constructor(
    private objectS: GenericObjectService,
    private languageS: LanguageService,
    private  userS: UsersService
  ) {
    this.user = this.objectS.selectedObject;
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
  }
  onMemberSelectionChanged() {
    this.memberSelected = this.memberApi.getSelectedRows();
  }

  onMemberFilterChanged() {
    this.memberApi.setQuickFilter((<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onNoMemberReady(params) {
    this.noMemberApi = params.api;
    this.noMemberColumnApi = params.columnApi;
    this.noMemberApi.sizeColumnsToFit();
  }
  onNoMemberSelectionChanged() {
    this.noMemberSelected = this.noMemberApi.getSelectedRows();
  }

  onNoMemberFilterChanged() {
    this.noMemberApi.setQuickFilter((<HTMLInputElement>document.getElementById("noMemberFilter")).value);
    this.noMemberApi.doLayout();
  }
  applyChanges() {
    let groups: number[] = [];
    let rmGroups: number[] = [];
    for ( let g of this.noMemberSelected ) {
      groups.push(g.id);
    }
    for(let g of this.memberSelected) {
      rmGroups.push(g.id);
    }
    
    for( let g of this.memberData ){
      if( rmGroups.indexOf(g.id) == -1) {
        groups.push(g.id)
      }
    }
    console.log('groups');
    console.log(groups);
    this.noMemberSelected = [];
    this.memberSelected = [];
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
