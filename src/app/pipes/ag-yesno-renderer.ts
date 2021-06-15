import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'yesno-cell',
    template: `
        <ion-button *ngIf="params.value != null && active" fill="clear" size="small"
            [color]="params.value ? 'success' : 'danger'" (click)="toggle()">
            <ion-icon *ngIf="params.value" name="checkmark-circle" slot="icon-only"></ion-icon>
            <ion-icon *ngIf="!params.value" name="close-circle" slot="icon-only"></ion-icon>
        </ion-button>
        <div *ngIf="params.value != null && !active">
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
            this.params.value = !this.params.value;
            this.params.data[this.params.colDef.field] = this.params.value;
            this.params.context.componentParent.toggle(this.params.data, this.params.colDef.field, this.params.value);
            this.params.refreshCell();
        }
        console.log(this.params);
    }
    refresh(params: any): boolean {
        return true;
    }
}
