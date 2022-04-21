import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'update-cell-renderer',
    template: `
        <ng-template [ngIf]="doUpate" [ngIfElse]="elseBlock">
            <ion-button fill="clear" size="small" (click)="update($event)" matTooltip="{{ updates }}">
                 <ion-icon slot="icon-only" color="danger" name="refresh-circle" style="height:20px;width:20px"></ion-icon>
            </ion-button>
        </ng-template>
        <ng-template #elseBlock>
            <ion-icon  slot="icon-only" color="success" name="checkmark-sharp" style="height:20px;width:20px"></ion-icon>
        </ng-template>
        `
})

export class UpdateRenderer implements ICellRendererAngularComp {
    private params: any;
    public updates: string = "No Update";
    public doUpate: boolean = false;
    public updatesCount: number = 0;

    agInit(params: any): void {
        this.params = params;

        if (params.data.availableUpdates) {
            this.updatesCount = params.data.availableUpdates.split(" ").length;
            this.updates = params.data.availableUpdates;
        }
        this.doUpate = this.updatesCount > 0;
    }

    public update(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToUpdate(this.params.data.cephalixInstituteId);
    }

    refresh(params: any): boolean {
        return true;
    }
}
