import { Component, OnInit  } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { GroupActionBTNRenderer } from 'src/app/pipes/ag-group-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Group } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { GroupMembersPage  } from '../groups/details/members/group-members.page';

@Component({
  selector: 'cranix-myusers',
  templateUrl: './myusers.page.html',
  styleUrls: ['./myusers.page.scss'],
})
export class MyUsersPage implements OnInit {
  objectKeys: string[] = [];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
  rowData = [];
  modules = [ AllModules, RowGroupingModule ];
  autoGroupColumnDef;

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    private storage: Storage,
    public translateService: TranslateService
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Group());
    this.createColumnDefs();
    this.defaultColDef = {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu : true
      }
  }
  ngOnInit() {
    this.objectService.getObjects('education/user').subscribe(obj => this.rowData = obj);
  }

  createColumnDefs() {
    this.columnDefs = [
/*      {
        field: 'groupType',
        width: 150,
        headerName: this.languageS.trans('groupType'),
        sortable: false,
        rowGroup: true,
        hide: true,
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.groupType);
        }
      },*/
      {
        field: 'groupName',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        width: 150,
        hide: true,
        rowGroup: true,
        cellStyle: { 'padding-left': '2px' },
        suppressSizeToFit: true,
      },
      {
        field: 'uid',
        sortable: true,
        headerName: this.languageS.trans('uid'),
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
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
    this.autoGroupColumnDef = {
      headerName: this.languageS.trans('group'),
      sortable: true,
      minWidth: 250
    };
  }
    
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    //this.sizeAll();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();

  }

  sizeAll() {
    this.gridApi.sizeColumnsToFit();
    window.addEventListener('resize', function() {
      setTimeout(function() {
        this.gridApi.sizeColumnsToFit();
      });
    });

    this.gridApi.sizeColumnsToFit();
  }

  public redirectToDelete = (group: Group) => {
    this.objectService.deleteObjectDialog(group, 'group')
  }
  /**
  * Open the actions menu with the selected object ids.
  * @param ev
  */
  async openActions(ev: any, objId: number) {
    let selected = this.gridApi.getSelectedRows();
    if ( selected.length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < selected.length; i++) {
        objectIds.push(selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "group",
        objectIds: objectIds,
        selection: selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToMembers(ev: Event, group: Group) {
    this.objectService.selectedObject = group;
    const modal = await this.modalCtrl.create({
      component: GroupMembersPage,
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  async redirectToEdit(ev: Event, group: Group) {
    let action = 'modify';
    if (!group) {
      group = new Group();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "group",
        objectAction: action,
        object: group
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
}
