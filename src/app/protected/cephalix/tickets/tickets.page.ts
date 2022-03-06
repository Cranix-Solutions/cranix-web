import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Ticket } from 'src/app/shared/models/cephalix-data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CephalixService } from 'src/app/services/cephalix.service';

@Component({
  selector: 'cranix-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['id', 'title', 'cephalixInstituteId', 'recDate', 'ownerId', 'ticketStatus'];
  columnDefs = [];
  defaultColDef = {};
  columnApi: ColumnApi;
  gridApi: GridApi;
  context;
  title = 'app';
  objectIds: number[] = [];
  alive: boolean;
  ticketStatus: Subscription;
  ticketColor = {
    'N': 'red',
    'R': 'orange',
    'W': 'green'
  }
  rowData = [];
  selectedIds: number[] = [];
  selection: Ticket[] = [];

  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    private route: Router,
    private storage: Storage
  ) {

    this.context = { componentParent: this };
    this.objectKeys = Object.getOwnPropertyNames(new Ticket());
    this.createColumnDefs();
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      minWidth: 110,
      hide: false
    };
    this.storage.get('TicketsPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = (myArray).concat(['actions']);
        this.createColumnDefs();
      }
    });
    console.log("Ticket Constructor called")
  }

  async ngOnInit() {
    this.alive = true;
    while (!this.objectService.isInitialized()) {
      await new Promise(f => setTimeout(f, 1000));
    }
    if (this.authService.isMD()) {
      this.rowData = this.objectService.allObjects['ticket'];
    }
    console.log("Ticket ngOnInit called")
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {
    this.ticketStatus = interval(60000).pipe(takeWhile(() => this.alive)).subscribe((func => {
      this.objectService.getAllObject('ticket');
      if (this.authService.isMD()) {
        this.rowData = this.objectService.allObjects['ticket'];
      }
    }))
  }

  createColumnDefs() {
    this.columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['cellStyle'] = params => params.data.ticketStatus == "N" ? { 'background-color': 'red' } :
        params.data.ticketStatus == "R" ? { 'background-color': 'orange' } : { 'background-color': 'green' }
      switch (key) {
        case 'cephalixInstituteId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('institute', params.data.cephalixInstituteId);
          }
          break;
        }
        case 'ownerId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('user', params.data.ownerId);
          }
          break;
        }
        case 'recDate': {
          col['sort'] = 'desc',
            col['cellRendererFramework'] = DateCellRenderer;
          col['width'] = 80
          break;
        }
        case 'ticketStatus': {
          col['width'] = 50
          break;
        }
        case 'id': {
          col['width'] = 70
          break;
        }
      }
      this.columnDefs.push(col);
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.addEventListener('rowClicked', this.ticketClickHandle);
  }

  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    if (this.authService.isMD()) {
      this.rowData = [];
      for (let obj of this.objectService.allObjects['ticket'].sort(this.objectService.sortByRecDate)) {
        if (
          obj.title.toLowerCase().indexOf(filter) != -1 ||
          (obj.email && obj.email.toLowerCase().indexOf(filter) != -1) ||
          (obj.firstname && obj.firstname.toLowerCase().indexOf(filter) != -1) ||
          (obj.lastname && obj.lastname.toLowerCase().indexOf(filter) != -1)
        ) {
          this.rowData.push(obj)
        }
      }
    } else {
      this.gridApi.setQuickFilter(filter);
      this.gridApi.doLayout();
    }
  }

  ticketClickHandle(event) {
    console.log(event)
    event.context.componentParent.route.navigate(['/pages/cephalix/tickets/' + event.data.id])
  }
  public redirectToDelete = (ticket: Ticket) => {
    this.objectService.deleteObjectDialog(ticket, 'ticket', '/pages/cephalix/tickets')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any, objId: number) {
    let selected = this.gridApi.getSelectedRows();
    if (selected.length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    this.objectKeys = [];
    if (objId) {
      this.objectIds.push(objId);
    } else {
      for (let i = 0; i < selected.length; i++) {
        this.objectIds.push(selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "ticket",
        objectIds: this.objectIds,
        selection: selected,
        gridApi: this.gridApi
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ticket: Ticket) {
    if (ticket) {
      this.route.navigate(['/pages/cephalix/tickets/' + ticket.id]);
    } else {
      ticket = new Ticket();
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "ticket",
          objectAction: "add",
          object: new Ticket(),
          objectKeys: this.objectKeys
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

  /**
  * Function to Select the columns to show
  * @param ev
  */
  async openCollums(ev: any) {
    const modal = await this.modalCtrl.create({
      component: SelectColumnsComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns,
        objectPath: "TicketsPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = (dataReturned.data).concat(['actions']);
        this.createColumnDefs();
      }
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
