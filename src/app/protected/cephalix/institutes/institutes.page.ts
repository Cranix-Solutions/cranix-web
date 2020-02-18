import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, ModalController } from '@ionic/angular';

import {CephalixService} from 'src/app/services/cephalix.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
@Component({
  selector: 'cranix-institutes',
  templateUrl: './institutes.page.html',
  styleUrls: ['./institutes.page.scss'],
})
export class InstitutesPage implements OnInit {

  displayedColumns: string[] = ['select', 'uuid', 'name', 'locality','ipVPN', 'regCode','actions'];
  dataSource:  MatTableDataSource<Institute> ;
  selection = new SelectionModel<Institute>(true, []);
  objectIds: number[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    cephalixS: CephalixService,
    public translateService: TranslateService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) {
   // this.translateService.setDefaultLang('de');
   console.log('Trans in institutes', this.translateService.translations);
    cephalixS.getAllInstitutes().subscribe(
      (res) => {
      this.dataSource = new MatTableDataSource<Institute>(res)
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
  
  public redirectToDelete = (institute: Institute)  => {
    console.log("Delete:" + institute.uuid)
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
      objectType:  "institute",
       objectIds: this.objectIds
    },
    animated: true,
    showBackdrop: true
});
  (await popover).present();
}
async redirectToEdit(ev: Event, institute: Institute){
  const modal = await  this.modalCtrl.create({
    component: ObjectsEditComponent,
    componentProps: {
      objectType:  "institute",
      objectAction:  "modify",
      object: institute
    },
    animated: true,
    showBackdrop: true
});
  (await modal).present();
}

async redirectToAdd(ev: Event){
  const modal = await  this.modalCtrl.create({
    component: ObjectsEditComponent,
    componentProps: {
      objectType:  "group",
      objectAction:  "add",
      object: new Institute()
    },
    animated: true,
    showBackdrop: true
});
  (await modal).present();
}
}
