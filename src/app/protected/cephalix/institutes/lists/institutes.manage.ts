import { Component, OnInit, AfterContentInit } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

//own modules
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model'
import { User } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-institutes',
  templateUrl: './institutes.manage.html',
  styleUrls: ['./institutes.manage.scss'],
})
export class InstitutesManage implements OnInit {
  managedIds:      number[] = [];
  userKeys:        string[] = [ 'id','uid','givenName','surName','role'];
  instituteKeys:   string[] = [ 'id','uuid','name','locality','validity'];
  managerUsers:    User[]   = [];
  selectedManager: User     = new User();
  instituteView:   boolean = false;
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  title = 'app';
  rowData = [];

  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
        resizable: true,
        sortable: true,
        hide: false,
        suppressHeaderMenuButton : true,
        checkboxSelection : false
      };
  }

  ngOnInit() {

    this.createColumnDefs(this.userKeys);
    for (let user of this.objectService.allObjects['user'] ) {
      if (user.role.toLowerCase() == "reseller" || user.role == "sysadmins") {
        this.managerUsers.push(user)
      }
    }
  }

  createColumnDefs(keys: string[]) {
    let columnDefs = [];
    for (let key of keys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      switch (key) {
        case 'uuid': {
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['minWidth'] = 170;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          columnDefs.push(col);
          continue;
        }
      }
      columnDefs.push(col);
    }
    console.log(this.columnDefs);
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.setRowData(this.managerUsers);
    params.columnApi.autoSizeColumns();
    this.gridApi.addEventListener('rowClicked', this.userRowClickedHandler);
  }

  userRowClickedHandler(event) {
    console.log("userRowClickedHandler:" + event);
    let myContent = event.context['componentParent'];
    myContent.selectedManager = event.data;
    myContent.gridApi.removeEventListener('rowClicked', myContent.userRowClickedHandler);
    myContent.createColumnDefs(myContent.instituteKeys);
    myContent.gridApi.setRowData(myContent.objectService.allObjects['institute']);
    myContent.instituteView = true;
    (<HTMLInputElement>document.getElementById("instituteManageTable")).style.setProperty('height', '93%');
    myContent.gridApi.addEventListener('rowClicked', myContent.instituteRowClickedHandler);
    myContent.objectService.okMessage("Loading data ...");
    //select the owned schools
    myContent.cephalixService.getInstitutesFromUser(myContent.selectedManager.id).subscribe(
      (val) => {
        console.log(val)
        var managedIds = [];
        for( let obj of val) {
          managedIds.push(obj.id)
        }
        myContent.managedIds = managedIds;
        myContent.gridApi.forEachNode(
          function (node, index) {
            if( managedIds.indexOf(node.data.id) != -1 ) {
              node.setSelected(true);
            }
          }
        )
      }
    )
  }

  userList() {
    this.gridApi.removeEventListener('rowClicked', this.instituteRowClickedHandler);
    this.createColumnDefs(this.userKeys);
    this.gridApi.setRowData(this.managerUsers);
    this.instituteView = false;
    (<HTMLInputElement>document.getElementById("instituteManageTable")).style.setProperty('height', '100%');
    this.gridApi.addEventListener('rowClicked', this.userRowClickedHandler);
  }

  instituteRowClickedHandler(event) {
    let myContent = event.context['componentParent'];
    let index = myContent.managedIds.indexOf(event.data.id);
    if( index == -1) {
      myContent.cephalixService.addUserToInstitute(myContent.selectedManager.id, event.data.id).subscribe(
        val => {
          myContent.objectService.responseMessage(val);
          myContent.managedIds.push(event.data.id);
        }
      )
    } else {
      myContent.cephalixService.deleteUserFromInstitute(myContent.selectedManager.id, event.data.id).subscribe(
        val => {
          myContent.objectService.responseMessage(val);
          myContent.managedIds.splice(index,1);
        }
      )
    }
  }

  showSelected() {
    let selectedRows = this.gridApi.getSelectedRows();
    this.gridApi.setRowData(selectedRows);
    this.gridApi.selectAll();
  }

  showAll() {
    this.gridApi.setRowData(this.objectService.allObjects['institute']);
    var managedIds = this.managedIds;
    this.gridApi.forEachNode(
      function (node, index) {
        if( managedIds.indexOf(node.data.id) != -1 ) {
          node.setSelected(true);
        }
      }
    )
  }

  onQuickFilterChanged(quickFilter) {
    console.log(quickFilter,'value',(<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById(quickFilter)).value);
  }

  onGridSizeChange(params) {
    var allColumns = params.columnApi.getColumns();
    params.api.sizeColumnsToFit();
    params.columnApi.autoSizeColumns();
    //this.sizeAll();
  }

  sizeAll(skip) {
    var allColumnIds = [];
    this.columnApi.getColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    //this.gridApi.sizeColumnsToFit();
    this.columnApi.autoSizeColumns(allColumnIds, skip);
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

}
