import { ChallengesService } from 'src/app/services/challenges.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
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
  htmlResult;
  questionToEdit: number = -1;
  answerToEdit = ""
  answerType = "One"
  available: boolean = false;
  archiveLoaded: boolean = false;
  questionValue: number = 1;
  isOpen: boolean = false;
  @ViewChild('popover') popover;
  constructor(
    public challengesService: ChallengesService,
    public objectService: GenericObjectService,
    public popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer
  ) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenge');
  }

  close(force: boolean) {
    if (this.available) {
      this.selectedChallenge = null;
      return
    }
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

  redirectToEdit(data) {
    if (data) {
      this.selectedChallenge = data;
      let now = new Date().getTime();
      let validFrom = new Date(data.validFrom).getTime()
      let validUntil = new Date(data.validUntil).getTime()
      console.log(validFrom, validUntil, now)
      this.available = validFrom < now && validUntil > now;
      let isoString = new Date(data.validFrom).toISOString();
      this.selectedChallenge.validFrom = isoString.substring(0, isoString.indexOf("T") + 6);
      isoString = new Date(data.validUntil).toISOString();
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
    this.challengesService.modified = true;
  }

  toggleEditQuestion(i) {
    if (this.available) {
      return;
    }
    if (this.questionToEdit == i) {
      this.questionToEdit = -1;
    } else {
      this.questionToEdit = i;
      this.challengesService.modified = true;
    }
  }

  toggleEditAnswer(i, j) {
    if (this.available) {
      return;
    }
    if (this.answerToEdit == i + "-" + j) {
      this.answerToEdit = ""
    } else {
      this.answerToEdit = i + "-" + j
      this.challengesService.modified = true;
    }
  }

  addNewAnswer(i) {
    let newAnswer: CrxQuestionAnswer = new CrxQuestionAnswer();
    this.selectedChallenge.questions[i].crxQuestionAnswers.push(newAnswer)
    this.challengesService.modified = true;
  }

  addNewQuestion() {
    let newQuestion: CrxQuestion = new CrxQuestion();
    newQuestion.answerType = this.answerType;
    newQuestion.value = this.questionValue;
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer())
    this.selectedChallenge.questions.push(newQuestion)
    this.challengesService.modified = true;
  }

  deleteQuestion(i) {
    if (!this.selectedChallenge.questions[i].id) {
      this.selectedChallenge.questions.splice(i, 1)
      return
    }
    this.challengesService.deleteQuestion(
      this.selectedChallenge.id,
      this.selectedChallenge.questions[i].id
    ).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenges/challenge')
        this.selectedChallenge.questions.splice(i, 1)
      }
    )
  }

  deleteAnswer(i, j) {
    if (!this.selectedChallenge.questions[i].crxQuestionAnswers[j].id) {
      this.selectedChallenge.questions[i].crxQuestionAnswers.splice(j, 1);
      return
    }
    this.challengesService.deleteAnswer(
      this.selectedChallenge.id,
      this.selectedChallenge.questions[i].id,
      this.selectedChallenge.questions[i].crxQuestionAnswers[j].id
    ).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenges/challenge')
        this.selectedChallenge.questions[i].crxQuestionAnswers.splice(j, 1);
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
    this.challengesService.modified = false;
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

  downloadResults() {
    var date = new Date();
    var blob = new Blob([this.htmlResult.changingThisBreaksApplicationSecurity], { type: "text/html;charset=utf-8" })
    var downloader = document.createElement('a');
    downloader.href = URL.createObjectURL(blob);
    downloader.setAttribute('download', this.selectedChallenge.description + " " + date.toLocaleString() + ".html");
    downloader.click();
  }

  evaluate() {
    this.challengesService.evaluate(this.selectedChallenge.id).subscribe(
      (val) => {
        this.htmlResult = this.sanitizer.bypassSecurityTrustHtml(val);
        console.log(this.htmlResult)
      }
    )
  }

  archive(cleanUp: number) {
    this.challengesService.archive(this.selectedChallenge.id, cleanUp).subscribe(
      (val) => {
        this.htmlResult = this.sanitizer.bypassSecurityTrustHtml(val);
        this.archiveLoaded = true;
        console.log(this.htmlResult)
      }
    )
  }

}
