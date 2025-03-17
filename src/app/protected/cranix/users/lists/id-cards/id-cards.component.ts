import { Component, AfterViewInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { UsersService } from 'src/app/services/users.service';
import { IdRequest } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-id-cards',
  templateUrl: './id-cards.component.html',
  styleUrl: './id-cards.component.css'
})
export class IdCardsComponent implements AfterViewInit {

  allRequests = []
  isPopoverOpen: boolean = false
  openedOnly: boolean = true
  requests = []
  selectedRequest: IdRequest = new IdRequest()

  constructor(
    private userService: UsersService,
    private objectService: GenericObjectService
  ) {

  }
  ngAfterViewInit() {
    this.readData()
  }
  readData() {
    this.userService.getIdRequests().subscribe(
      (val) => {
        this.allRequests = val
        this.searchRequests()
      }
    )
  }
  searchRequests() {
    let filter = (<HTMLInputElement>document.getElementById('search-requests')).value
    filter = filter ? filter.toLowerCase() : ""
    let tmp = []
    for (let o of this.allRequests) {
      if (this.openedOnly && o.allowed) {
        continue;
      }
      if (
        (o.creator.fullName.toLowerCase().indexOf(filter) > -1) ||
        (o.comment.toLowerCase().indexOf(filter) > -1)
      ) {
        tmp.push(o)
      }
    }
    this.requests = tmp;
  }

  setIdRequest(request: IdRequest) {
    this.userService.setIdRequest(request).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.readData()
      }
    )

  }

  deleteIdRequest(id: number) {
    this.userService.deleteIdRequest(id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.readData()
      }
    )
  }

  getIdRequest(id: number) {
    this.userService.getIdRequest(id).subscribe(
      (val) => {
        console.log(val)
        this.selectedRequest = val
        this.selectedRequest.picture = "data:image/jpg;base64," + val.picture
        this.isPopoverOpen = true
      }
    )
  }
  closePopOver(popOver: any) {
    popOver.dismiss();
    this.isPopoverOpen = false;
  }
}
