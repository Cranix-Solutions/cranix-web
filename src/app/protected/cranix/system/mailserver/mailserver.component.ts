import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SystemService } from 'src/app/services/system.service';
import { MailAccess } from 'src/app/shared/models/server-models'

@Component({
  selector: 'app-mailserver',
  templateUrl: './mailserver.component.html',
  styleUrls: ['./mailserver.component.scss'],
})
export class MailserverComponent implements OnInit {

  allMailAccess: MailAccess[] = [];
  mailAccess: MailAccess = new MailAccess();
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu: true
  }
  columnDefs = []
  gridApi;
  columnApi;
  isRealyDeleteOpen: boolean = false;
  isAddAccessOpen: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public langService: LanguageService,
    private objectService: GenericObjectService,
    private systemService: SystemService
  ) { }

  ngOnInit() {
    this.createColumDef()
    this.systemService.getAllMailAccess().subscribe({
      next: (val) => { this.allMailAccess = val },
      error: (err) => { this.objectService.errorMessage(err) }
    })
  }

  createColumDef() {
    this.columnDefs = [];
    this.columnDefs.push({
      headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      field: 'address',
      wrapText: true,
      autoHeight: true,
      cellStyle: { 'line-height': '16px' }
    })
    this.columnDefs.push({
      field: 'action',
      headerName: this.langService.trans('action'),
      width: 120
    })
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    this.gridApi.setQuickFilter(filter);
  }

  addMailAccess() {
    this.systemService.addMailAccess(this.mailAccess).subscribe({
      next: (resp) => {
        this.objectService.responseMessage(resp)
        this.isAddAccessOpen = false;
        this.ngOnInit()
      },
      error: (err) => { this.objectService.errorMessage(err) }
    })
  }

  delete() {
    for (let obj of this.gridApi.getSelectedRows()) {
      this.systemService.deleteMailAccess(obj.id)
    }
    this.isRealyDeleteOpen = false;
    this.ngOnInit()
  }



}

