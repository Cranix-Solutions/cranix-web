import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
selector: 'institut-status-cell-renderer',
    template: `
        <ion-button fill="clear" size="small" (click)="details()" matTooltip="{{'modify' | translate }}">
        {{params.data.cephalixInstituteId | idToName:'institute'}}
        </ion-button>
        `
})

export class InstituteStatusRenderer implements ICellRendererAngularComp {
    public params: any;
    agInit(params: any ): void {
        this.params = params;
    }

    public details() {
        console.log("Edit", this.params);
        this.params.context.componentParent.redirectToEdit(this.params.data.cephalixInstituteId);
    }

    refresh(params: any): boolean {
        return true;
    }
}
