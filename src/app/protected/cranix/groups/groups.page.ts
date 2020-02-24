import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';

//Own modules
import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'description', 'groupType','actions'];
  dataSource: MatTableDataSource<Group>;
  selection = new SelectionModel<Group>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    groupS: GroupsService,
    public translateService: TranslateService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) {
    this.translateService.setDefaultLang('de');
    groupS.getGroups().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<Group>(res)
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
  public redirectToMember= (group: Group) => {
    console.log("Details:" + group.name)
  }

  public redirectToDelete = (group: Group)=> {
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
         objectIds: this.objectIds
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
    (await modal).present();
  }

}
