import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Room } from 'src/app/shared/models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'roomType', 'roomControl', 'hwconfId', 'actions'];
  sortableColumns: string[] = ['name', 'description', 'roomType', 'roomControl', 'hwconfId'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Room[];
  title = 'app';
  rowData = [];

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Room());
    this.createColumnDefs();
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowHeight: 35
    }
  }
  ngOnInit() {
    this.storage.get('RoomsPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    this.objectService.getObjects('room').subscribe(obj => this.rowData = obj);
  }
  createColumnDefs() {
    let columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['sortable'] = (this.sortableColumns.indexOf(key) != -1);
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = true;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = true;
          col['width'] = 220;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          break;
        }
        case 'hwconfId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('hwconf', params.data.hwconfId);
          }
          //col['cellRendererFramework'] = HwconfIdCellRenderer;
          break;
        }
      }
      columnDefs.push(col);
    }
    let action = {
      headerName: "",
      width: 100,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: ActionBTNRenderer
    };
    columnDefs.splice(1, 0, action);
    this.columnDefs = columnDefs;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
  }
  onSelectionChanged() {
    this.selected = this.gridApi.getSelectedRows();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();

  }
  onResize($event) {
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    this.sizeAll();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }

  public redirectToDelete = (room: Room) => {
    this.objectService.deleteObjectDialog(room, 'room')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async openActions(ev: any, objId: number) {
    if (!this.selected && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < this.selected.length; i++) {
        objectIds.push(this.selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "room",
        objectIds: objectIds,
        selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, room: Room) {
    if (room) {
      this.objectService.selectedObject = room;
      this.route.navigate(['/pages/cranix/rooms/' + room.id]);
    } else {
      room = new Room;
      delete room.network;
      delete room.netMask;
      delete room.startIP;
      room.devCount = 32;
      //TODO set defaults configurable
      room.roomControl = 'allTeachers'
      room.roomType = 'ComputerRoom'
      room.hwconfId = 4
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "room",
          objectAction: 'add',
          object: room
        },
        animated: true,
        swipeToClose: true,
        showBackdrop: true
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned.data) {
          console.log("Object was created or modified", dataReturned.data)
        }
      });
      (await modal).present();
    }
  }

  /**
* Function to select the columns to show
* @param ev 
*/
  async openCollums(ev: any) {
    const modal = await this.modalCtrl.create({
      component: SelectColumnsComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns,
        objectPath: "RoomsPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = dataReturned.data.concat(['actions']);
        this.createColumnDefs();
      }
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }
}
