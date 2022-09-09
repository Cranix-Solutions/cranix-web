import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell-renderer',
    template: `
    <div class="name-action">
        <div *ngIf="id">#{{ id }}</div>
        <ion-button fill="clear" size="small" (click)="details($event)" matTooltip="{{'modify' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="editInstitutes($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon name="business"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        </div>
        `
})

export class CustomerActionRenderer implements ICellRendererAngularComp {
    private params: any;
    public  id;
    agInit(params: any ): void {
        this.params = params;
        if( this.params.colDef.field == "id") {
            this.id = this.params.value;
        }
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }
    public editInstitutes(event){
        event.stopPropagation();
        this.params.context.componentParent.editInstitutes(this.params.data);
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
