import { Component } from '@angular/core';
import { PTMEvent } from 'src/app/shared/models/data-model';
import { ICellRendererAngularComp } from 'ag-grid-angular';

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
  }@else if(isCancelable()){
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="danger"></ion-icon>
    </ion-button>
  }@else{
  <ion-icon name="man-outline" color="primary"></ion-icon>
  }
}`
})
export class EventRenderer implements ICellRendererAngularComp {
  public event: PTMEvent;
  public context
  private role: string
  private params
  public myId: number

  agInit(params: any): void {
    this.context = params.context.componentParent
    this.myId = this.context.authService.session.user.id
    this.role = this.context.authService.session.user.role
    this.event = this.context.events[params.value];
    this.params = params
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    this.context.registerEvent(this.event)
  }
  isCancelable() {
    if (this.event.student) {
      if (this.event.student.id == this.myId || this.context.isPtmManager) {
        return true
      }
    }
  }
  isSelectable() {
    if (this.event.student) return false
    if (this.role == 'parents' || this.role == 'students') {
      if (this.context.eventsTeacherStudent[this.params.data.teacherId][this.myId]) return false;
      if (this.context.eventsTimeStudent[this.params.column.colId][this.myId]) return false;
    }
    return true
  }
  refresh(params: any): boolean {
    return true;
  }
}
