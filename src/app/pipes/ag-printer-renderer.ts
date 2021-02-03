import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
        <ion-button *ngIf="printerAddAllowed" style="padding-horizontal : 2px" fill="clear" size="small" (click)="details()" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="reset()" matTooltip="{{'Reset printer' | translate }}">
            <ion-icon name="refresh" ></ion-icon>
        </ion-button>
        ` 
})

export class PrinterActionBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    public  printerAddAllowed: boolean = false;

    agInit(params: any ): void {
        this.params = params;
        this.printerAddAllowed = this.params.context.componentParent.authService.isAllowed('printers.add');
    }

    public details() {
        console.log("Edit", this.params.data);
        this.params.context.componentParent.redirectToEdit(this.params.data.id, this.params.data);
    }
    public reset(){
        this.params.context.componentParent.reset(this.params.data.id )
    }
    refresh(params: any): boolean {
        return true;
    }
}
