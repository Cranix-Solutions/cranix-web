import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
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
  isOpen: boolean = false;
  autoSave: boolean = true;
  @ViewChild('popover') popover;
  constructor(
    public authService: AuthenticationService,
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
      this.challengesService.getMyAnswers(data.id).subscribe(
        (val) => {
          console.log(val)
          if (val.code) {
            this.objectService.responseMessage(val)
          } else {
            let i = 0;
            let j = 0;
            for (let question of this.selectedChallenge.questions) {
              j = 0;
              for (let answer of question.crxQuestionAnswers) {
                if (val[answer.id]) {
                  this.selectedChallenge.questions[i].crxQuestionAnswers[j].correct = true
                } else {
                  this.selectedChallenge.questions[i].crxQuestionAnswers[j].correct = false
                }
                j++;
              }
              i++;
            }
          }
        }
      )
    }
  }

  close(force: boolean) {
    if (force) {
      this.isOpen = false
      this.popover.dismiss();
      this.selectedChallenge = null;
      return
    }
    if (this.challengesService.modified) {
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
    this.challengesService.modified = true;
    if (this.autoSave) {
      this.save(true);
    }
  }

  save(silent: boolean) {
    let answers = {}
    for (let question of this.selectedChallenge.questions) {
      for (let answer of question.crxQuestionAnswers) {
        answers[answer.id] = answer.correct
      }
    }
    this.challengesService.saveChallengeAnswers(this.selectedChallenge.id, answers).subscribe({
      next: (val) => {
        if (!silent || val.code != "OK") {
          this.objectService.responseMessage(val)
        }
        if (val.code == "OK") {
          this.challengesService.modified = false;
        }
      },
      error: (error) => {
        this.objectService.errorMessage(error)
      }
    })
  }
}

