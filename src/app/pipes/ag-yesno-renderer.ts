import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell',
    template: `
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="togle()" matTooltip="{{'Togle yes no' | translate }}">
             <ion-icon *ngIf="yesno" name="build-sharp"></ion-icon>
        </ion-button>
        ` 
})

export class YesNoBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    public yesno: boolean;

    agInit(params: any ): void {
        this.params = params;
        this.yesno = params.data;
    }

    public togle() {
        console.log("Edit", this.params.data);
        this.params.context.componentParent.togle(this.params);
    }
    refresh(params: any): boolean {
        return true;
    }
}