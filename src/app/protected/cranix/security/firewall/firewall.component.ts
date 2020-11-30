import { Component, OnInit } from '@angular/core';
import { IncomingRules, OutgoingRule, RemoteRule } from 'src/app/shared/models/secutiry-model';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SecurityService } from 'src/app/services/security-service';
import { ModalController } from '@ionic/angular';
import { AddOutgoingRuleComponent } from './add-rules/add-outgoing-rule.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AddRemoteRuleComponent } from './add-rules/add-remote-rule.component';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'cranix-firewall',
  templateUrl: './firewall.component.html',
  styleUrls: ['./firewall.component.scss'],
})
export class FirewallComponent implements OnInit {
  segment: string = "in";
  defaultColDef;
  outColumnDefs;
  remoteColumnDefs;
  context;
  outApi;
  outColumnApi;
  outSelected;
  remoteApi;
  remoteColumnApi;
  remoteSelected;

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public securityService: SecurityService,
    public systemService: SystemService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    };
    this.outColumnDefs = [
      {
        field: 'name',
        headerName: this.languageS.trans('name')
      },
      { field: 'type', headerName: this.languageS.trans('type') },
      { field: 'dest', headerName: this.languageS.trans('dest') },
      { field: 'prot', headerName: this.languageS.trans('prot') },
      { field: 'port', headerName: this.languageS.trans('port') }
    ];
    this.remoteColumnDefs = [
      {
        field: 'name',
        headerName: this.languageS.trans('name')
      },
      { field: 'ext', headerName: this.languageS.trans('external port') },
      { field: 'port', headerName: this.languageS.trans('internal port') }
    ];
  }

  ngOnInit() {
    this.authService.log("readData called");
    this.securityService.readDatas();
  }

  segmentChanged(event) {
    this.segment = event.detail.value;
  }
  incomingChanged() {
    this.securityService.incomingRules.ssh = (<HTMLInputElement>document.getElementById('incoming-ssh')).checked;
    this.securityService.incomingRules.admin = (<HTMLInputElement>document.getElementById('incoming-admin')).checked;
    this.securityService.incomingRules.https = (<HTMLInputElement>document.getElementById('incoming-https')).checked;
    this.securityService.incomingRules.rdesktop = (<HTMLInputElement>document.getElementById('incoming-rdesktop')).checked;
    this.securityService.incomingRules.other = (<HTMLInputElement>document.getElementById('incoming-other')).value;
    this.securityService.incomingChanged = true;
  }
  applyChanges() {
    this.objectService.requestSent();
    switch (this.segment) {
      case 'in': {
        this.securityService.applyChange(this.securityService.incomingRules, 'incomingRules');
        this.securityService.incomingChanged = false;
        break;
      }
      case 'out': {
        this.securityService.applyChange(this.securityService.outgoingRules, 'outgoingRules');
        this.securityService.outgoinChanged = false;
        break;
      }
      case 'remote': {
        this.securityService.applyChange(this.securityService.remoteRules, 'remoteAccessRules');
        this.securityService.remoteChanged = false;
        break;
      }
    }
  }

  /**
   * Add a new outgoin rule
   */
  async addOutgoinRule() {
    const modal = await this.modalCtrl.create({
      component: AddOutgoingRuleComponent,
      cssClass: 'medium-modal',
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((val) => {
      if (val.data) {
        this.authService.log(this.securityService.outgoingRules);
        this.outApi.setRowData(this.securityService.outgoingRules);
        this.securityService.outgoinChanged = true;
      }
    });
    (await modal).present();
  }
  /**
   * Delets a rule
   */
  deleteOutgoinRule() {
    let newRules: OutgoingRule[] = [];
    for (let rule of this.securityService.outgoingRules) {
      if (this.outSelected.indexOf(rule) == -1) {
        newRules.push(rule);
      }
    }
    this.authService.log(newRules);
    this.securityService.outgoinChanged = true;
    this.securityService.outgoingRules = newRules;
    this.outApi.setRowData(newRules);
  }
  async addRemoteRule() {
    const modal = await this.modalCtrl.create({
      component: AddRemoteRuleComponent,
      cssClass: 'medium-modal',
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((val) => {
      if (val.data) {
        this.authService.log(this.securityService.remoteRules);
        this.remoteApi.setRowData(this.securityService.remoteRules);
        this.securityService.remoteChanged = true;
      }
    });
    (await modal).present();
  }
  /**
   * Delets a rule
   */
  deleteRemoteRule() {
    let newRules: RemoteRule[] = [];
    for (let rule of this.securityService.remoteRules) {
      if (this.remoteSelected.indexOf(rule) == -1) {
        newRules.push(rule);
      }
    }
    this.authService.log(newRules);
    this.securityService.remoteRules = newRules;
    this.remoteApi.setRowData(newRules);
    this.securityService.remoteChanged = true;
  }
  restartFirewall() {
    this.systemService.applyServiceState('SuSEfirewall2', 'activ', 'restart')
  }
  stopFirewall() {
    this.systemService.applyServiceState('SuSEfirewall2', 'activ', 'false')
  }
  outGridReady(params) {
    this.outApi = params.api;
    this.outColumnApi = params.columnApi;
    //  (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
    this.outApi.sizeColumnsToFit();
    this.outSizeAll();
  }
  outSelectionChanged() {
    this.outSelected = this.outApi.getSelectedRows();
  }
  outSizeAll() {
    var allColumnIds = [];
    this.outColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.outColumnApi.autoSizeColumns(allColumnIds);
  }
  remoteGridReady(params) {
    this.remoteApi = params.api;
    this.remoteColumnApi = params.columnApi;
    //  (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
    this.remoteApi.sizeColumnsToFit();
    this.remoteSizeAll();
  }
  remoteSelectionChanged() {
    this.remoteSelected = this.remoteApi.getSelectedRows();
  }
  remoteSizeAll() {
    var allColumnIds = [];
    this.remoteColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.remoteColumnApi.autoSizeColumns(allColumnIds);
  }
}
