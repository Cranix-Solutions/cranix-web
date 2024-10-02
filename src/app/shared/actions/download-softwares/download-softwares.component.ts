import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { GridApi } from 'ag-grid-community';
//Own stuff
import { SoftwareService } from 'src/app/services/softwares.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Package } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-download-softwares',
  templateUrl: './download-softwares.component.html',
  styleUrls: ['./download-softwares.component.scss'],
})
export class DownloadSoftwaresComponent implements OnInit {
  gridApi: GridApi;
  columns: any[] = [];
  context;
  selected: Package[];
  title = 'app';
  packages: Package[] = [];
  constructor(
    public authService: AuthenticationService,
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
  }

  packagFilterChanged() {
    this.gridApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("packageFilter")).value);
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
          this.objectService.responseMessage(val);
          if( val.code == "OK") {
            this.closeWindow();
          }
        },
        (err) => { this.objectService.errorMessage(err)},
        () => { subs.unsubscribe()}
      )
    }
  }
}
