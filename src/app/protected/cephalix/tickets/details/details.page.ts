import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//own
import { Ticket, Article, Institute } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
class ObjectList {
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
  institutes: ObjectList[] = [];
  allInstitutes: ObjectList[] = [];
  articleOpen = {};
  ticketOwner: string = "";
  ticketOwnerId: number;
  ticketWorkers: ObjectList[] = [];
  constructor(
    private route: ActivatedRoute,
    public  router: Router,
    public  objectService: GenericObjectService,
    private authService: AuthenticationService,
    private cephlixS: CephalixService,
    private modalController: ModalController
  ) {
    this.ticketId = this.route.snapshot.params.id;
  }

  async ngOnInit() {
    while(!this.objectService.isInitialized() ) {
      await new Promise(f => setTimeout(f, 1000));
    }
    for (let i of this.objectService.allObjects['user']) {
      if (i.role == 'sysadmins') {
        this.ticketWorkers.push({ id: i.id, label: i.fullName })
      }
    }
    console.log("Ticket workers" + this.ticketWorkers)
    this.ticketWorkers.sort((a,b) => a.label < b.label ? 0:1  )
    let sub = this.cephlixS.getTicketById(this.ticketId).subscribe(
      (val) => {
        console.log(val)
        this.ticket = val;
        let ticketOwnerObject: User = this.objectService.getObjectById('user', this.ticket.ownerId);
        this.institute = this.objectService.getObjectById('institute', val.cephalixInstituteId);
        this.readArcticles();
        if (!this.institute) {
          for (let i of this.objectService.allObjects['institute']) {
            this.institutes.push({ id: i.id, label: i.name + " " + i.locality })
          }
          this.institute = new Institute();
          console.log(this.institutes, this.institute)
        }
        if (ticketOwnerObject) {
          this.ticketOwnerId = ticketOwnerObject.id;
          this.ticketOwner = ticketOwnerObject.fullName;
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

  public assigneTicketToMe() {
    this.ticket.ownerId = this.authService.session.userId;
    this.ticketOwner = this.authService.session.fullName;
    this.cephlixS.modifyTicket(this.ticket).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.objectService.getAllObject('ticket');
      },
      (err) => {
        this.objectService.errorMessage(err)
      }
    )
  }

  public setOwner() {
    let tmp = (<HTMLInputElement>document.getElementById("ownerId")).value;
    let id = 0;
    for (let i of this.ticketWorkers) {
      if (i.label == tmp) {
        id = i.id
        break
      }
    }
    this.ticket.ownerId = id
    console.log(this.ticket)
    this.cephlixS.modifyTicket(this.ticket).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.objectService.getAllObject('ticket');
      },
      (err) => {
        this.objectService.errorMessage(err)
      }
    )
  }

  async answerArticle(article: Article) {
    if (!article.sender) {
      article.sender = this.ticket.email;
    }
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
        this.objectService.getAllObject('ticket');
      }
    )
  }

  toggleArticle(id) {
    if (this.articleOpen[id]) {
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
  newText: string = "";
  disabled: boolean = false;

  constructor(
    private cephalixService: CephalixService,
    public modalController: ModalController,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    console.log(this.article)
    this.newText = "".concat(
      "Hallo " + this.ticket.firstname + " " + this.ticket.lastname + ",<br><br>",
      "Viele Grüße<br>Cranix-Solutions-Support-Team<br><br>",
      "--------------------------------------------<br>",
      this.article.text
    )
    console.log(this.newText)
  }

  sendArticle() {
    this.article.recipient = this.article.sender;
    this.article.articleType = 'O';
    this.article.text = this.newText;
    this.disabled = true;
    this.objectService.requestSent();
    let sub = this.cephalixService.addArticleToTicket(this.article, this.ticket.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        if (val.code == "OK") {
          this.modalController.dismiss();
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => {
        this.disabled = false
        sub.unsubscribe()
      }
    )
  }

}
