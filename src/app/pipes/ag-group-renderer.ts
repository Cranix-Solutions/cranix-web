import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'group-action-cell-renderer',
    template: `
        <ion-button *ngIf="mayEdit" style="padding-horizontal : 2px" fill="clear" size="small" (click)="details($event)" matTooltip="{{'edit' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button *ngIf="mayEdit" style="padding-horizontal : 2px" fill="clear" size="small" (click)="members($event)" matTooltip="{{'Members of the group:' | translate }}">
             <ion-icon name="people-circle"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon  name="ellipsis-vertical-sharp"></ion-icon>
        </ion-button>
        <ion-button *ngIf="mayEdit"  style="padding-horizontal : 2px" fill="clear"  size="small" (click)="delete($event)" matTooltip="{{'delete' | translate }}">
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
                (params.context.componentParent.authService.session.userId == params.data.creatorId);
        }
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.params.data);
    }
    public members(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToMembers(this.params.data);
    }
    public openAction(event) {
        event.stopPropagation();
        this.params.context.componentParent.openActions(event, this.params.data)
    }
    public delete(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }

    refresh(params: any): boolean {
        return true;
    }
}
