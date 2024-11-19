import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//own
import { Ticket, Article, Institute } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { WindowRef } from 'src/app/shared/models/ohters';
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
  instObject: ObjectList = new ObjectList;
  articleOpen = {};
  ticketCreator: User;
  workers: User[];
  nativeWindow: any
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public objectService: GenericObjectService,
    private authService: AuthenticationService,
    private cephlixS: CephalixService,
    private modalController: ModalController,
    private win: WindowRef
  ) {
    this.nativeWindow = win.getNativeWindow();
    this.ticketId = this.route.snapshot.params.id;
    console.log("Ticket details constructor called", this.ticketId)
  }

  ngOnInit() {
    console.log("Ticket details ngOnInit called", this.ticketId)
    this.cephlixS.getTicketById(this.ticketId).subscribe({
      next: (val) => {
        console.log("getTicketById was called", this.ticketId)
        this.workers = this.objectService.allObjects['user'].filter(o => o.role == 'sysadmins').sort((a, b) => a.fullName > b.label ? 0 : 1);
        this.ticket = val;
        this.ticketCreator = this.objectService.getObjectById('user', this.ticket.creatorId);
        this.institute = this.objectService.getObjectById('institute', this.ticket.cephalixInstituteId);
        this.readArcticles();
        for (let i of this.objectService.allObjects['institute']) {
          this.institutes.push({ id: i.id, label: i.name + " " + i.locality })
        }
        console.log(this.institutes, this.institute)
        if (this.institute) {
          this.instObject.id = this.institute.id
          this.instObject.label = this.institute.name + " " + this.institute.locality
        } else {
          this.institute = new Institute()
          this.instObject = new ObjectList()
        }
      },
      error: (err) => { console.log(err) },
      complete: () => { }
    })
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  public readArcticles() {
    this.articles = [];
    this.cephlixS.getArticklesOfTicket(this.ticketId).subscribe(
      (val) => {
        this.articles = val
      }
    );
  }

  public assigneTicketToMe() {
    this.ticket.creatorId = this.authService.session.userId;
    this.ticketCreator.fullName = this.authService.session.fullName;
    this.ticketCreator.id = this.authService.session.userId;
    this.cephlixS.modifyTicket(this.ticket).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
        this.objectService.getAllObject('ticket');
      },
      error: (err) => {
        this.objectService.errorMessage(err)
      }
    })
  }

  public setCreator() {
    this.ticket.creatorId = this.ticketCreator.id
    this.cephlixS.modifyTicket(this.ticket).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
        this.objectService.getAllObject('ticket');
      },
      error: (err) => {
        this.objectService.errorMessage(err)
      }
    })
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
    this.objectService.requestSent();
    this.cephlixS.setInstituteForTicket(this.ticketId, this.instObject.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.institute = this.objectService.getObjectById('institute', this.instObject.id);
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

  public routeSchool(event) {
    event.stopPropagation();
    var hostname = window.location.hostname;
    var protocol = window.location.protocol;
    var port = window.location.port;
    let sub = this.cephlixS.getInstituteToken(this.institute.id)
      .subscribe({
        next: (res) => {
          console.log("Get token from:" + this.institute.uuid)
          console.log(res);
          if (res) {
            sessionStorage.setItem('shortName', this.institute.uuid);
            sessionStorage.setItem('instituteName', this.institute.name);
            sessionStorage.setItem('cephalix_token', res);
            if (port) {
              this.nativeWindow.open(`${protocol}//${hostname}:${port}`);
              sessionStorage.removeItem('shortName');
            } else {
              this.nativeWindow.open(`${protocol}//${hostname}`);
              sessionStorage.removeItem('shortName');
            }
          }
        },
        error: (err) => { console.log(err) },
        complete: () => { sub.unsubscribe() }
      })
  }

  isHTML(s: string) {
    //var htmlRegex = new RegExp("<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)</\1>");
    var htmlRegex = new RegExp("<\/?[a-z][\s\S]*>");
    return htmlRegex.test(s);
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
  files = [];

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

  onFilesAdded(event) {
    this.files = event.target.files;
  }

  addAttachment() {
    console.log("addP")
    for (let file of this.files) {
      this.article.attachmentName = file.name;
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        let index = e.target.result.toString().indexOf("base64,") + 7;
        this.article.attachment = e.target.result.toString().substring(index);
      }
      fileReader.readAsDataURL(file);
    }
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
