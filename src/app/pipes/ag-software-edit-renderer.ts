import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'edit-cell',
    template: `
        <ion-button style="padding-horizontal : 2px" fill="clear" size="small" (click)="details($event)" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        <ion-button style="padding-horizontal : 2px" fill="clear"  size="small" (click)="licenses($event)" matTooltip="{{'Manage licenses' | translate }}">
            <ion-icon color="success" name="key-outline" ></ion-icon>
            <div *ngIf="licenseCounter" style="font-size: 10px; color: green; border: 1px solid green; border-radius: 4px; padding: 2px; margin: 3px" >{{licenseCounter}}</div>
        </ion-button>
        ` 
})

export class SoftwareEditBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    public licenseCounter: number = 0;

    agInit(params: any): void {
        this.params = params;
        this.params.context.componentParent.softwareService.getSoftwareLicense(this.params.data.id).subscribe(
            (val) => {
                for( let obj of val) {
                    this.licenseCounter = this.licenseCounter + obj.count
                }
            }
        )
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }
    public licenses(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToLicenses(this.params.data);
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
