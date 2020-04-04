import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
        <ng-template [ngIf]="doUpate" [ngIfElse]="elseBlock">
            <ion-button fill="clear" size="small" (click)="update()" matTooltip="{{ updates }}">
                 <ion-icon slot="icon-only" color="danger" name="refresh-circle" style="height:20px;width:20px"></ion-icon>
            </ion-button>
        </ng-template>
        <ng-template #elseBlock>
            <ion-icon  slot="icon-only" color="success" name="checkmark-done" style="height:20px;width:20px"></ion-icon>
        </ng-template>
        `
})

export class UpdateRenderer implements ICellRendererAngularComp {
    private params: any;
    private updates: string = "No Update";
    private doUpate: boolean = false;
    private updatesCount: number = 0;

    agInit(params: any): void {
        this.params = params;

        if (params.data.availableUpdates) {
            this.updatesCount = params.data.availableUpdates.split(" ").length;
            this.updates = params.data.availableUpdates;
        }
        this.doUpate = this.updatesCount > 0;
    }

    public update() {
        console.log("Edit", this.params.data);
        this.params.context.componentParent.redirectToUpdate(this.params.data.cephalixInstituteId);
    }

    refresh(params: any): boolean {
        return true;
    }
}
