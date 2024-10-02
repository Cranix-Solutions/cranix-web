import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GridApi } from 'ag-grid-community';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { SoftwareService } from 'src/app/services/softwares.service'
import { Installation, Category } from 'src/app/shared/models/data-model';
import { EditInstallationSetComponent } from 'src/app/protected/cranix/softwares/edit-set/edit-installation-set.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-installation-sets',
  templateUrl: './installation-sets.component.html',
  styleUrls: ['./installation-sets.component.scss'],
})
export class InstallationSetsComponent implements OnInit {
  context;
  installationSetOptions;
  columnDefs = [];
  defaultColDef = {};
  installationSetApi: GridApi;
  installationSetSelection: Installation[] = [];
  autoGroupColumnDef;
  institute;

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public router: Router,
    public softwareService: SoftwareService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false
    };
  }
  ngOnInit() {
    this.createColumnDefs();
    this.softwareService.readInstallationsSets();
    this.softwareService.readInstallableSoftwares();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  installationSetReady(params) {
    this.installationSetApi = params.api;
    this.installationSetApi.sizeColumnsToFit();
  }

  onMemberSelectionChanged() {
    this.installationSetSelection = this.installationSetApi.getSelectedRows();
  }

  setFilterChanged() {
    this.installationSetApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("installationSetFilter")).value);
  }
  
  createColumnDefs() {
    this.columnDefs = [
      {
        field: 'name',
        width: 200,
        pinned: 'left',
        headerName: this.languageS.trans('name')
      }, {
        headerName: "",
        width: 100,
        suppressSizeToFit: true,
        cellStyle: { 'padding': '2px', 'line-height': '36px' },
        field: 'actions',
        pinned: 'left',
        cellRenderer: EditBTNRenderer
      },
      {
        field: 'description',
        headerName: this.languageS.trans('description'),
      },
      {
        field: 'softwares',
        suppressHeaderMenuButton: true,
        headerName: this.languageS.trans('softwares'),
        valueGetter: function (params) {
          return params.data.softwareIds.length;
        }
      },
      {
        field: 'hwconfs',
        suppressHeaderMenuButton: true,
        headerName: this.languageS.trans('hwconfs'),
        valueGetter: function (params) {
          return params.data.hwconfIds.length;
        }
      },
      {
        field: 'rooms',
        suppressHeaderMenuButton: true,
        headerName: this.languageS.trans('rooms'),
        valueGetter: function (params) {
          return params.data.roomIds.length;
        }
      },
      {
        field: 'devices',
        suppressHeaderMenuButton: true,
        headerName: this.languageS.trans('devices'),
        valueGetter: function (params) {
          return params.data.deviceIds.length;
        }
      }
    ];
  }
  async redirectToEdit(installation: Category) {
    let action = "add"
    if (installation) {
      this.softwareService.selectedInstallationSet = installation;
      action = "modify";
    } else {
      this.softwareService.selectedInstallationSet = null;
    }
    const modal = await this.modalCtrl.create({
      component: EditInstallationSetComponent,
      cssClass: 'big-modal',
      componentProps: {
        objectAction: action
      },
      animated: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.softwareService.readInstallationsSets()
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  writeConfig() {
    let sub = this.softwareService.writeStateFiles().subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe()}
    )
  }
  applyState() {
    let sub = this.softwareService.applyState().subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe()}
    )
  }
  redirectToDelete(installation: Category) {
    this.softwareService.deleteInstallationsSet(installation);
  }
}
