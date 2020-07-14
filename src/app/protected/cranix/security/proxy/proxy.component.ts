import { Component, OnInit } from '@angular/core';

import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SecurityService } from 'src/app/services/security-service';
import { CheckBoxBTNRenderer } from 'src/app/pipes/ag-checkbox-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ApplyCheckBoxBTNRenderer } from 'src/app/pipes/ag-apply-checkbox-renderer';

@Component({
  selector: 'cranix-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss'],
})
export class ProxyComponent implements OnInit {

  segment = 'basic';
  rowData: any[];
  proxyOptions;
  context;
  proxyApi;
  proxyColumnApi;
  proxySelected;
  columnDefs: any[];

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public objectService: GenericObjectService,
    public securityService: SecurityService
  ) {
    this.context = { componentParent: this };
    this.readDatas().then(val => {
      this.rowData = val;
      this.columnDefs = [{
        field: 'name',
        headerName: this.languageS.trans('name'),
        suppressMenu: true,
        sortable: true
      },
      {
        field: 'applyForAll' ,
        cellStyle: { 'justify-content': "center" },
        headerName: this.languageS.trans('applyForAll'),
        width: 100,
        cellRendererFramework: ApplyCheckBoxBTNRenderer
      }
    ];
      this.authService.log(this.rowData);
      for (let key of Object.getOwnPropertyNames(val[0])) {
        let col = {};
        if (key != "name") {
          col['cellStyle'] = { 'justify-content': "center" };
          col['field'] = key;
          col['minWidth'] = 100;
          col['sortable'] = false;
          col['suppressMenu'] = true;
          col['headerName'] = this.languageS.trans(key);
          col['cellRendererFramework'] = CheckBoxBTNRenderer;
          this.columnDefs.push(col);
        }
      }
      this.authService.log(this.columnDefs);
    });
  }

  ngOnInit() {
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
  }

  readDatas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.securityService.getProxyBasic().subscribe(
        (val) => { resolve(val) },
        (err) => { this.authService.log(err) }
      )
    });
  }
  proxyGridReady(params) {
    this.proxyApi = params.api;
    this.proxyColumnApi = params.columnApi;
    this.authService.log("proxyGridReady");
  }
  proxySelectionChanged() {
    this.proxySelected = this.proxyApi.getSelectedRows();
  }

  redirectToEdit(event, positiveList) {
    //TODO
  }
  writeConfig() {
    this.authService.log(this.rowData);
    this.objectService.requestSent();
    let sub = this.securityService.setProxyBasic(this.rowData).subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      () => { sub.unsubscribe() });
  }
  restartProxy() {
    //TODO
  }

}
