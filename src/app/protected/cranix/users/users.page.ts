import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel, isDataSource } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//own modules
import { UsersService } from '../../../services/users.service';
import { User } from '../../../shared/models/data-model';
import { ActionsComponent } from '../../../shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';
import { GenericObjectService } from '../../../services/generic-object.service';

@Component({
  selector: 'cranix-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  allSelected: boolean = false;
  displayedColumns: string[] = ['select', 'uid', 'surName', 'givenName', 'role', 'actions'];
  objectKeys: string[] = [];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(

    private userS: UsersService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private storage: Storage,
    public translateService: TranslateService,
    private objectService: GenericObjectService
  ) {
    this.objectKeys = Object.getOwnPropertyNames(new User());
    this.storage.get('UsersPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = ['select'].concat(myArray);
        this.displayedColumns.push('actions');
      }
    });
    this.objectService.usersModified.subscribe((status) => {
      if(status) { this.ngOnInit() }
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.objectService.allObjects['user']);
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
        objectPath: "UsersPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: false,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = ['select'].concat(dataReturned.data).concat(['actions']);
      }
    });
    (await modal).present().then((val) => {
    })
  }

  async redirectToEdit(ev: Event, user: User) {
    let action = 'modify';
    if (user == null) {
      user = new User();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "user",
        objectAction: action,
        object: user
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

  async redirectToDelete(user: User) {
    this.objectService.deleteObjectDialog(user, "user");
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
        objectType: "user",
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
