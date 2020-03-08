import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

// own modules
import { GenericObjectService } from '../../../services/generic-object.service'
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';
import { Ticket } from '../../../shared/models/cephalix-data-model';
import { Router } from '@angular/router';
@Component({
  selector: 'cranix-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  displayedColumns: string[] = ['select', 'title', 'recDate', 'status', 'cephalixInstituteId', 'actions'];
  objectKeys: string[] = [];
  dataSource: MatTableDataSource<Ticket>;
  selection = new SelectionModel<Ticket>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    private objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private route: Router,
    private storage: Storage,
    public translateService: TranslateService
  ) {
    this.objectKeys = Object.getOwnPropertyNames(new Ticket());
    this.storage.get('TicketsPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = ['select'].concat(myArray).concat(['actions']);
      }
    });
  }

  ngOnInit() {
      this.getObjects();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  getObjects(){
    this.objectService.getObjects('ticket')
    .subscribe(obj => this.dataSource = new MatTableDataSource<Ticket>(obj));
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
        objectPath: "TicketsPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = ['select'].concat(dataReturned.data).concat(['actions']);
      }
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }

  async redirectToEdit(ev: Event, object: Ticket) {
    if (object == null) {
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "ticket",
          objectAction: "add",
          object: new Ticket()
        },
        animated: true,
        swipeToClose: true,
        showBackdrop: true
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned.data) {
          this.ngOnInit();
        }
      });
      (await modal).present();
    } else {
      this.route.navigate(['/pages/cephalix/tickets/' + object.id]);
    }
  }
}
