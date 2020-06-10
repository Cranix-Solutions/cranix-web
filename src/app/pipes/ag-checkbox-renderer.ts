import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell-text',
    template: `
        <ion-checkbox  *ngIf="params.data" class="ion-align-self-center" [checked]="params.value" color="success" (ionChange)="toggle($event)" ></ion-checkbox>
        <!-- ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="toggle($event)" matTooltip="{{'Togle yes no' | translate }}">
             <ion-icon *ngIf="params.value" name="checkmark-sharp" color="success"></ion-icon>
             <ion-icon *ngIf="params.value" name="close" color="danger"></ion-icon>
        </ion-button -->
        `
})

export class CheckBoxBTNRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any ): void {
        this.params = params;
    }

    public toggle(event) {
       let field = this.params.colDef.field;
       let value = this.params.value;
       let index = this.params.rowIndex;
       this.params.context.componentParent.proxyData[index][field] = !value;
       //var params = { force: true };
       //this.params.context.componentParent.proxyApi.refreshCells(params);
    }
    refresh(params: any): boolean {
        return true;
        //return false;
    }
}
