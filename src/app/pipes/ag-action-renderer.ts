import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
      
        <ion-button fill="clear" size="small"  (click)="details()" matTooltip="{{'edit' | translate }}">
             <ion-icon name="create-outline" style="height:15px;width:15px"></ion-icon>
        </ion-button>
        <ion-button  fill="clear"  size="small" (click)="delete()" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" style="height:15px;width:15px"></ion-icon>
        </ion-button>
        <ion-button  fill="clear"  size="small"></ion-button>
        ` 
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

    refresh(params: any): boolean {
        return true;
    }
}
