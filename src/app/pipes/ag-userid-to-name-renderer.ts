import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'userid-to-name-cell',
    template: `{{ params.value | userIdToName }}`,
})
export class UserIdToNameCellRenderer implements ICellRendererAngularComp {
     params: any;

    constructor(){ }
    agInit(params: any): void {
        this.params = params;
    }
    refresh(params: any): boolean {
        return true;
    }
}