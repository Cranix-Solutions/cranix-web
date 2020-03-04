import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel, isDataSource } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//own modules
import { GenericObjectService } from '../../../services/generic-object.service';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';

@Component({
  selector: 'cranix-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {

  allSelected: boolean = false;
  displayedColumns: string[] = ['select', 'name', 'mac', 'ip', 'hwconfId','actions'];
  objectKeys:  string[]  = [];
  dataSource: MatTableDataSource<Device>;
  selection = new SelectionModel<Device>(true, []);
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
    this.objectKeys = Object.getOwnPropertyNames( new Device() );
      this.storage.get('DevicesPage.displayedColumns').then((val) => {
      let myArray  = JSON.parse(val);
      if(myArray  ) {
        this.displayedColumns = ['select'].concat(myArray);
        this.displayedColumns.push('actions');
      }
    });
    this.objectService.modified['device'].subscribe((status) => {
      if(status) { this.ngOnInit() }
    });
  }

  ngOnInit() {
      this.dataSource = new MatTableDataSource<Device>(this.objectService.allObjects['device']);
      this.dataSource.sort = this.sort;
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
        columns: this.objectKeys ,
        selected: this.displayedColumns,
        objectPath: "DevicesPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
         this.displayedColumns =  ['select'].concat(dataReturned.data).concat(['actions']);
      }
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }
  async redirectToEdit(ev: Event, device: Device) {
    let action = 'modify';
    if( device == null ){
      device = new Device();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "device",
        objectAction: action,
        object: device
      },
      swipeToClose: true,
      animated: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
          this.ngOnInit();
      }
    });
    (await modal).present();
  }

  public redirectToDelete = (device: Device) => {
    console.log("Delete:" + device.name)
  }

  /**
   * Open the actions menu with the selected object ids.
   * @param ev 
   */
  async openActions(ev: any) {
    for (let i = 0; i < this.selection.selected.length; i++) {
      this.objectIds.push(this.selection.selected[i].id);
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "device",
        objectIds: this.objectIds,
        selection: this.selection.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  procesModal(ev: Event) {
    console.log(ev);
    this.modalCtrl.dismiss();
  }
}
