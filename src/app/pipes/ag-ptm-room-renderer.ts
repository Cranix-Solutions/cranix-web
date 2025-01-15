import { Componentt } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'room-renderer',
  template: `@if(params.value != "0") {
  @if(context.isPtmManager) {
  <ion-button fill="clear" size="small" (click)="context.registerRoom(params.data.teacherId, params.data.ptmId)">
  {{params.value}}  
  </ion-button>
  } @else {
  {{params.value}}
  }
} @else {
  <ion-button fill="clear" size="small" (click)="context.registerRoom(params.data.teacherId, params.data.ptmId)">
    <ion-icon name="room-outline" color="success"></ion-icon>
  </ion-button>
}`
})
export class RoomRenderer implements ICellRendererAngularComp {
  public context
  public params
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.params = params
  }
  refresh(params: any): boolean {
    return true;
  }
}

