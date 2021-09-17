import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//own
import { Ticket, Article, Institute } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ModalController } from '@ionic/angular';
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
  articleOpen = {};
  constructor(
    private route: ActivatedRoute,
    public  router: Router,
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
           for (let i of this.objectService.allObjects['institute']) {
             this.institutes.push({ id: i.id, label: i.name + " " + i.locality })
           }
           this.institute = new Institute();
           console.log(this.institutes, this.institute)
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
    article.text = "Hallo "+this.ticket.firstname + " " + this.ticket.lastname + ",<br><br>"
      "Viele Grüße<br>Cranix-Solutions-Support-Team<br><br>" +
      "--------------------------------------------" + article.text
    article.title = this.ticket.firstname + " " + this.ticket.lastname;
    const modal = await this.modalController.create({
      component: EditArticle,
      cssClass: "big-modal",
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
    let sub = this.cephlixS.deleteArticle(article.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        if (val.code == "OK") {
          this.readArcticles();
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe() })
  }
  public setSeenOnArticle(article: Article) {
    let sub = this.cephlixS.setSeenOnArticle(article.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        if (val.code == "OK") {
          this.readArcticles();
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe() })
  }

  public setInstitute() {
    let tmp = (<HTMLInputElement>document.getElementById("institute")).value;
    let id = 0;
    for (let i of this.institutes) {
      if (i.label == tmp) {
        id = i.id
      }
    }
    console.log(id)
    this.objectService.requestSent();
    this.cephlixS.setInstituteForTicket(this.ticketId, id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.institute = this.objectService.getObjectById('institute', id);
      }
    )
  }

  toggleArticle(id) {
    if( this.articleOpen[id] ) {
      (<HTMLInputElement>document.getElementById("article" + id)).style.height = "50px"
      this.articleOpen[id] = false
    } else {
      (<HTMLInputElement>document.getElementById("article" + id)).style.height = "100%"
      this.articleOpen[id] = true
    }
  }
}

@Component({
  selector: 'cranix-edit-article',
  templateUrl: './edit-article.html'
  //styleUrls: ['./edit-article.scss'],
})
export class EditArticle implements OnInit {

  @Input() article: Article;
  @Input() ticket: Ticket;
  text: string = "";

  constructor(
    private cephalixService: CephalixService,
    public modalController: ModalController,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    let newText: string[] = [];
    for (let line of this.article.text.split("\n")) {
      newText.push(">" + line);
    }
    this.text = newText.join("\n");
  }

  sendArticle() {
    this.article.recipient = this.article.sender;
    this.article.articleType = 'O';
    let sub = this.cephalixService.addArticleToTicket(this.article, this.ticket.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        if (val.code == "OK") {
          this.modalController.dismiss();
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe() })
    //TODO
  }

}
