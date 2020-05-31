import { Component, OnInit } from '@angular/core';
import { IncomingRules, OutgoingRule } from 'src/app/shared/models/secutiry-model';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SecurityService } from 'src/app/services/security-service';

@Component({
  selector: 'cranix-firewall',
  templateUrl: './firewall.component.html',
  styleUrls: ['./firewall.component.scss'],
})
export class FirewallComponent implements OnInit {
  segment: string = "in";
  outData: any[] = [];
  remoteData: any[] = [];
  outOptions;
  remoteOptions;
  context;
  outApi;
  outColumnApi;
  outSelected;
  remoteApi;
  remoteColumnApi;
  remoteSelected;
  incoming;

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public securityService: SecurityService
  ) {
    this.context = { componentParent: this };
    this.outOptions = {
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu: true
      },
      columnDefs: [
        {
          field: 'name',
          headerName: this.languageS.trans('name'),
          checkboxSelection: true,
        },
        { field: 'type', headerName: this.languageS.trans('type') },
        { field: 'dest', headerName: this.languageS.trans('dest') },
        { field: 'prot', headerName: this.languageS.trans('prot') },
        { field: 'port', headerName: this.languageS.trans('port') }
      ],
      context: this.context,
      rowSelection: 'multiple',
      rowHeight: 35
    }
    this.remoteOptions = {
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu: true
      },
      columnDefs:[
        {
          field: 'name',
          headerName: this.languageS.trans('name'),
          checkboxSelection: true,
        },
        { field: 'ext', headerName: this.languageS.trans('external port') },
        { field: 'port', headerName: this.languageS.trans('internal port') }
      ],
      context: this.context,
      rowSelection: 'multiple',
      rowHeight: 35
    }
  }

  ngOnInit() {
    this.readDatas();
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
    this.readDatas();
  }
  readDatas() {
    switch (this.segment) {
      case 'in': {
        let sub1 = this.securityService.getIncomingRules().subscribe(
          (val) => { this.incoming = val; },
          (err) => { console.log(err) },
          () => { sub1.unsubscribe(); }
        ); break;
      }
      case 'out': {
        let sub2 = this.securityService.getOutgoingRules().subscribe(
          (val) => { this.outData = val; },
          (err) => { console.log(err) },
          () => { sub2.unsubscribe(); }
        ); break;
      }
      case 'remote': {
        let sub2 = this.securityService.getRemoteAccessRules().subscribe(
          (val) => { this.remoteData = val; },
          (err) => { console.log(err) },
          () => { sub2.unsubscribe(); }
        ); break;
      }
    }
  }

  applyIncomingRules() {
    //TODO
  }
  addOutgoinRule() {
    //TODO
  }
  addForwardRule() {
    //TODO
  }
  restartFirewall() {
    //TODO
  }
  stopFirewall() {
    //TODO
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
