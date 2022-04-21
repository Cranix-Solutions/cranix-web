import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
selector: 'institut-status-cell-renderer',
    template: `
        <ion-button fill="clear" size="small" (click)="details($event)" matTooltip="{{'modify' | translate }}">
        {{params.data.cephalixInstituteId | idToName:'institute'}}
        </ion-button>
        `
})

export class InstituteStatusRenderer implements ICellRendererAngularComp {
    public params: any;
    agInit(params: any ): void {
        this.params = params;
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
