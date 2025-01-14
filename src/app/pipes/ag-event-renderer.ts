import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { PTMEvent } from "src/app/shared/models/data-model";

@Component({
  selector: 'event-renderer',
  template: `@if(event){
  @if(event.blocked){
  <ion-button fill="clear" size="small">
    <ion-icon name="lock-closed" color="primary"></ion-icon>
  </ion-button>
  }@else if(isSelectable()){
    <ion-button fill="clear" size="small" (click)="register()">
      <ion-icon name="person-add-outline" color="success"></ion-icon>
    </ion-button>
  }@else{
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="danger"></ion-icon>
    </ion-button>
  }
}`
})
export class EventRenderer implements ICellRendererAngularComp {
  public event: PTMEvent;
  public context
  private role: string
  public myId: number
  agInit(params: any): void {
    this.context = params.context.componentParent
    this.myId = this.context.authService.session.userId
    this.role = this.context.authService.session.role
    this.event = this.context.events[params.value];
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    //TODO
    this.context.registerEvent(this.event)
  }
  isCancelable() {
    if (this.event.parent) {
      if (this.event.parent.id == this.myId || this.context.isPtmManager) {
        return true
      }
    }
  }
  isSelectable() {
    if (this.event.student) return false
    if (this.role == 'parents') {
      let count = 0
      for (let ev of this.context.events) {
        //TODO
      }
    }
    return true
  }
  refresh(params: any): boolean {
    return true;
  }
}
