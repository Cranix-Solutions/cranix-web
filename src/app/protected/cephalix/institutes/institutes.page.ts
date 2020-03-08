import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

// own modules
import { Institute } from 'src/app/shared/models/cephalix-data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';
import { GenericObjectService } from '../../../services/generic-object.service';

@Component({
  selector: 'cranix-institutes',
  templateUrl: './institutes.page.html',
  styleUrls: ['./institutes.page.scss'],
})
export class InstitutesPage implements OnInit {

  displayedColumns: string[] = ['select', 'uuid', 'name', 'locality', 'ipVPN', 'regCode', 'validity', 'actions'];
  objectKeys: string[] = [];
  dataSource: MatTableDataSource<Institute>;
  selection = new SelectionModel<Institute>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private storage: Storage,
    public translateService: TranslateService
  ) {
    this.objectKeys = Object.getOwnPropertyNames(new Institute());
    this.storage.get('InstitutesPage.displayedColumns').then((val) => {
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
    this.objectService.getObjects('institute')
    .subscribe(obj => this.dataSource = new MatTableDataSource<Institute>(obj));
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
        objectPath: "InstitutesPage.displayedColumns"
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

  public redirectToDelete = (institute: Institute) => {
    console.log("Delete:" + institute.uuid)
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async openActions(ev: any) {
    for (let i = 0; i < this.selection.selected.length; i++) {
      this.objectIds.push(this.selection.selected[i].id);
    }
    console.log("openActions" + this.objectIds);

    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "institute",
        objectIds: this.objectIds,
        selection: this.selection.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, institute: Institute) {
    let action = 'modify';
    if (institute == null) {
      institute = new Institute();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "institute",
        objectAction: action,
        object: institute
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
  }
}
