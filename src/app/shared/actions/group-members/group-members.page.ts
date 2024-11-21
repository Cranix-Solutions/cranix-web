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
  context;
  memberOptions;
  noMemberOptions;
  columnDefs = [];
  memberApi;
  noMemberApi;
  memberSelection: User[] = [];
  noMemberSelection: User[] = [];
  memberData: User[] = [];
  noMemberData: User[] = [];
  group;

  constructor(
    public authService: AuthenticationService,
    private objectS: GenericObjectService,
    public modalCtrl: ModalController,
    private languageS: LanguageService,
    private groupS: GroupsService,
    public translateServices: TranslateService
  ) {}

  ngOnInit() {
    console.log('innerWidth',window.innerWidth)
    this.context = { componentParent: this }
    this.group = <Group>this.objectS.selectedObject;
    if( window.innerWidth < 500 ) {
      this.mdColDef()
    } else {
      this.brColDef()
    }
    this.readMembers();
  }
  mdColDef() {
    this.columnDefs = [
      {
        headerName: this.languageS.trans('user'),
        field: 'fullName',
        sortable: true,
        minWidth: 200,
        headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        suppressHeaderMenuButton: true
      },
      {
        headerName: this.languageS.trans('role'),
        sortable: true,
        resizable: true,
        field: 'role',
        width: 100,
        suppressHeaderMenuButton: true,
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.role);
        }
      }
    ]
  }
  brColDef() {
    this.columnDefs = [
      {
        headerName: this.languageS.trans('uid'),
        field: 'uid',
        sortable: true,
        headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        suppressHeaderMenuButton: true
      },
      {
        headerName: this.languageS.trans('surName'),
        sortable: true,
        resizable: true,
        field: 'surName'
      },
      {
        headerName: this.languageS.trans('givenName'),
        sortable: true,
        resizable: true,
        field: 'givenName'
      },
      {
        headerName: this.languageS.trans('role'),
        sortable: true,
        resizable: true,
        field: 'role',
        width: 150,
        suppressHeaderMenuButton: true,
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.role);
        }
      }
    ]
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  onMemberReady(params) {
    this.memberApi = params.api;
    this.memberApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("memberTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  onMemberSelectionChanged() {
    this.memberSelection = this.memberApi.getSelectedRows();
  }

  onMemberFilterChanged() {
    this.memberApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("memberFilter")).value);
    this.memberApi.doLayout();
  }

  onNoMemberReady(params) {
    this.noMemberApi = params.api;
    this.noMemberApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("noMemberTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  onNoMemberSelectionChanged() {
    this.noMemberSelection = this.noMemberApi.getSelectedRows();
  }

  onNoMemberFilterChanged() {
    this.noMemberApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("noMemberFilter")).value);
    this.noMemberApi.doLayout();
  }
  applyChanges() {
    let members: number[] = [];
    let rmMembers: number[] = [];
    for (let g of this.noMemberSelection) {
      members.push(g.id);
    }
    for (let g of this.memberSelection) {
      rmMembers.push(g.id);
    }

    for (let g of this.memberData) {
      if (rmMembers.indexOf(g.id) == -1) {
        members.push(g.id)
      }
    }
    this.authService.log('groups');
    this.authService.log(members);
    this.noMemberSelection = [];
    this.memberSelection = [];
    this.objectS.requestSent();
    let subM = this.groupS.setGroupMembers(this.group.id, members).subscribe(
      (val) => {
        this.objectS.responseMessage(val);
        this.readMembers()
      },
      (err) => {
        this.objectS.errorMessage(
          this.languageS.trans("A server error occoured.")
        )
        this.authService.log(err)
      },
      () => { subM.unsubscribe() });
  }

  readMembers() {
    let subM = this.groupS.getMembers(this.group.id).subscribe(
      (val) => { this.memberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
    let subNM = this.groupS.getAvailiableMembers(this.group.id).subscribe(
      (val) => { this.noMemberData = val; this.authService.log(val) },
      (err) => { this.authService.log(err) },
      () => { subNM.unsubscribe() })
  }
}
