import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel, isDataSource } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//own modules
import { HwconfsService } from 'src/app/services/hwconfs.service';
import { Hwconf } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';

@Component({
  selector: 'cranix-hwconfs',
  templateUrl: './hwconfs.page.html',
  styleUrls: ['./hwconfs.page.scss'],
})
export class HwconfsPage implements OnInit {

  allSelected: boolean = false;
  displayedColumns: string[] = ['select', 'name', 'mac', 'ip', 'hwconfId','actions'];
  objectKeys:  string[]  = [];
  dataSource: MatTableDataSource<Hwconf>;
  selection = new SelectionModel<Hwconf>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private hwconfS: HwconfsService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private storage: Storage,
    public translateService: TranslateService
  ) {
    this.objectKeys = Object.getOwnPropertyNames( new Hwconf() );
      this.storage.get('HwconfsPage.displayedColumns').then((val) => {
      let myArray  = JSON.parse(val);
      if(myArray  ) {
        this.displayedColumns = ['select'].concat(myArray);
        this.displayedColumns.push('actions');
      }
    });
  }

  ngOnInit() {
    this.hwconfS.getAllHwconfs().subscribe((res) => {
      this.dataSource = new MatTableDataSource<Hwconf>(res)
    },
      (err) => { },
      () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
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
        objectPath: "HwconfsPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
         this.displayedColumns =  ['select'].concat(dataReturned.data).concat(['actions']);
      }
    });
    (await modal).present().then((val) => {
    })
  }
  
  async redirectToEdit(ev: Event, hwconf: Hwconf) {
    let action = 'modify';
    if( hwconf == null ){
      hwconf = new Hwconf();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "hwconf",
        objectAction: action,
        object: hwconf
      },
      swipeToClose: true,
      animated: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
          this.ngOnInit();
      }
    });
    (await modal).present();
  }

  public redirectToDelete = (hwconf: Hwconf) => {
    console.log("Delete:" + hwconf.name)
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
        objectType: "hwconf",
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
