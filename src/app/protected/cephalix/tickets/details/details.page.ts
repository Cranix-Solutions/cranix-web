import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//own 
import { Ticket, Article } from '../../../../shared/models/cephalix-data-model';
import { GenericObjectService } from './../../../../services/generic-object.service';
import { CephalixService } from './../../../../services/cephalix.service';
@Component({
  selector: 'cranix-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
 ticketId: number;
 ticket: Ticket;
 articles: Article[] = [new Article()];
  constructor(
    private route: ActivatedRoute,
    private opbjectS : GenericObjectService,
    private cephlixS: CephalixService
  ) { }

  ngOnInit() {
    this.ticketId= this.route.snapshot.params.id;
      this.opbjectS.allObjects['ticket'].getValue().forEach((t: Ticket) => {
        console.log(t);
        if (t.id == this.ticketId) {
          this.ticket = t;
        }
      });
      let sub = this.cephlixS.getArticklesOfTicket(this.ticketId).subscribe(
        (val)=>{ this.articles = val},
        (error) => { this.articles.push(new  Article()); },
        () => { sub.unsubscribe()}
        );
      }
}
