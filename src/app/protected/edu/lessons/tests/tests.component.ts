import { Component, OnInit } from '@angular/core';
import { ChallengesService } from 'src/app/services/challenges.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CrxChallenge } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['../challenges/challenges.component.scss', './tests.component.scss'],
})
export class TestsComponent implements OnInit {

  context
  selectedChallenge: CrxChallenge;

  constructor(
    public challengesService: ChallengesService,
    public objectService: GenericObjectService) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenges/todo')
    this.selectedChallenge = null
  }

  redirectToEdit(data) {
    if (data) {
      console.log(data)
      this.selectedChallenge = data;
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
  }

}
