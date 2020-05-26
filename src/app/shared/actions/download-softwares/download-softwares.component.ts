import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
//Own stuff
import { SoftwareService } from 'src/app/services/softwares.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Package } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'cranix-download-softwares',
  templateUrl: './download-softwares.component.html',
  styleUrls: ['./download-softwares.component.scss'],
})
export class DownloadSoftwaresComponent implements OnInit {
  gridApi: GridApi;
  columnApi: ColumnApi;
  columns: any[] = [];
  context;
  selected: Package[];
  title = 'app';
  packages: Package[] = [];
  constructor(
    public objectService: GenericObjectService,
    private softwareService: SoftwareService,
    public modalController: ModalController,
    private languageS: LanguageService,
    public toastController: ToastController
  ) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.columns = [{
      field: 'name',
      headerName: this.languageS.trans('name'),
    }, {
      field: 'version',
      headerName: this.languageS.trans('version'),
    }];
  }
  tableReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  packagFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("packageFilter")).value);
    this.gridApi.doLayout();
  }
  closeWindow() {
    this.modalController.dismiss();
  }
  async startDownload() {
    ;
    let selected = this.gridApi.getSelectedRows();
    console.log(selected)
    if (selected.length == 0) {
      console.log('not selected')
       this.objectService.selectObject();
      return;
    } else {
      let toDownload: string[] = [];
      for( let p of selected ) {
        toDownload.push(p.name);
      }
      let subs = this.softwareService.downloadSoftwares(toDownload).subscribe(
        (val) =>{  
          let resp: ServerResponse = val;
          if( resp.code == "OK") {
            this.objectService.okMessage(this.languageS.trans(resp.value));
            this.closeWindow();
          } else {
            this.objectService.errorMessage(this.languageS.trans(resp.value));
          }
        },
        (err) => { this.objectService.errorMessage(err)},
        () => { subs.unsubscribe()}
      )
    }
  }
}
