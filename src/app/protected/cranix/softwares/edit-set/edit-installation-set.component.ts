import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Software, Hwconf, Room, Device, Category, Installation } from 'src/app/shared/models/data-model';
import { SoftwareService } from 'src/app/services/softwares.service';
@Component({
  selector: 'cranix-edit-installation-set',
  templateUrl: './edit-installation-set.component.html',
  styleUrls: ['./edit-installation-set.component.scss'],
})
export class EditInstallationSetComponent implements OnInit {

  submitted: boolean = false;
  context;
  installationSet: Category = new Category();
  softwares: Software[] = [];
  softwaresApi;
  availableSoftwaresApi;
  hwconfs: Hwconf[] = [];
  hwconfsApi;
  availableHwconfs: Hwconf[] = [];
  availableHwconfsApi;
  rooms: Room[] = [];
  roomsApi;
  availableRooms: Room[] = [];
  availableRoomsApi;
  devices: Device[] = [];
  devicesApi;
  availableDevices: Device[] = [];
  availableDevicesApi;
  toShow = "overview";
  deviceColumnDefs = [];
  hwconfColumnDefs = [];
  softwareColumnDefs = [];
  roomColumnDefs = [];

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private modalCtrl: ModalController,
    public softwareService: SoftwareService
  ) {
    this.deviceColumnDefs = [
      {
        headerName: this.languageS.trans('devices'),
        field: 'name',
        sortable: true
      }];
    this.hwconfColumnDefs = [
      {
        headerName: this.languageS.trans('hwconfs'),
        field: 'name',
        sortable: true
      }];

    this.roomColumnDefs = [
      {
        headerName: this.languageS.trans('rooms'),
        field: 'name',
        sortable: true
      }];
    this.softwareColumnDefs = [
      {
        headerName: this.languageS.trans('softwares'),
        field: 'name',
        sortable: true
      }];
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.submitted = false;

    for (let tmp of this.objectService.allObjects['hwconf']) {
      if (tmp.deviceType == 'FatClient') {
        this.availableHwconfs.push(tmp);
      }
    }
    this.availableRooms = this.objectService.allObjects['room'];
    for (let tmp of this.objectService.allObjects['device']) {
      let tmpHwconf = this.objectService.getObjectById('hwconf', tmp.hwconfId);
      if (tmpHwconf && tmpHwconf.deviceType == 'FatClient') {
        this.availableDevices.push(tmp);
      }
    }
    //Now we edit an installation set. Let's read it!
    if (this.softwareService.selectedInstallationSet) {
      for (let id of this.softwareService.selectedInstallationSet.softwareIds) {
        for (let sw of this.softwareService.availableSoftwares) {
          if (sw.id == id) {
            this.softwares.push(sw);
          }
        }
      }
      this.installationSet = this.softwareService.selectedInstallationSet;
      for (let id of this.installationSet.hwconfIds) {
        this.hwconfs.push(this.objectService.getObjectById('hwconf', id));
      }
      for (let id of this.installationSet.roomIds) {
        this.rooms.push(this.objectService.getObjectById('room', id));
      }
      for (let id of this.installationSet.deviceIds) {
        this.devices.push(this.objectService.getObjectById('device', id));
      }
    }
  }
  public ngAfterViewInit() {
    (<HTMLInputElement>document.getElementById("editSoftware")).style.height = Math.trunc(window.innerHeight * 0.90) + "px";
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  segmentChanged(event) {
    this.toShow = event.detail.value;
  }
  /**Available Softwares */
  availableSoftwaresReady(params) {
    this.availableSoftwaresApi = params.api;
    this.availableSoftwaresApi.forEachNode(
      function (node, index) {
        console.log(node)
        for (let obj of node.beans.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.softwares) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("availableSoftwaresTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
    this.availableSoftwaresApi.sizeColumnsToFit();
  }
  availableSoftwaresChanged() {
    this.softwares = this.availableSoftwaresApi.getSelectedRows();
  }
  availableSoftwaresFilterChanged() {
    this.availableSoftwaresApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("availableSoftwaresFilter")).value);
  }

  /**Available Hwconfs */
  availableHwconfsReady(params) {
    this.availableHwconfsApi = params.api;
    this.availableHwconfsApi.forEachNode(
      function (node, index) {
        for (let obj of node.beans.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.hwconfs) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("availableHwconfsTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
    this.availableHwconfsApi.sizeColumnsToFit();
  }
  availableHwconfsChanged() {
    this.hwconfs = this.availableHwconfsApi.getSelectedRows();
  }
  availableHwconfsFilterChanged() {
    this.availableHwconfsApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("availableHwconfsFilter")).value);
  }

  /**Available Rooms */
  availableRoomsReady(params) {
    this.availableRoomsApi = params.api;
    this.availableRoomsApi.forEachNode(
      function (node, index) {
        for (let obj of node.beans.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.rooms) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("availableRoomsTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
    this.availableRoomsApi.sizeColumnsToFit();
  }
  availableRoomsChanged() {
    this.rooms = this.availableRoomsApi.getSelectedRows();
  }
  availableRoomsFilterChanged() {
    this.availableRoomsApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("availableRoomsFilter")).value);
  }

  /**Available Devices */
  availableDevicesReady(params) {
    this.availableDevicesApi = params.api;
    this.availableDevicesApi.forEachNode(
      function (node, index) {
        for (let obj of node.beans.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.devices) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    this.availableDevicesApi.sizeColumnsToFit();
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("availableDevicesTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
  }
  availableDevicesChanged() {
    this.devices = this.availableDevicesApi.getSelectedRows();
  }
  availableDevicesFilterChanged() {
    this.availableDevicesApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("availableDevicesFilter")).value);
  }

  /**Available Softwares */
  softwaresReady(params) {
    this.softwaresApi = params.api;
    this.softwaresApi.sizeColumnsToFit();
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("softwaresTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
  }
  softwaresChanged() {
    this.softwares = this.softwaresApi.getSelectedRows();
  }
  softwaresFilterChanged() {
    this.softwaresApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("softwaresFilter")).value);
  }

  /**Available Hwconfs */
  hwconfsReady(params) {
    this.hwconfsApi = params.api;
    this.hwconfsApi.sizeColumnsToFit();
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("hwconfsTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
  }
  hwconfsChanged() {
    this.hwconfs = this.hwconfsApi.getSelectedRows();
  }
  hwconfsFilterChanged() {
    this.hwconfsApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("hwconfsFilter")).value);
  }

  /**Available Rooms */
  roomsReady(params) {
    this.roomsApi = params.api;
    this.roomsApi.sizeColumnsToFit();
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("roomsTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
  }
  roomsChanged() {
    this.rooms = this.roomsApi.getSelectedRows();
  }
  roomsFilterChanged() {
    this.roomsApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("roomsFilter")).value);
  }

  /**Available Devices */
  devicesReady(params) {
    this.devicesApi = params.api;
    this.devicesApi.sizeColumnsToFit();
    if (!this.authService.isMD()) {
      (<HTMLInputElement>document.getElementById("devicesTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    }
  }
  devicesChanged() {
    this.devices = this.devicesApi.getSelectedRows();
  }
  devicesFilterChanged() {
    this.devicesApi.setGridOption('quickFilterText', (<HTMLInputElement>document.getElementById("devicesFilter")).value);
  }
  closeWindow() {
    this.modalCtrl.dismiss();
  }

  delete() {
    this.objectService.deleteObjectDialog(this.softwareService.selectedInstallationSet, "categorie", '');
  }

  onSubmit() {
    this.submitted = true;
    this.installationSet.deviceIds = [];
    for (let dev of this.devices) {
      this.installationSet.deviceIds.push(dev.id)
    }
    this.installationSet.roomIds = [];
    for (let room of this.rooms) {
      this.installationSet.roomIds.push(room.id)
    }
    this.installationSet.hwconfIds = [];
    for (let hwconf of this.hwconfs) {
      this.installationSet.hwconfIds.push(hwconf.id)
    }
    this.installationSet.softwareIds = [];
    for (let software of this.softwares) {
      this.installationSet.softwareIds.push(software.id)
    }
    this.objectService.requestSent();
    if (this.softwareService.selectedInstallationSet) {
      this.installationSet.id = this.softwareService.selectedInstallationSet.id;
    }
    console.log(this.installationSet)
    let subs = this.softwareService.addModifyInstallationsSets(this.installationSet).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss();
      },
      error: (err) => {
        this.objectService.errorMessage(err);
      },
      complete: () => {
        this.submitted = false;
        subs.unsubscribe();
      }
    })
  }
}
