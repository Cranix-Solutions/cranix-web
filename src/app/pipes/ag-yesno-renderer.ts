import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell',
    template: `
        <ion-button *ngIf="params.data && active" fill="clear" size="small"
            [color]="params.value ? 'success' : 'danger'" (click)="toggle()" matTooltip="{{'Toggle yes no' | translate }}">
            <ion-icon *ngIf="params.value" name="checkmark-circle" slot="icon-only"></ion-icon>
            <ion-icon *ngIf="!params.value" name="close-circle" slot="icon-only"></ion-icon>
        </ion-button>
        <div *ngIf="params.data && !active">
             <ion-icon *ngIf="params.value" name="checkmark-sharp" color="success"></ion-icon>
             <ion-icon *ngIf="!params.value" name="close" color="danger"></ion-icon>
        </div>
        `
})

export class YesNoBTNRenderer implements ICellRendererAngularComp {
    public params: any;
    public active: boolean = false;

    agInit(params: any): void {
        this.params = params;
        if( !this.params.context.componentParent.notActive &&
             this.params.context.componentParent.toggle) {
            this.active = true;
        }
    }

    public toggle() {
        console.log(this.params)
        if (this.active) {
            this.params.context.componentParent.toggle(
                this.params.data.id,
                this.params.colDef.field,
                this.params.value,
                this.params.rowIndex);
        }
    }
    refresh(params: any): boolean {
        return true;
    }
}
