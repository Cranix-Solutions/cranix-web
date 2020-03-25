import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';

//own stuff
import { LanguageService } from '../../../../../services/language.service';
import { GroupsService } from '../../../../../services/groups.service';
import { Group, User } from '../../../../../shared/models/data-model'

@Component({
  selector: 'cranix-group-members',
  templateUrl: './group-members.page.html',
  styleUrls: ['./group-members.page.scss'],
})
export class GroupMembersPage implements OnInit {
  context;
  memberOptions;
  noMemberOptions;
  columnDefs = [];
  memberApi;
  noMemberApi;
  memberColumnApi;
  noMemberColumnApi;
  memberSelected: User[] =[];
  noMemberSelected: User[] =[];
  memberData: User[] =[];
  noMemberData: User[] =[];
  group;

  constructor(
    private objectS: GenericObjectService,
    private languageS: LanguageService,
    private  groupS: GroupsService
  ) {
    this.group = <Group>this.objectS.selectedObject;

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
        headerName:  this.languageS.trans('uid'),
        field: 'uid',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      {
        headerName: this.languageS.trans('givenName'),
        field: 'givenName',
      },
      {
        headerName: this.languageS.trans('surName'),
        field: 'surName',
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
    this.readMembers();
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
    let members: number[] = [];
    let rmMembers: number[] = [];
    for ( let g of this.noMemberSelected ) {
      members.push(g.id);
    }
    for(let g of this.memberSelected) {
      rmMembers.push(g.id);
    }
    
    for( let g of this.memberData ){
      if( rmMembers.indexOf(g.id) == -1) {
        members.push(g.id)
      }
    }
    console.log('groups');
    console.log(members);
    this.noMemberSelected = [];
    this.memberSelected = [];
    let subM = this.groupS.setGroupMembers(this.group.id,members).subscribe(
      (val) => { this.readMembers() } ,
      (err)  => { console.log(err)},
      () => { subM.unsubscribe()});
  }

  readMembers() {
    let subM = this.groupS.getMembers(this.group.id).subscribe(
      (val) => { this.memberData = val; console.log(val) } ,
      (err)  => { console.log(err)},
      () => { subM.unsubscribe()});
    let subNM = this.groupS.getAvailiableMembers(this.group.id).subscribe(
      (val) => { this.noMemberData = val; console.log(val) } ,
      (err)  => { console.log(err)},
      () => { subNM.unsubscribe()})
    }
}
