import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
  selector: 'event-renderer',
  styleUrl: './cranix-ptm-view.component.css',
  template: `@if(event.parent){
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="danger"></ion-icon>
    </ion-button>
  }
  @else
  {
    <ion-button fill="clear" size="small" (click)="register()">
      <ion-icon name="pencil-outline" color="success"></ion-icon>
    </ion-button>
  }`
})
export class EventRenderer implements ICellRendererAngularComp {
  public event: PTMEvent;
  public context
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.event = this.context.events[params.value];
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    this.context.cancelEvent(this.event)
  }
  refresh(params: any): boolean {
    return true;
  }
}
