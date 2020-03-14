import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
        <button size="small" (click)="details()" mat-icon-button matTooltip="{{'edit' | translate }}">
             <ion-icon slot="top" name="create-outline"></ion-icon>
        </button>
        <button size="small" mat-icon-button (click)="notes()" matTooltip="{{'notes' | translate }}">
            <ion-icon slot="icon-only" name="menu"></ion-icon>
        </button>
        <button size="small" mat-icon-button (click)="delete()" matTooltip="{{'delete' | translate }}">
            <ion-icon slot="icon-only" color="danger" name="trash-outline"></ion-icon>
        </button>` ,

})
export class ActionBTNRenderer implements ICellRendererAngularComp {
    private params: any;

    agInit(params: any): void {
        this.params = params;
    }

    public details() {
        console.log("Edit", this.params.data);
        this.params.context.componentParent.redirectToEdit(this.params.data.id, this.params.data);
    }

    public delete() {
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    public notes() {
        this.params.context.componentParent.onBTNnotes(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
