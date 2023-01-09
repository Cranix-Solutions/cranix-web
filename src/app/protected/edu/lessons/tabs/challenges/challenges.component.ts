import { ChallengesService } from 'src/app/services/challenges.service';
import { Component, OnInit } from '@angular/core';
import { CrxChallenge, CrxQuestion, CrxQuestionAnswer } from 'src/app/shared/models/data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';

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
  modified: boolean = false;
  constructor(
    public challengesService: ChallengesService,
    public objectService: GenericObjectService
  ) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenge');
  }

  redirectToEdit(data) {
    if (data) {
      console.log(data)
      this.selectedChallenge = data;
      let isoString = new Date(this.selectedChallenge.validFrom).toISOString();
      this.selectedChallenge.validFrom = isoString.substring(0, isoString.indexOf("T") + 6);
      isoString = new Date(this.selectedChallenge.validUntil).toISOString();
      this.selectedChallenge.validUntil = isoString.substring(0, isoString.indexOf("T") + 6);
    } else {
      this.selectedChallenge = new CrxChallenge();
    }
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
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    this.selectedChallenge.questions.push(newQuestion)
    this.modified = true;
  }

  deleteQuestion(i) {
    this.selectedChallenge.questions.splice(i,1)
    this.modified = true;
  }

  deleteAnswer(i,j) {
    this.selectedChallenge.questions[i].crxQuestionAnswers.splice(j,1);
    this.modified = true;
  }

  save() {
    console.log(this.selectedChallenge)
    if (this.selectedChallenge.id) {
      this.challengesService.modify(this.selectedChallenge)
    } else {
      this.challengesService.add(this.selectedChallenge)
    }
  }
}
