import { Component, OnInit} from '@angular/core';
//own modules
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-lessons',
  templateUrl: './lessons.page.html',
})

export class LessonsPage implements OnInit {

    constructor(public authS: AuthenticationService){
    }
    ngOnInit(){
    }
}