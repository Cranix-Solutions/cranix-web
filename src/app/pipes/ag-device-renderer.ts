import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="details()" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="setPrinters()" matTooltip="{{'Set printers' | translate }}">
            <ion-icon name="print" ></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="setDhcp()" matTooltip="{{'Set DHCP parameter' | translate }}">
            <ion-icon color="danger" name="server" ></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon  name="ellipsis-vertical-sharp"></ion-icon> 
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete()" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        ` 
})

export class DeviceActionBTNRenderer implements ICellRendererAngularComp {
    private params: any;

    agInit(params: any ): void {
        this.params = params;
    }

    public details() {
        this.params.context.componentParent.redirectToEdit(this.params.data.id, this.params.data);
    }
    public openAction(ev: any){
        this.params.context.componentParent.openActions(ev, this.params.data.id )
    }
    public setPrinters() {
        this.params.context.componentParent.setPrinters(this.params.data);
    }
    public setDhcp() {
        this.params.context.componentParent.setDhcp(this.params.data);
    }
    public delete() {
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
