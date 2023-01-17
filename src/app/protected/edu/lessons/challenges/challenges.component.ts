import { ChallengesService } from 'src/app/services/challenges.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CrxChallenge, CrxQuestion, CrxQuestionAnswer } from 'src/app/shared/models/data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
})
export class ChallengesComponent implements OnInit {

  title: String = "Tests"
  context;
  selectedChallenge: CrxChallenge;
  questionToEdit: number = -1;
  answerToEdit = ""
  answerType = "One"
  questionValue: number = 1;
  modified: boolean = false;
  isOpen: boolean = false;
  @ViewChild('popover') popover;

  constructor(
    public challengesService: ChallengesService,
    public objectService: GenericObjectService,
    public popoverCtrl: PopoverController
  ) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenge');
  }

  close(force: boolean){
    if(force){
      this.isOpen = false
      this.popover.dismiss();
      this.selectedChallenge = null;
      return
    }
    if(this.modified){
      this.isOpen = true
    } else {
      this.selectedChallenge = null;
    }
  }

  redirectToEdit(data) {
    if (data) {
      this.selectedChallenge = data;
      let isoString = new Date(this.selectedChallenge.validFrom).toISOString();
      this.selectedChallenge.validFrom = isoString.substring(0, isoString.indexOf("T") + 6);
      isoString = new Date(this.selectedChallenge.validUntil).toISOString();
      this.selectedChallenge.validUntil = isoString.substring(0, isoString.indexOf("T") + 6);
    } else {
      this.selectedChallenge = new CrxChallenge();
    }
    console.log(this.selectedChallenge)
  }

  toggle(i, j) {
    let correct = this.selectedChallenge.questions[i].crxQuestionAnswers[j].correct;
    if (this.selectedChallenge.questions[i].answerType == "One") {
      for (let k = 0; k < this.selectedChallenge.questions[i].crxQuestionAnswers.length; k++) {
        if (k != j) {
          this.selectedChallenge.questions[i].crxQuestionAnswers[k].correct = false
        } else {
          this.selectedChallenge.questions[i].crxQuestionAnswers[j].correct = true
        }
      }
    } else {
      this.selectedChallenge.questions[i].crxQuestionAnswers[j].correct = !correct
    }
    this.modified = true;
  }

  toggleEditQuestion(i) {
    if (this.questionToEdit == i) {
      this.questionToEdit = -1;
    } else {
      this.questionToEdit = i;
      this.modified = true;
    }
  }

  toggleEditAnswer(i, j) {
    if (this.answerToEdit == i + "-" + j) {
      this.answerToEdit = ""
    } else {
      this.answerToEdit = i + "-" + j
      this.modified = true;
    }
  }

  addNewAnswer(i) {
    let newAnswer: CrxQuestionAnswer = new CrxQuestionAnswer();
    this.selectedChallenge.questions[i].crxQuestionAnswers.push(newAnswer)
    this.modified = true;
  }

  addNewQuestion() {
    let newQuestion: CrxQuestion = new CrxQuestion();
    newQuestion.answerType = this.answerType;
    newQuestion.value = this.questionValue;
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    this.selectedChallenge.questions.push(newQuestion)
    this.modified = true;
  }

  deleteQuestion(i) {
    this.challengesService.deleteQuestion(
      this.selectedChallenge.id,
      this.selectedChallenge.questions[i].id
      ).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenges/challenge')
        this.selectedChallenge.questions.splice(i,1)
      }
    )
  }

  deleteAnswer(i,j) {
    this.challengesService.deleteAnswer(
      this.selectedChallenge.id,
      this.selectedChallenge.questions[i].id,
      this.selectedChallenge.questions[i].crxQuestionAnswers[j].id
      ).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenges/challenge')
        this.selectedChallenge.questions[i].crxQuestionAnswers.splice(j,1);
      }
    )
  }

  save() {
    console.log(this.selectedChallenge)
    if (this.selectedChallenge.id) {
      this.challengesService.modify(this.selectedChallenge)
    } else {
      this.challengesService.add(this.selectedChallenge)
    }
    this.modified = false;
  }

  async openActions(ev: any, object: CrxChallenge) {
    if (object) {
      this.objectService.selectedIds.push(object.id)
      this.objectService.selection.push(object)
    } else {
      if (this.objectService.selection.length == 0) {
        this.objectService.selectObject();
        return;
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "challenges/challenge",
        objectIds: this.objectService.selectedIds,
        selection: this.objectService.selection,
        gridApi: null
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

}
