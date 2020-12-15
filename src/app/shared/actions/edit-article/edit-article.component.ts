import { Component, OnInit, Input } from '@angular/core';
import { Article, Ticket } from '../../models/cephalix-data-model';
import { ModalController } from '@ionic/angular';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
})
export class EditArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() ticket: Ticket;
  text: string = "";
  
  constructor(
    private cephalixService: CephalixService,
    public modalController:  ModalController,
    public objectService:    GenericObjectService
  ) { }

  ngOnInit() {
    let newText: string[] = [];
    for(let line of this.article.text.split("\n")) {
      newText.push(">" +line);
    }
    this.text = newText.join("\n");
  }

  sendArticle(){
    this.article.text = this.text;
    this.article.recipient = this.article.sender;
    this.article.articleType = 'O';
    let sub = this.cephalixService.addArticleToTicket(this.article,this.ticket.id).subscribe(
      (val) => { 
        this.objectService.responseMessage(val)
        if(val.code == "OK") {
          this.modalController.dismiss();
        }
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe() }   )
    //TODO
  }
}
