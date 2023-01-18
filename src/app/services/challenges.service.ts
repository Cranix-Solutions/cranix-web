import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { CrxChallenge } from '../shared/models/data-model';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  hostname: string;

  constructor(
    private http: HttpClient,
    private utilsS: UtilsService,
    private authService: AuthenticationService,
    private objectService: GenericObjectService ) {
    this.hostname = this.utilsS.hostName();
  }

  add(challenge: CrxChallenge) {
    let url = this.hostname + "/challenges"
    this.http.post<ServerResponse>(url, challenge, { headers: this.authService.headers }).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenge')
       }
    )
  }

  modify(challenge: CrxChallenge) {
    let url = this.hostname + "/challenges"
    this.http.patch<ServerResponse>(url, challenge, { headers: this.authService.headers }).subscribe(
      (val) => {
        this.objectService.responseMessage(val)
        this.objectService.getAllObject('challenge')
       }
    )
  }

  delete(challengeId: number) {
    let url = this.hostname + `/challenges/${challengeId}`
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  deleteQuestion(challengeId: number, questionId: number) {
    let url = this.hostname + `/challenges/${challengeId}/${questionId}`
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  deleteAnswer(challengeId: number, questionId: number, answerId: number) {
    let url = this.hostname + `/challenges/${challengeId}/${questionId}/${answerId}`
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  saveChallengeAnswers(challengeId: number, answers: {}) {
    let url = this.hostname + `/challenges/todos/${challengeId}`
    return this.http.post<ServerResponse>(url, answers, { headers: this.authService.headers })
  }

  getMyAnswers(challengeId: number){
    let url = this.hostname + `/challenges/todos/${challengeId}`
    return this.http.get<any>(url, { headers: this.authService.headers })
  }

  evaluate(challengeId: number){
    let url = this.hostname + `/challenges/${challengeId}/results`
    return this.http.get<any>(url, { headers: this.authService.headers })
  }

  archive(challengeId: number, cleanUp: number){
    let url = this.hostname + `/challenges/${challengeId}/archive/${cleanUp}`
    return this.http.get<any>(url, { headers: this.authService.headers })
  }
}
