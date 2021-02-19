import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'file-system-usage-renderer',
    template: `<span [style]="style">{{value}}</span>`
})

export class FileSystemUsageRenderer implements ICellRendererAngularComp {
    public value: string;
    public style: string = "width: 60px";

    agInit(params: any): void {
        this.value = params.value;
        if (this.value) {
            let result = this.value.split(" ");
            if (result) {
                if (Number(result[1].replace('%', '')) > 80){
                    console.log(params)
                    console.log(this)
                    this.style = "width: 60px; background-color: red; padding: 5px"
                    this.value = result[1]
                }
                else if( Number(result[2].replace('%', '')) > 80) {
                    this.style = "width: 60px; background-color: red; padding: 5px"
                    this.value = result[2]
                } else {
                    this.value = result[0]
                    this.style = "width: 60px; background-color: #2dd36f; padding: 5px";
                }
            }
        }
    }

    refresh(params: any): boolean {
        return true;
    }
}
