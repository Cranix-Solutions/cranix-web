import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'groupid-cell',
    template: `{{ params.value | idToName:'group' }}`,
})
export class GroupIdCellRenderer implements ICellRendererAngularComp {
     params: any;

    constructor(){ }
    agInit(params: any): void {
        this.params = params;
    }
    refresh(params: any): boolean {
        return true;
    }
}