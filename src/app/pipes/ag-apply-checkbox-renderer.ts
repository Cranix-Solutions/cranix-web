import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell-text',
    /*template: `
        <ion-checkbox  *ngIf="params.data" class="ion-align-self-center" [checked]="checked" color="success" (ionChange)="toggle($event)"></ion-checkbox>
        `*/
        template: `
        <ion-button *ngIf="params.data" style="padding-horizontal : 2px" fill="clear" size="small" (click)="toggle($event)" matTooltip="{{'apply' | translate }}">
            <ion-icon name="checkmark-circle" color="tertiary"></ion-icon>
        </ion-button>
        `
})

export class ApplyCheckBoxBTNRenderer implements ICellRendererAngularComp {
    public params: any;
    public checked: boolean = false;
    public field;
    public index;


    agInit(params: any ): void {
        this.params = params;
         this.field = this.params.colDef.field;
         this.index = this.params.rowIndex;
    }

    public toggle(event) {
       this.checked = !this.checked;
       for( let key of Object.getOwnPropertyNames( this.params.context.componentParent.rowData[this.index])) {
           if( key != "name") {
            this.params.context.componentParent.rowData[this.index][key] = this.checked;
           }
       }
       if( this.params.context.componentParent.setChanged ) {
        this.params.context.componentParent.setChanged(true);
       }
    }
    refresh(params: any): boolean {
        return true;
        //return false;
    }
}
