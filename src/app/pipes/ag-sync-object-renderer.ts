import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-syn-object-renderer',
    template: `
    <div class="name-action">
        <ion-button *ngIf="params.data.cephalixId && to" fill="clear" size="small" (click)="syncObjectToInstitute($event)">
             <ion-icon name="refresh-circle"></ion-icon>
        </ion-button>
        <ion-button *ngIf="params.data.cephalixId && !to" fill="clear" size="small" (click)="syncHWconfFromInstitute($event)" matTooltip="{{'Resync object from the CRANIX server' | translate }}">
            <ion-icon name="refresh-circle"></ion-icon>
        </ion-button>
        <ion-button *ngIf="!params.data.cephalixId" fill="clear" size="small" (click)="getHWconfFromInstitute($event)" matTooltip="{{ 'Get the object from the CRANIX server' | translate }}">
            <ion-icon name="cloud-download"></ion-icon>
        </ion-button>
        <ion-button *ngIf="params.data.cephalixId" fill="clear" size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        </div>
        `
})

export class SyncObjectRenderer implements ICellRendererAngularComp {
    public params: any;
    public to: boolean = true;
    agInit(params: any ): void {
        this.params = params;
        this.to = params.context.componentParent.segment == "to"
    }

    public syncObjectToInstitute(event) {
        event.stopPropagation();
        this.params.context.componentParent.syncObjectToInstitute(this.params.data);
    }
    public syncHWconfFromInstitute(event){
        event.stopPropagation();
        this.params.context.componentParent.syncHWconfFromInstitute(this.params.data);
    }
    public getHWconfFromInstitute(event){
        event.stopPropagation();
        this.params.context.componentParent.getHWconfFromInstitute(this.params.data.cranixId);
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
