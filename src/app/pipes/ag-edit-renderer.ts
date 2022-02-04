import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'edit-cell-renderer',
    template: `
        <div class="name-action">
            <div *ngIf="id">#{{ id }}</div>
            <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="details($event)" matTooltip="{{'edit' | translate }}">
                <ion-icon name="build-sharp"></ion-icon>
            </ion-button>
            <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
                <ion-icon color="danger" name="trash-outline" ></ion-icon>
            </ion-button>
        </div>
        ` 
})

export class EditBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    public  id;

    agInit(params: any): void {
        this.params = params;
        if( this.params.colDef.field == "id") {
            this.id = this.params.value;
        }
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
