import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Software, Hwconf, Room, Device, Category } from 'src/app/shared/models/data-model';
import { SoftwareService } from 'src/app/services/softwares.service';
@Component({
  selector: 'cranix-edit-installation-set',
  templateUrl: './edit-installation-set.component.html',
  styleUrls: ['./edit-installation-set.component.scss'],
})
export class EditInstallationSetComponent implements OnInit {

  context;
  installationSet: Category = new Category();
  softwares: Software[] = [];
  softwaresApi;
  availableSoftwares: Software[] = [];
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
    public languageService: LanguageService,
    private modalController: ModalController,
    public softwareService: SoftwareService
  ) {
    this.deviceColumnDefs = [
      {
        headerName: this.languageService.trans('devices'),
        field: 'name',
        sortable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      }];
    this.hwconfColumnDefs = [
      {
        headerName: this.languageService.trans('hwconfs'),
        field: 'name',
        sortable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      }];

    this.roomColumnDefs = [
      {
        headerName: this.languageService.trans('rooms'),
        field: 'name',
        sortable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      }];
    this.softwareColumnDefs = [
      {
        headerName: this.languageService.trans('softwares'),
        field: 'name',
        sortable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      }];
    this.context = { componentParent: this };
  }

  ngOnInit() {
    let sub = this.softwareService.getInstallableSoftwares().subscribe(
      (obj) => { this.availableSoftwares = obj },
      (err) => { console.log(err) },
      () => { sub.unsubscribe() }
    );
    this.objectService.getObjects('hwconf').subscribe(obj => {
      for (let tmp of obj) {
        console.log(tmp);
        if (tmp.deviceType == 'FatClient') {
          this.availableHwconfs.push(tmp);
        }
      }
    }
    );
    this.objectService.getObjects('room').subscribe(obj => this.availableRooms = obj);
    this.objectService.getObjects('device').subscribe(obj => this.availableDevices = obj);
    if (this.softwareService.selectedInstallationSet) {

    }
  }
  segmentChanged(event) {
    this.toShow = event.detail.value;
  }
  /**Available Softwares */
  availableSoftwaresReady(params) {
    this.availableSoftwaresApi = params.api;
    this.availableSoftwaresApi.forEachNode(
      function (node, index) {
        for (let obj of node.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.softwares) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    this.availableSoftwaresApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("availableSoftwaresTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  availableSoftwaresChanged() {
    this.softwares = this.availableSoftwaresApi.getSelectedRows();
  }
  availableSoftwaresFilterChanged() {
    this.availableSoftwaresApi.setQuickFilter((<HTMLInputElement>document.getElementById("availableSoftwaresFilter")).value);
    this.availableSoftwaresApi.doLayout();
  }

  /**Available Hwconfs */
  availableHwconfsReady(params) {
    this.availableHwconfsApi = params.api;
    this.availableHwconfsApi.forEachNode(
      function (node, index) {
        for (let obj of node.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.hwconfs) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    this.availableHwconfsApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("availableHwconfsTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  availableHwconfsChanged() {
    this.hwconfs = this.availableHwconfsApi.getSelectedRows();
  }
  availableHwconfsFilterChanged() {
    this.availableHwconfsApi.setQuickFilter((<HTMLInputElement>document.getElementById("availableHwconfsFilter")).value);
    this.availableHwconfsApi.doLayout();
  }

  /**Available Rooms */
  availableRoomsReady(params) {
    this.availableRoomsApi = params.api;
    this.availableRoomsApi.forEachNode(
      function (node, index) {
        for (let obj of node.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.rooms) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    this.availableRoomsApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("availableRoomsTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  availableRoomsChanged() {
    this.rooms = this.availableRoomsApi.getSelectedRows();
  }
  availableRoomsFilterChanged() {
    this.availableRoomsApi.setQuickFilter((<HTMLInputElement>document.getElementById("availableRoomsFilter")).value);
    this.availableRoomsApi.doLayout();
  }

  /**Available Devices */
  availableDevicesReady(params) {
    this.availableDevicesApi = params.api;
    this.availableDevicesApi.forEachNode(
      function (node, index) {
        for (let obj of node.context.contextParams.providedBeanInstances.gridOptions.context.componentParent.devices) {
          if (node.data.id == obj.id) {
            node.setSelected(true);
          }
        }
      }
    )
    this.availableDevicesApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("availableDevicesTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  availableDevicesChanged() {
    this.devices = this.availableDevicesApi.getSelectedRows();
  }
  availableDevicesFilterChanged() {
    this.availableDevicesApi.setQuickFilter((<HTMLInputElement>document.getElementById("availableDevicesFilter")).value);
    this.availableDevicesApi.doLayout();
  }

  /**Available Softwares */
  softwaresReady(params) {
    this.softwaresApi = params.api;
    this.softwaresApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("softwaresTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  softwaresChanged() {
    this.softwares = this.softwaresApi.getSelectedRows();
  }
  softwaresFilterChanged() {
    this.softwaresApi.setQuickFilter((<HTMLInputElement>document.getElementById("softwaresFilter")).value);
    this.availableSoftwaresApi.doLayout();
  }

  /**Available Hwconfs */
  hwconfsReady(params) {
    this.hwconfsApi = params.api;
    this.hwconfsApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("hwconfsTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  hwconfsChanged() {
    this.hwconfs = this.hwconfsApi.getSelectedRows();
  }
  hwconfsFilterChanged() {
    this.hwconfsApi.setQuickFilter((<HTMLInputElement>document.getElementById("hwconfsFilter")).value);
    this.hwconfsApi.doLayout();
  }

  /**Available Rooms */
  roomsReady(params) {
    this.roomsApi = params.api;
    this.roomsApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("roomsTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  roomsChanged() {
    this.rooms = this.roomsApi.getSelectedRows();
  }
  roomsFilterChanged() {
    this.roomsApi.setQuickFilter((<HTMLInputElement>document.getElementById("roomsFilter")).value);
    this.roomsApi.doLayout();
  }

  /**Available Devices */
  devicesReady(params) {
    this.devicesApi = params.api;
    this.devicesApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("devicesTable")).style.height = Math.trunc(window.innerHeight * 0.60) + "px";
  }
  devicesChanged() {
    this.devices = this.devicesApi.getSelectedRows();
  }
  devicesFilterChanged() {
    this.devicesApi.setQuickFilter((<HTMLInputElement>document.getElementById("devicesFilter")).value);
    this.devicesApi.doLayout();
  }
  closeWindow() {
    this.modalController.dismiss();
  }
}
