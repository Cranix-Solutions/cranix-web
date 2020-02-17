import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel, isDataSource } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
//own modules
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'cranix-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  allSelected: boolean = false;
  displayedColumns: string[] = ['select', 'uid', 'surName', 'givenName', 'role', 'actions'];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    userS: UsersService,
    public translateService: TranslateService,
    public popoverCtrl: PopoverController
  ) {
    userS.getUsers().subscribe((res) => {
      this.dataSource = new MatTableDataSource<User>(res)
    },
      (err) => { },
      () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnInit() {
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
  public redirectToEdit = (user: User) => {
    console.log("Edit:" + user.uid)
  }


  public redirectToDelete = (user: User) => {
    console.log("Delete:" + user.uid)
  }

  /**
   * Open the actions menu with the selected object ids.
   * @param ev 
   */
async openActions(ev: any) {
  for (let i = 0; i <  this.selection.selected.length; i++) {
    this.objectIds.push(this.selection.selected[i].id);
  }
  const popover = await  this.popoverCtrl.create({
    component: ActionsComponent,
    event: ev,
    componentProps: {
      objectType:  "user",
       objectIds: this.objectIds
    },
    animated: true,
    showBackdrop: true
});
  (await popover).present();
}
}
