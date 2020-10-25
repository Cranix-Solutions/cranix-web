import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
        <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon  name="ellipsis-vertical-sharp"></ion-icon> 
        </ion-button>
        <ion-button *ngIf="mayEdit" style="padding-horizontal : 2px" fill="clear" size="small" (click)="details()" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button *ngIf="mayEdit" style="padding-horizontal : 2px" fill="clear" size="small" (click)="members()" matTooltip="{{'Members of the group:' | translate }}">
             <ion-icon name="people-circle"></ion-icon>
        </ion-button>
        <ion-button *ngIf="mayEdit"  style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete()" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button>
        `
})

export class GroupActionBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    public mayEdit: boolean = false;

    agInit(params: any): void {
        this.params = params;
        if (this.params.data) {
            this.mayEdit = params.context.componentParent.authService.isAllowed('group.modify') ||
                (params.context.componentParent.authService.session.userId == params.data.ownerId);
        }
    }

    public details() {
        this.params.context.componentParent.redirectToEdit(this.params.data.id, this.params.data);
    }
    public members() {
        this.params.context.componentParent.redirectToMembers(this.params.data.id, this.params.data);
    }
    public openAction(ev: any) {
        this.params.context.componentParent.openActions(ev, this.params.data.id)
    }
    public delete() {
         this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
