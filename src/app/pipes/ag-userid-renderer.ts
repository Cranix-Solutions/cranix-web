import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'userid-cell',
    template: `{{ params.value | userIdToUid }}`,
})
export class UserIdCellRenderer implements ICellRendererAngularComp {
     params: any;

    constructor(){ }
    agInit(params: any): void {
        this.params = params;
    }
    refresh(params: any): boolean {
        return true;
    }
}