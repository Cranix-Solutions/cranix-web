import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';


@Component({
    selector: 'cranix-users-2fa',
    templateUrl: './users-2fa.html',
    // styleUrls: ['./user-import.component.scss'],

})
export class Users2faComponent implements OnInit {
    objectKeys: string[] = [];
    displayedColumns: string[] = ['creatorId', 'crx2faType', 'crx2faAddress', 'timeStep', 'validHours'];
    columnDefs = [];
    defaultColDef = {};
    gridApi: GridApi;
    columnApi: ColumnApi;
    context;
    dataTypeDefinitions = {};
    constructor(
        public authService: AuthenticationService,
        public langService: LanguageService,
        public popoverCtrl: PopoverController,
        public objectService: GenericObjectService

    ) {

        this.context = { componentParent: this };
        this.defaultColDef = {
            resizable: true,
            sortable: true,
            hide: false,
            suppressHeaderMenuButton: true
        }
        this.dataTypeDefinitions = {
            user: {
                baseDataType: 'text',
                valueFormatter: params => params.context.componentParent.objectService.getObjectById('user', params.value).fullName
            }
        }
        this.createColumDef();

    }
    ngOnInit() {
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }
    onQuickFilterChanged(quickFilter) {
        let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
        this.gridApi.setGridOption('quickFilterText', filter);
    }

    createColumDef() {
        this.columnDefs = [];
        this.columnDefs.push({
            headerCheckboxSelection: this.authService.settings.headerCheckboxSelection,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            field: 'creatorId',
            headerName: this.langService.trans('user'),
            valueGetter: function (params) {
                return params.context.componentParent.objectService.getObjectById('user', params.data.creatorId).fullName
            },
            wrapText: true,
            autoHeight: true,
            cellStyle: { 'line-height': '16px' }
        })
        this.columnDefs.push({
            field: 'crx2faType',
            headerName: this.langService.trans('Type'),
            width: 80
        })
        this.columnDefs.push({
            field: 'crx2faAddress',
            headerName: this.langService.trans('Serial/Address'),
            valueGetter: function (params) {
                console.log(params)
                if (params.data.crx2faType == "TOTP") {
                    return params.data.serial
                } else {
                    return params.data.crx2faAddress
                }
            },
            wrapText: true,
            autoHeight: true,
            cellStyle: { 'line-height': '16px' }

        })
        this.columnDefs.push({
            field: 'timeStep',
            headerName: this.langService.trans('timeStep'),
            width: 80
        })
        this.columnDefs.push({
            field: 'validHours',
            headerName: this.langService.trans('validHours'),
            width: 80
        })
    }

    async openActions(ev) {
        let selectedIds: number[] = [];
        let selection = this.gridApi.getSelectedRows()
        for (let i of selection) {
            selectedIds.push(i.id)
        }
        const popover = await this.popoverCtrl.create({
            component: ActionsComponent,
            event: ev,
            componentProps: {
                objectType: "2fa",
                objectIds: selectedIds,
                selection: selection,
                gridApi: this.gridApi
            },
            translucent: true,
            animated: true,
            showBackdrop: true
        });
        await popover.present();
    }
}

