import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//own 
import { Ticket, Article } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ModalController } from '@ionic/angular';
import { EditArticleComponent } from 'src/app/shared/actions/edit-article/edit-article.component';
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
    private cephlixS: CephalixService,
    private objectS: GenericObjectService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params.id;
    this.objectS.allObjects['ticket'].getValue().forEach((t: Ticket) => {
      if (t.id == this.ticketId) {
        this.ticket = t;
      }
    });
    this.readArcticles();
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  public readArcticles() {
    let sub = this.cephlixS.getArticklesOfTicket(this.ticketId).subscribe(
      (val) => { 
        console.log(val);
        this.articles = val },
      (error) => { this.articles.push(new Article()); },
      () => { sub.unsubscribe() }
    );
  }
  public deleteTicket(){
    this.objectS.deleteObjectDialog(this.ticket,"ticket");
  }
  async answerArticle(article: Article){
    if( ! article.sender) {
      article.sender = this.ticket.email;
    }
    article.title = this.ticket.firstname + " " +this.ticket.lastname;
    const modal = await this.modalController.create({
      component: EditArticleComponent,
      componentProps: {
        ticket:  this.ticket,
        article: article
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.readArcticles();
    });
    (await modal).present();
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
