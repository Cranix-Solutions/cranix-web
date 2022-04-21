import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'room-action-cell-renderer',
    template: `
    <div *ngIf="params.data.name != 'ANON_DHCP' && params.data.roomType != 'ANON_DHCP'">
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="details($event)" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="devices($event)" matTooltip="{{'Devices' | translate }}">
            <ion-icon name="desktop" ></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="setPrinters($event)" matTooltip="{{'Set printers' | translate }}">
            <ion-icon name="print" ></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="setDhcp($event)" matTooltip="{{'Set DHCP parameter' | translate }}">
            <ion-icon color="danger" name="server" ></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon  name="ellipsis-vertical-sharp"></ion-icon> 
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        </div>
        ` 
})

export class RoomActionBTNRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any ): void {
        this.params = params;
    }

    public details(event) {
        event.stopPropagation();
        console.log("Edit", this.params.data);
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }
    public devices(event) {
        event.stopPropagation();
        this.params.context.componentParent.objectService.selectedRoom = this.params.data;
        this.params.context.componentParent.route.navigate(['/pages/cranix/devices']);
    }
    public setPrinters(event) {
        event.stopPropagation();
        this.params.context.componentParent.setPrinters(this.params.data);
    }
    public setDhcp(event) {
        event.stopPropagation();
        this.params.context.componentParent.setDhcp(this.params.data);
    }
    public openAction(event){
        event.stopPropagation();
        this.params.context.componentParent.openActions(event, this.params.data.id )
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
