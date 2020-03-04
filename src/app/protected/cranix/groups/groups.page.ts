import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//Own modules
import {GenericObjectService } from '../../../services/generic-object.service';
import { Group } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'description', 'groupType','actions'];
  objectKeys:  string[]  = [];
  dataSource: MatTableDataSource<Group>;
  selection = new SelectionModel<Group>(true, []);
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
    this.objectKeys = Object.getOwnPropertyNames( new Group() );
      this.storage.get('GroupsPage.displayedColumns').then((val) => {
      let myArray  = JSON.parse(val);
      if(myArray  ) {
        this.displayedColumns = ['select'].concat(myArray);
        this.displayedColumns.push('actions');
      }
    });
    this.objectService.modified['group'].subscribe((status) => {
      if(status) { this.ngOnInit() }
    });
  }

  ngOnInit() {
      this.dataSource = new MatTableDataSource<Group>(this.objectService.allObjects['group']);
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
        objectPath: "GroupsPage.displayedColumns"
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
    })
  }
  public redirectToMember= (group: Group) => {
    console.log("Details:" + group.name)
  }

  public redirectToDelete = (group: Group)=> {
    this.objectService.deleteObjectDialog(group,"group");
    console.log("Delete:" + group.name)
  }
    /**
   * Open the actions menu with the selected object ids.
   * @param ev
   */
  async openActions(ev: any) {
    for (let i = 0; i <  this.selection.selected.length; i++) {
      this.objectIds.push(this.selection.selected[i].id);
    }
    console.log("openActions"  + this.objectIds);

    const popover = await  this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType:  "group",
         objectIds: this.objectIds,
         selection: this.selection.selected
      },
      animated: true,
      showBackdrop: true
  });
    (await popover).present();
  }

  async redirectToEdit(ev: Event, group: Group){
    let action = 'modify';
    if( group == null ){
      group = new Group();
      action = 'add';
    }
    const modal = await  this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType:  "group",
        objectAction: action,
        object: group
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

}
