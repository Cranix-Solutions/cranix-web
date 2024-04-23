import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';


//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Ticket } from 'src/app/shared/models/cephalix-data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { CephalixService } from 'src/app/services/cephalix.service';
import { SupportRequest } from 'src/app/shared/models/data-model';
import { CreateSupport } from 'src/app/shared/actions/create-support/create-support-page';

@Component({
  selector: 'cranix-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['id', 'title', 'cephalixInstituteId', 'modified', 'created', 'creatorId', 'ticketStatus'];
  columnDefs = [];
  defaultColDef = {};
  columnApi: ColumnApi;
  gridApi: GridApi;
  context;
  title = 'app';
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
  supportRequest: SupportRequest

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
      minWidth: 150,
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
    /* Do not refresh tickets
      this.ticketStatus = interval(60000).pipe(takeWhile(() => this.alive)).subscribe((func => {
      this.objectService.getAllObject('ticket');
      if (this.authService.isMD()) {
        this.rowData = this.objectService.allObjects['ticket'];
      }
    }))
    */
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
            var institute = params.context['componentParent'].objectService.getObjectById('institute', params.data.cephalixInstituteId)
            if (institute) {
              return institute.name + " " + institute.locality
            } else {
              return ""
            }
          }
          break;
        }
        case 'creatorId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('user', params.data.creatorId);
          }
          col['maxWidth'] = 200
          break;
        }
        case 'modified': {
          col['sort'] = 'desc',
          col['cellRenderer'] = DateTimeCellRenderer;
          col['minWidth'] = 180
          col['maxWidth'] = 180
          break;
        }
        case 'created': {
          col['cellRenderer'] = DateTimeCellRenderer;
          col['minWidth'] = 180
          col['maxWidth'] = 180
          break;
        }
        case 'ticketStatus': {
          col['minWidth'] = 40
          col['maxWidth'] = 50
          break;
        }
        case 'id': {
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['maxWidth'] = 150
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
    //this.gridApi.addEventListener('rowClicked', this.ticketClickHandle);
  }

  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    if (this.authService.isMD()) {
      this.rowData = [];
      for (let obj of this.objectService.allObjects['ticket'].sort(this.objectService.sortByCreated)) {
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
      this.gridApi.setGridOption('quickFilterText', filter);
    }
  }

  ticketClickHandle(event) {
    //console.log(event)
    if (event.column.colId != 'id') {
      event.context.componentParent.route.navigate(['/pages/cephalix/tickets/' + event.data.id])
    }
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
    var objectIds: number[] = [];
    if (selected.length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    this.objectKeys = [];
    if (objId) {
      objectIds.push(objId);
    } else {
      for (let i = 0; i < selected.length; i++) {
        objectIds.push(selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "ticket",
        objectIds: objectIds,
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
      var mySupport = new SupportRequest();
      mySupport.lastname = this.authService.session.fullName.replace("(","").replace(")","")
      const modal = await this.modalCtrl.create({
        component: CreateSupport,
        cssClass: 'big-modal',
        componentProps: {
          support: mySupport,
        },
        animated: true,
        showBackdrop: true
      });
      modal.onDidDismiss().then((dataReturned) => {
        this.reloadAllObjects();
        if (dataReturned.data) {
          delete dataReturned.data.subject;
          delete dataReturned.data.text;
          console.log("Object was created or modified", dataReturned.data);
          this.storage.set('System.Status.mySupport', JSON.stringify(dataReturned.data));
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
  reloadAllObjects() {
    this.objectService.okMessage(this.languageS.trans("Reloading all tickets"))
    this.objectService.getAllObject('ticket')
    if (this.authService.isMD()) {
      this.rowData = this.objectService.allObjects['ticket'];
      (<HTMLInputElement>document.getElementById('ticketsFilterMD')).value = ""
    }
  }
}
