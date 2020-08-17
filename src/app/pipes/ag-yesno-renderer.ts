import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell',
    template: `
        <ion-button *ngIf="params.data && active" style="padding-horizontal : 2px" fill="clear" size="small" (click)="toggle()" matTooltip="{{'Togle yes no' | translate }}">
            <ion-icon *ngIf="params.value" name="checkmark-sharp" color="success"></ion-icon>
            <ion-icon *ngIf="!params.value" name="close" color="danger"></ion-icon>
        </ion-button>
        <ion-button *ngIf="params.data && !active" style="padding-horizontal : 2px" fill="clear" size="small">
             <ion-icon *ngIf="params.value" name="checkmark-sharp" color="success"></ion-icon>
             <ion-icon *ngIf="!params.value" name="close" color="danger"></ion-icon>
        </ion-button>
        `
})

export class YesNoBTNRenderer implements ICellRendererAngularComp {
    public params: any;
    public active: boolean = false;

    agInit(params: any): void {
        this.params = params;
        if (this.params.context.componentParent.toggle) {
            this.active = true;
        }
    }

    public toggle() {
        if (this.active) {
            this.params.context.componentParent.toggle(this.params.data.id, this.params.colDef.field, this.params.value);
        }
    }
    refresh(params: any): boolean {
        return true;
    }
}
