import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell',
    template: `
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="toggle()" matTooltip="{{'Togle yes no' | translate }}">
             <ion-icon *ngIf="params.value" name="checkmark-sharp" color="success"></ion-icon>
             <ion-icon *ngIf="!params.value" name="close" color="danger"></ion-icon>
        </ion-button>
        ` 
})

export class YesNoBTNRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any ): void {
        this.params = params;
    }

    public toggle() {
        this.params.context.componentParent.toggle(this.params.data.id, this.params.colDef.field,this.params.value);
    }
    refresh(params: any): boolean {
        return true;
    }
}
