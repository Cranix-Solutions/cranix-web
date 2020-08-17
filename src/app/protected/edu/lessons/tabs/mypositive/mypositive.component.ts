import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from '@ag-grid-enterprise/all-modules';

//Our Stuff
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { PositivList } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { EductaionService } from 'src/app/services/education.service';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-mypositive',
  templateUrl: './mypositive.component.html',
  styleUrls: ['./mypositive.component.scss'],
})
export class MypositiveComponent implements OnInit {

  rowData: any[];
  columnDefs = [];
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu: true
  };
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;

  constructor(
    public authService: AuthenticationService,
    public educationService: EductaionService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    this.context = { componentParent: this };
    this.createColumnDefs();
    this.readDatas();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();
  }

  createColumnDefs() {
    this.columnDefs = [];
    for (let key of Object.getOwnPropertyNames(new PositivList())) {
      let col = {};
      switch (key) {
        case 'id': {
          break;
        }
        case 'name': {
          col['field'] = key;
          col['headerName'] = this.languageS.trans(key);
          this.columnDefs.push(col);
          this.columnDefs.push({
            headerName: "",
            width: 200,
            suppressSizeToFit: true,
            cellStyle: { 'padding': '2px', 'line-height': '36px' },
            field: 'actions',
            cellRendererFramework: EditBTNRenderer
          });
          break;
        }
        default: {
          col['field'] = key;
          col['headerName'] = this.languageS.trans(key);
          this.columnDefs.push(col);
        }
      }
    }
  }

  /**
   * Read the owned positive list.
   */
  readDatas() {
    let subs = this.educationService.getMyPositivLists().subscribe(
      (val) => { this.rowData = val },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }

  /**
   * Add or edit positive list
   * @param ev 
   * @param positivList 
   */
  async redirectToEdit(ev: Event, positivList: PositivList) {
    let action = 'modify';
    if (!positivList) {
      positivList = new PositivList();
      delete positivList.id;
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "education/proxy/positiveList",
        objectAction: action,
        object: positivList
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  /**
   * Activate the selected positive lists in the selected room
   * @param ev 
   */
  activate(ev: Event){
    let ids: number[] = [];
    for( let obj of this.gridApi.getSelectedRows() ) {
      ids.push(obj.id);
    }
    this.objectService.requestSent();
    let subs = this.educationService.activatePositivListInRoom(this.educationService.selectedRoomId,ids).subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => { this.objectService.errorMessage(err) },
      () => { subs.unsubscribe() }
    )
  }

  /**
   * Deactivate the selected positive lists in the selected room
   * @param ev 
   */
  deactivate(ev: Event){
    this.objectService.requestSent();
    let subs = this.educationService.deactivatePositivListInRoom(this.educationService.selectedRoomId).subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => { this.objectService.errorMessage(err) },
      () => { subs.unsubscribe() }
    )
  }
}
