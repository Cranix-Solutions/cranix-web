import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';

//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { SoftwareService } from 'src/app/services/softwares.service'
import { Installation, Category } from 'src/app/shared/models/data-model';
import { EditInstallationSetComponent } from 'src/app/protected/cranix/softwares/edit-set/edit-installation-set.component';

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
  installationSetApi;
  installationSetColumnApi;
  installationSetSelection: Installation[] = [];
  installationSetData: Installation[] = [];
  autoGroupColumnDef;
  institute;

  constructor(
    public authService: AuthenticationService,
    public modalCtrl: ModalController,
    public router: Router,
    public softwareService: SoftwareService,
    private languageS: LanguageService
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
    this.readMembers();
    this.softwareService.readInstallableSoftwares();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  installationSetReady(params) {
    this.installationSetApi = params.api;
    this.installationSetColumnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("installationSetTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
  }

  onMemberSelectionChanged() {
    this.installationSetSelection = this.installationSetApi.getSelectedRows();
  }

  setFilterChanged() {
    this.installationSetApi.setQuickFilter((<HTMLInputElement>document.getElementById("installationSetFilter")).value);
    this.installationSetApi.doLayout();
  }

  onResize(ev: Event) {
    (<HTMLInputElement>document.getElementById("installationSetTable")).style.height = Math.trunc(window.innerHeight * 0.70) + "px";
    //this.sizeAll();
  }
  sizeAll() {
    var allColumnIds = [];
    this.installationSetColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.installationSetColumnApi.autoSizeColumns(allColumnIds);
  }
  readMembers() {
    let subM = this.softwareService.getInstallationsSets().subscribe(
      (val) => {
        this.installationSetData = val;
        this.authService.log("installationSets")
        this.authService.log(val);
      },
      (err) => { this.authService.log(err) },
      () => { subM.unsubscribe() });
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
        cellRendererFramework: EditBTNRenderer
      },
      {
        field: 'description',
        headerName: this.languageS.trans('description'),
      },
      {
        field: 'softwares',
        suppressMenu: true,
        headerName: this.languageS.trans('softwares'),
        valueGetter: function (params) {
          return params.data.softwareIds.length;
        }
      },
      {
        field: 'hwconfs',
        suppressMenu: true,
        headerName: this.languageS.trans('hwconfs'),
        valueGetter: function (params) {
          return params.data.hwconfIds.length;
        }
      },
      {
        field: 'rooms',
        suppressMenu: true,
        headerName: this.languageS.trans('rooms'),
        valueGetter: function (params) {
          return params.data.roomIds.length;
        }
      },
      {
        field: 'devices',
        suppressMenu: true,
        headerName: this.languageS.trans('devices'),
        valueGetter: function (params) {
          return params.data.deviceIds.length;
        }
      }
    ];
  }
  async redirectToEdit(event, installation: Category) {
    let action = "add"
    if (installation) {
      this.softwareService.selectedInstallationSet = installation;
      action = "modify";
    } else {
      this.softwareService.selectedInstallationSet = null;
    }
    const modal = await this.modalCtrl.create({
      component: EditInstallationSetComponent,
      componentProps: {
        objectAction: action,
        installation: installation
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.readMembers();
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  writeConfig() {
    //TODO
  }
  applyState() {
    //TODO
  }
}
