import { Component, OnInit, ViewChild } from '@angular/core';
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
  modified: boolean = false;
  isOpen: boolean = false;
  @ViewChild('popover') popover;
  constructor(
    public challengesService: ChallengesService,
    public objectService: GenericObjectService) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenges/todo')
    this.selectedChallenge = null
  }

  redirectToEdit(data: CrxChallenge) {
    if (data) {
      console.log(data)
      this.selectedChallenge = data;
    }
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

  save(){
    let answers = {}
    for( let question of this.selectedChallenge.questions ) {
      for( let answer of question.crxQuestionAnswers ) {
        answers[answer.id] = answer.correct
      }
    }
    this.challengesService.saveChallengeAnswers(this.selectedChallenge.id,answers).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val)
        if( val.code = "OK" ){
          this.selectedChallenge = null
        }
      },
      error: (error) => {
        this.objectService.errorMessage(error)
      }
    })
  }
}

