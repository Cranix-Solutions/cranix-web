import { ChallengesService } from 'src/app/services/challenges.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CrxChallenge, CrxQuestion, CrxQuestionAnswer } from 'src/app/shared/models/data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
})
export class ChallengesComponent implements OnInit {

  title: String = "Tests"
  answerToEdit = ""
  answerType = "One"
  challengeToAssign: CrxChallenge;
  context;
  htmlResult;
  selectedArchive: string;
  selectedChallenge: CrxChallenge;
  selectedChallengeId: number;
  questionToEdit: number = -1;
  questionValue: number = 1;
  isOpen: boolean = false;
  modalGetArchiveIsOpen: boolean = false;
  popoverDeleteChallengeIsOpen: boolean = false;
  popoverStopAndArchiveIsOpen: boolean = false;
  challengeToDelete: number;
  listOfArchives: string[];
  editorStyles = {
    height: '40px',
    backgroundColor: 'whitesmoke'
  }

  @ViewChild('popover') popover;
  constructor(
    public authService: AuthenticationService,
    public challengesService: ChallengesService,
    private languageService: LanguageService,
    public objectService: GenericObjectService,
    public popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer
  ) {
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.objectService.getAllObject('challenge');
  }
  ngAfterViewInit() {
    this.challengesService.modified = false;
    console.log("ngAfterViewInit")
  }
  ngAfterContentInit() {
    this.challengesService.modified = false;
    console.log("ngAfterContentInit")
  }

  close(force: boolean) {
    console.log(this.challengesService.modified)
    if (this.selectedChallenge.released) {
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
    if (this.selectedChallenge.released) {
      return;
    }
    this.answerToEdit = ""
    if (this.questionToEdit == i) {
      this.questionToEdit = -1;
    } else {
      this.questionToEdit = i;
      this.challengesService.modified = true;
    }
  }

  toggleEditAnswer(i, j) {
    if (this.selectedChallenge.released) {
      return;
    }
    this.questionToEdit = -1;
    if (this.answerToEdit == i + "-" + j) {
      this.answerToEdit = ""
    } else {
      this.answerToEdit = i + "-" + j
      this.challengesService.modified = true;
    }
  }

  addNewAnswer(i) {
    let newAnswer: CrxQuestionAnswer = new CrxQuestionAnswer(this.languageService.trans('Answer text.'));
    this.selectedChallenge.questions[i].crxQuestionAnswers.push(newAnswer)
    this.challengesService.modified = true;
  }

  addNewQuestion() {
    let newQuestion: CrxQuestion = new CrxQuestion(this.languageService.trans('Question text.'));
    newQuestion.answerType = this.answerType;
    newQuestion.value = this.questionValue;
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer(this.languageService.trans('Answer text.')))
    newQuestion.crxQuestionAnswers.push(new CrxQuestionAnswer(this.languageService.trans('Answer text.')))
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
    if (this.selectedChallenge.creatorId != this.authService.session.userId) {
      //We overtake an challenge from an other user.
      this.selectedChallenge.id = null
    }
    if (this.selectedChallenge.id) {
      this.challengesService.modify(this.selectedChallenge).subscribe(
        (val) => {
          this.objectService.responseMessage(val)
          this.objectService.getAllObject('challenge')
        }
      )
    } else {
      this.challengesService.add(this.selectedChallenge).subscribe(
        (val) => {
          this.objectService.responseMessage(val)
          if (val.code == "OK") {
            this.selectedChallenge.id = val.objectId;
            this.objectService.getAllObject('challenge')
          }
        }
      )
    }
    this.challengesService.modified = false;
  }

  startAndAssign() {
    this.challengeToAssign.released = true;
    console.log('startAndAssign', this.challengeToAssign)
    this.challengesService.startAndAssign(this.challengeToAssign).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenge')
        this.challengeToAssign = null
      }
    )
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

  deleteChallenge(challengeId: number) {
    if (challengeId) {
      this.challengeToDelete = challengeId;
      this.popoverDeleteChallengeIsOpen = true;
    } else if (this.challengeToDelete) {
      this.challengesService.delete(this.challengeToDelete).subscribe(
        (val) => {
          this.objectService.responseMessage(val)
          this.objectService.getAllObject('challenge')
        }
      )
      this.challengeToDelete = null;
      this.popoverDeleteChallengeIsOpen = false;
    }
  }
  stopAndArchive(challenge: CrxChallenge) {
    if (!this.popoverStopAndArchiveIsOpen) {
      this.popoverStopAndArchiveIsOpen = true
      this.selectedChallengeId = challenge.id
    } else {
      this.objectService.requestSent()
      this.challengesService.stopAndArchive(this.selectedChallengeId).subscribe(
        (val) => {
          this.popoverStopAndArchiveIsOpen = false;
          this.htmlResult = this.sanitizer.bypassSecurityTrustHtml(val);
          this.objectService.getAllObject('challenge')
          this.selectedChallenge = this.objectService.getObjectById("challenge",this.selectedChallengeId);
          this.selectedChallenge.released = false;
          this.selectedChallengeId = null
          console.log(this.htmlResult)
        }
      )
    }
  }


  getArchives(id: number) {
    this.selectedChallengeId = id
    this.challengesService.getArchives(id).subscribe(
      (val) => {
        this.listOfArchives = val
        this.modalGetArchiveIsOpen = true
      }
    )
  }
  downloadArchive() {
    this.modalGetArchiveIsOpen = false;
    this.objectService.requestSent();
    if (!this.selectedArchive) {
      this.selectedArchive = (<HTMLInputElement>document.getElementById('dateOfArchive')).value.toLowerCase();
      this.selectedChallengeId = this.selectedChallenge.id;
      console.log(this.selectedArchive)
    }
    this.challengesService.downloadArchive(this.selectedChallengeId, this.selectedArchive).subscribe({
      next: (x) => {
        console.log(x)
        var newBlob = new Blob([x.body], { type: x.body.type });

        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = x.headers.get('content-disposition').replace('attachment; filename=', '');
        link.click();
        // this is necessary as link.click() does not work on the latest firefox
        //link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        /* var blob = new Blob([val], { type: "text/html;charset=utf-8" })
        var downloader = document.createElement('a');
        downloader.href = URL.createObjectURL(blob);
        downloader.setAttribute('download', this.selectedArchive + ".html");
        downloader.click(); */
      },
      error: (err) => { },
      complete: () => { this.selectedArchive = this.selectedChallengeId = null }
    })
  }

  assign(challenge: CrxChallenge) {
    this.challengeToAssign = challenge;
  }

}
