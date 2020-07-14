import { Component, OnInit} from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

//own modules
import { LanguageService } from 'src/app/services/language.service';
import { Group } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { EductaionService } from 'src/app/services/education.service';

@Component({
  selector: 'cranix-lessons',
  templateUrl: './lessons.page.html',
})

export class LessonsPage implements OnInit {

    constructor(private eduS: EductaionService){

    }
    ngOnInit(){

    }
}