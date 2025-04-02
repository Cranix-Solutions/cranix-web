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
  }@else if(isMe()){
    <ion-button fill="clear" size="small" (click)="cancel()">
      <ion-icon name="man-outline" color="warning"></ion-icon>
    </ion-button>
  }@else if(context.isPtmManager && event.student){
    <ion-button fill="clear" size="small" (click)="cancel()" matTooltip="{{event.student.fullName}}">
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
  private params
  public studentId: number

  agInit(params: any): void {
    this.context = params.context.componentParent
    if (this.context.selectedStudent) {
      this.studentId = this.context.selectedStudent.id
    }
    this.event = this.context.events[params.value];
    this.params = params
  }
  register() {
    this.context.registerEvent(this.event)
  }
  cancel() {
    this.context.registerEvent(this.event)
  }

  isMe() {
    return this.event.student && (this.event.student.id == this.studentId)
  }
  isSelectable() {
    if (this.event.student) return false
    if (this.studentId) {
      if (this.context.eventsTeacherStudent[this.params.data.teacherId][this.studentId]) return false;
      if (this.context.eventsTimeStudent[this.params.column.colId][this.studentId]) return false;
    }
    return true
  }
  refresh(params: any): boolean {
    return true;
  }
}
