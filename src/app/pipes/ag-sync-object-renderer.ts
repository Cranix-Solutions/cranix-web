import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-syn-object-renderer',
    template: `
    <div class="name-action">
        <div *ngIf="to">
            <ion-button *ngIf="params.data.cephalixId && params.data.objectType != 'Job'" fill="clear" size="small" (click)="syncObjectToInstitute($event)" matTooltip="{{'Sync object from CEPHALIX to the CRANIX server.' | translate }}">
                <ion-icon name="arrow-forward-circle"></ion-icon>
            </ion-button>
        </div>

        <div *ngIf="!params.data.syncRunning && !to">
            <ion-button *ngIf="params.data.cephalixId" fill="clear" size="small" (click)="syncHWconfFromInstitute($event)" matTooltip="{{'Resync object from the CRANIX server to the CEPHALIX server.' | translate }}">
                <ion-icon name="refresh-circle"></ion-icon>
            </ion-button>
            <ion-button *ngIf="!params.data.cephalixId" fill="clear" size="small" (click)="getHWconfFromInstitute($event)" matTooltip="{{ 'Get the object from the CRANIX server to the CEPHALIX server.' | translate }}">
                <ion-icon name="cloud-download"></ion-icon>
            </ion-button>
        </div>
        <div *ngIf="params.data.syncRunning">
            Syncing
            <ion-button fill="clear" size="small" (click)="stopSyncing($event)" matTooltip="{{'Stop synchronisation process' | translate }}" >
                <ion-icon color="danger" name="stop-circle-outline"></ion-icon>
            </ion-button>
        </div>
    </div>
    `
})

export class SyncObjectRenderer implements ICellRendererAngularComp {
    public params: any;
    public to: boolean = true;
    agInit(params: any ): void {
        this.params = params;
        this.to = this.params.context.componentParent.segment == "to"
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
    public stopSyncing(event) {
        event.stopPropagation();
        this.params.context.componentParent.stopSyncing(this.params.data.id, this.to ? "to" : "from");
    }

    refresh(params: any): boolean {
        return true;
    }
}
