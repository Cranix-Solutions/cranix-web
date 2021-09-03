import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { GroupActionBTNRenderer } from 'src/app/pipes/ag-group-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Group, GuestUsers, Room, User } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { GroupMembersPage } from 'src/app/shared/actions/group-members/group-members.page';
import { EductaionService } from 'src/app/services/education.service';
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';

@Component({
  selector: 'cranix-mygroups',
  templateUrl: './mygroups.page.html',
  styleUrls: ['./mygroups.page.scss'],
})
export class MyGroupsPage implements OnInit {
  segment: string = 'group';
  objectKeys: string[] = [];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
  rowData = [];
  modules = [];
  guestAccounts: GuestUsers[] = [];
  userData: User[] = [];
  selection = [];
  selectedIds: number[] = [];

  constructor(
    public authService: AuthenticationService,
    public educationService: EductaionService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    public translateService: TranslateService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    }
  }
  ngOnInit() {
    this.readGuestAccounts();
    this.userData = this.objectService.allObjects['education/user'].sort(
      (a, b) => (a.groupName > b.groupName) ? 1 : (b.groupName > a.groupName) ? -1 : 0
    );
    this.groupColumnDefs();
  }

  segmentChanged(event) {
    this.segment = event.detail.value;
    switch (this.segment) {
      case 'group': { this.groupColumnDefs(); break; }
      case 'user': { this.userColumnDefs(); break; }
      case 'guest': { this.guestColumnDefs(); break; }
    }
  }

  groupColumnDefs() {
    this.rowData = this.objectService.allObjects['education/group'];
    this.columnDefs = [
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerName: this.languageS.trans('groupName'),
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        minWidth: 150,
        suppressSizeToFit: true,
      },
      {
        headerName: "",
        minWidth: 150,
        suppressSizeToFit: true,
        cellStyle: { 'padding': '2px' },
        field: 'actions',
        cellRendererFramework: GroupActionBTNRenderer
      },
      {
        field: 'description',
        minWidth: 250,
        headerName: this.languageS.trans('description')
      },
      {
        field: 'groupType',
        minWidth: 150,
        headerName: this.languageS.trans('groupType'),
        hide: false,
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.groupType);
        }
      }
    ];
  }

  userColumnDefs() {
    this.rowData = this.userData;
    this.columnDefs = [
      {
        field: 'groupName',
        headerName: this.languageS.trans('groupName'),
        minWidth: 150,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
        checkboxSelection: this.authService.settings.checkboxSelection
      },
      {
        field: 'uid',
        sortable: true,
        headerName: this.languageS.trans('uid')
      },
      {
        field: 'givenName',
        sortable: true,
        headerName: this.languageS.trans('givenName')
      },
      {
        field: 'surName',
        sortable: true,
        headerName: this.languageS.trans('surName')
      }
    ];
  }

  guestColumnDefs() {
    this.rowData = this.guestAccounts;
    this.columnDefs = [
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        minWidth: 150,
        suppressSizeToFit: true,
      },
      {
        headerName: "",
        minWidth: 150,
        suppressSizeToFit: true,
        cellStyle: { 'padding': '2px' },
        field: 'actions',
        cellRendererFramework: EditBTNRenderer
      },
      {
        field: 'description',
        minWidth: 250,
        headerName: this.languageS.trans('description')
      },
      {
        headerName: this.languageS.trans('count'),
        field: 'count'
      },
      {
        headerName: this.languageS.trans('private'),
        field: 'privateGroup',
        cellRendererFramework: YesNoBTNRenderer
      },
      {
        headerName: this.languageS.trans('AdHoc-Room'),
        field: 'createAdHocRoom',
        cellRendererFramework: YesNoBTNRenderer
      },
      {
        headerName: this.languageS.trans('validUntil'),
        field: 'validUntil',
        cellRendererFramework: DateTimeCellRenderer
      }
    ];
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  selectionChanged() {
    this.selectedIds = []
    for (let i = 0; i < this.gridApi.getSelectedRows().length; i++) {
      this.selectedIds.push(this.gridApi.getSelectedRows()[i].id);
    }
    this.selection = this.gridApi.getSelectedRows()
  }
  checkChange(ev: CustomEvent, obj) {
    if (ev.detail.checked) {
      this.selectedIds.push(obj.id)
      this.selection.push(obj)
    } else {
      this.selectedIds = this.selectedIds.filter(id => id != obj.id)
      this.selection = this.selection.filter(obj => obj.id != obj.id)
    }
  }
  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    if (this.authService.isMobile) {
      this.rowData = [];
      switch (this.segment) {
        case 'group': {
          for (let obj of this.objectService.allObjects['education/group']) {
            if (
              obj.name.toLowerCase().indexOf(filter) != -1 ||
              obj.description.toLowerCase().indexOf(filter) != -1 ||
              this.languageS.trans(obj.groupType).toLowerCase().indexOf(filter) != -1
            ) {
              this.rowData.push(obj)
            }
          }
          break;
        }
        case 'user': {
          for (let obj of this.userData) {
            if (
              obj.uid.toLowerCase().indexOf(filter) != -1 ||
              obj.givenName.toLowerCase().indexOf(filter) != -1 ||
              obj.surName.toLowerCase().indexOf(filter) != -1 ||
              ( obj.classes && obj.classes.toLowerCase().indexOf(filter) != -1 )
            ) {
              this.rowData.push(obj)
            }
          }
          break;
        }
        case 'guest': {
          for (let obj of this.guestAccounts) {
            if (
              obj.name.toLowerCase().indexOf(filter) != -1 ||
              obj.description.toLowerCase().indexOf(filter) != -1
            ) {
              this.rowData.push(obj)
            }
          }
          break;
        }
      }

    } else {
      this.gridApi.setQuickFilter(filter);
      this.gridApi.doLayout();
    }
  }
  public redirectToDelete = (group: Group) => {
    this.objectService.deleteObjectDialog(group, 'education/group', '')
  }
  /**
  * Open the actions menu with the selected object ids.
  * @param ev
  */
  async openActions(ev: any, object ) {
    if (object) {
      this.selectedIds.push(object.id)
      this.selection.push(object)
    } else {
      if (this.selection.length == 0) {
        this.objectService.selectObject();
        return;
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "education/" + this.segment,
        objectIds: this.selectedIds,
        selection: this.selection,
        gridApi: this.gridApi
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  /**
   * Function to add or edit a group.
   * Group is null a new group will be created.
   * @param ev
   * @param group
   */
  async redirectToMembers(group: Group) {
    this.objectService.selectedObject = group;
    const modal = await this.modalCtrl.create({
      component: GroupMembersPage,
      cssClass: 'big-modal',
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.gridApi.deselectAll();
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  async redirectToEdit(anyObject: any) {
    let action = anyObject ? 'modify' : 'add';
    let objectType = "";
    switch (this.segment) {
      case 'user': {
        if (!anyObject) { anyObject = new User }
        objectType = 'user.students'
      }
      case 'group': {
        if (!anyObject) { anyObject = new Group }
        objectType = 'education/group'
        delete anyObject.groupType
      }
    }
    if (action == 'add') {
      delete anyObject.id;
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: objectType,
        objectAction: action,
        object: anyObject
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      switch (this.segment) {
        case 'group': { this.groupColumnDefs(); break; }
        case 'user': { this.userColumnDefs(); break; }
        case 'guest': { this.guestColumnDefs(); break; }
      }
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  async addEditGuest(guest: GuestUsers) {
    let action = 'modify';
    if (!guest) {
      guest = new GuestUsers();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: AddEditGuestPage,
      cssClass: 'medium-modal',
      componentProps: {
        action: action,
        guest: guest
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
        this.readGuestAccounts()
      }
    });
    (await modal).present();
  }
  readGuestAccounts() {
    this.educationService.getGuestAccounts().subscribe(
      (val) => { this.guestAccounts = val }
    )
  }
}

@Component({
  selector: 'cranix-add-edit-guest',
  templateUrl: './add-edit-guest.html'
})
export class AddEditGuestPage implements OnInit {

  now: string;
  disabled: boolean = false;
  selectedRooms: Room[] = []
  @Input() guest: GuestUsers
  @Input() action: string
  constructor(
    public educationService: EductaionService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.now = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
  }

  ngOnInit() {
  }

  onSubmit() {
    this.objectService.requestSent();
    this.disabled = true;
    console.log(this.guest)
    for (let r of this.selectedRooms) {
      this.guest.roomIds.push(r.id)
    }
    let sub = this.educationService.addGuestUsers(this.guest).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalCtrl.dismiss("OK")
        }
        this.disabled = false;
      },
      (err) => {
        this.disabled = false;
        this.objectService.errorMessage("ERROR")
      },
      () => { sub.unsubscribe() }
    );
  }
}

