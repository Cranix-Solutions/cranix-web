import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell-text',
    template: `
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="toggle($event)" matTooltip="{{'Togle yes no' | translate }}">
             <ion-icon *ngIf="params.value == 'true'" name="checkmark-sharp" color="success"></ion-icon>
             <ion-icon *ngIf="params.value == 'false'" name="close" color="danger"></ion-icon>
        </ion-button>
        ` 
})

export class YesNoTextBTNRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any ): void {
        this.params = params;
    }

    public toggle(event) {
       let field = this.params.colDef.field;
       let value = this.params.value;
       let index = this.params.rowIndex;
       if( value == 'false' ) {
          value = 'true';
       } else {
          value = 'false';
       }
       console.log(this.params.context.componentParent.proxyData[index][field]);
       this.params.context.componentParent.proxyData[index][field] = value;  
       console.log(this.params.context.componentParent.proxyData[index][field]);
       var params = { force: true };
       this.params.context.componentParent.proxyApi.refreshCells(params);
    }
    refresh(params: any): boolean {
        return false;
    }
}
