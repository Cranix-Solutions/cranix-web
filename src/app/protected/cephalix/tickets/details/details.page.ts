import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//own
import { Ticket, Article, Institute } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ModalController } from '@ionic/angular';
import { EditArticleComponent } from 'src/app/shared/actions/edit-article/edit-article.component';
class InstituteList {
  id: number;
  label: string;
}
@Component({
  selector: 'cranix-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  ticketId: number;
  ticket: Ticket;
  articles: Article[] = [new Article()];
  institute: Institute;
  institutes: InstituteList[] = [];
  allInstitutes: InstituteList[] = [];
  constructor(
    private route: ActivatedRoute,
    private cephlixS: CephalixService,
    private objectService: GenericObjectService,
    private modalController: ModalController
  ) {
    this.ticketId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    let sub = this.cephlixS.getTicketById(this.ticketId).subscribe(
      (val) => {
        this.ticket = val;
        this.institute = this.objectService.getObjectById('institute', val.cephalixInstituteId);
        this.readArcticles();
        if (!this.institute) {
          this.objectService.getObjects('institute').subscribe(
            (obj) => {
              for( let i of obj ) {
                this.institutes.push({ id: i.id, label: i.name + " " + i.locality })
              }
              this.institute = new Institute();
              console.log(this.institutes, this.institute)
            }
          )
        }
      },
      (err) => { console.log(err) },
      () => { sub.unsubscribe() }
    )
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  public readArcticles() {
    let sub = this.cephlixS.getArticklesOfTicket(this.ticketId).subscribe(
      (val) => {
        console.log(val);
        this.articles = val
      },
      (error) => { this.articles.push(new Article()); },
      () => { sub.unsubscribe() }
    );
  }
  public deleteTicket() {
    this.objectService.deleteObjectDialog(this.ticket, "ticket", '/pages/cephalix/tickets');
  }
  async answerArticle(article: Article) {
    if (!article.sender) {
      article.sender = this.ticket.email;
    }
    article.title = this.ticket.firstname + " " + this.ticket.lastname;
    const modal = await this.modalController.create({
      component: EditArticleComponent,
      componentProps: {
        ticket: this.ticket,
        article: article
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.objectService.getAllObject('ticket');
      this.readArcticles();
    });
    (await modal).present();
  }

  public noticeToArticle(article: Article) {
    //TODO
  }
  public deleteArticle(article: Article) {
    //TODO
  }
  public setSeenOnArticle(article: Article) {
    //TODO
  }

  public setInstitute() {
    let tmp = (<HTMLInputElement>document.getElementById("institute")).value;
    let id = 0;
    for( let i of this.institutes ) {
      if( i.label == tmp) {
        id = i.id
      }
    }
    console.log(id)
    this.objectService.requestSent();
    this.cephlixS.setInstituteForTicket(this.ticketId,id).subscribe(
      (val) => { this.objectService.responseMessage(val)}
    )
  }
}
