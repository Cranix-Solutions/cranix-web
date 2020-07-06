import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'action-cell',
    template: `
    <div class="name-action">
        <!--div>
        <ion-note >{{ name }}</ion-note>
        </div-->
        <ion-button fill="clear" size="small" (click)="details()" matTooltip="{{'modify' | translate }}">
             <ion-icon name="build-sharp"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
            <ion-icon  name="ellipsis-vertical-sharp"></ion-icon> 
        </ion-button>
        <!--ion-button fill="clear"  size="small" (click)="delete()" matTooltip="{{'delete' | translate }}">
            <ion-icon color="danger" name="trash-outline" ></ion-icon>
        </ion-button-->
        </div>
        ` 
})

export class ActionBTNRenderer implements ICellRendererAngularComp {
    private params: any;
    name; 
    agInit(params: any ): void {
        this.params = params;
        this.name= params.data.name;
    }

    public details() {
        console.log("Edit", this.params.data);
        this.params.context.componentParent.redirectToEdit(this.params.data.id, this.params.data);
    }
    public openAction(ev: any){
        this.params.context.componentParent.openActions(ev, this.params.data.id )
    }
   /* public delete() {
        this.params.context.componentParent.redirectToDelete(this.params.data);
    }*/

    refresh(params: any): boolean {
        return true;
    }
}
