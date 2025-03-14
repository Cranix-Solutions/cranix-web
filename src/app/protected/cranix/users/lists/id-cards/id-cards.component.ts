import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-id-cards',
  templateUrl: './id-cards.component.html',
  styleUrl: './id-cards.component.css'
})
export class IdCardsComponent {

  allRequests = [];
  requests = []

  constructor(
    private userService: UsersService
  ){
    this.userService.getIdRequests().subscribe(
      (val) => {
        this.allRequests=val
        this.requests=val
      }
    )
  }

  serachRequests() {
    let filter = (<HTMLInputElement>document.getElementById('serach-requests')).value.toLowerCase();
    let tmp = []
    for (let o of this.allRequests) {
      if (o.requester.surName.indexOf(filter) > -1 || o.requester.givenName.indexOf(filter) > -1) {
        tmp.push(o)
      }
    }
    this.requests = tmp;
  }

}
