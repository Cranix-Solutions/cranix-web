import { Component, OnInit} from '@angular/core';
//own modules
import { ChallengesService } from 'src/app/services/challenges.service';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-lessons',
  templateUrl: './lessons.page.html',
})

export class LessonsPage implements OnInit {

    constructor(
      public challengesService: ChallengesService,
      public authS: AuthenticationService
    ){}

    ngOnInit(){
    }

    cleanUp(){
      console.log("cleanUp called")
      this.challengesService.modified = false;
    }
}