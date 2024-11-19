import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'datetime-cell',
    template: `{{ params.value | date:'yyyy-MM-dd HH:mm:ss' }}`,
})
export class DateTimeCellRenderer implements ICellRendererAngularComp {
     params: any;

    constructor(){ }
    agInit(params: any): void {
        this.params = params;
    }
    refresh(params: any): boolean {
        return true;
    }
}
