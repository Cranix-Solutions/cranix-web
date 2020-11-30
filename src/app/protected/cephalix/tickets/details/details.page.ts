import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//own 
import { Ticket, Article } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
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
    private objectS: GenericObjectService,
    private cephlixS: CephalixService
  ) { }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params.id;
    this.objectS.allObjects['ticket'].getValue().forEach((t: Ticket) => {
      console.log(t);
      if (t.id == this.ticketId) {
        this.ticket = t;
      }
    });
    let sub = this.cephlixS.getArticklesOfTicket(this.ticketId).subscribe(
      (val) => { this.articles = val },
      (error) => { this.articles.push(new Article()); },
      () => { sub.unsubscribe() }
    );
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  public deleteTicket(){
    this.objectS.deleteObjectDialog(this.ticket,"ticket");
  }
  public answerArticle(article: Article){
    //TODO
  }
  public noticeToArticle(article: Article){
    //TODO
  }
  public deleteArticle(article: Article){
    //TODO
  }
  public setSeenOnArticle(article: Article){
    //TODO
  }
}
