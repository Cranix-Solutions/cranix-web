import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { LessonsPage } from './lessons.page';
import { EductaionService } from 'src/app/services/education.service';
import { RoomControlComponent } from './room-control/room-control.component';
import { RoomDevComponent } from './room-control/device/roomdev.component';
import { MypositiveComponent } from './mypositive/mypositive.component';
import { ChallengesComponent } from './challenges/challenges.component'
import { TestsComponent } from './tests/tests.component'
import { QuillModule, QuillConfig } from 'ngx-quill';
import { ChallengeCanDeactivate } from 'src/app/services/challenges.service';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

const routes: Routes = [
  {
    path: 'lessons',
    canActivate: [CanActivateViaAcls],
    component: LessonsPage,
    children: [
      {
        path: 'tests',
        canDeactivate: [ChallengeCanDeactivate],
        component:TestsComponent
      },
      {
        path: 'challenges',
        canDeactivate: [ChallengeCanDeactivate],
        component:ChallengesComponent
      },
      {
        path: 'roomcontrol',
        component:RoomControlComponent
      },
      
      {
        path: 'mypositive',
        component:MypositiveComponent
      },
      {
        path: '',
        redirectTo: 'tests', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    CranixSharedModule,
    QuillModule.forRoot()
  ],
  declarations: [LessonsPage,RoomControlComponent,ChallengesComponent,RoomDevComponent,MypositiveComponent,TestsComponent],
  providers: [TranslateService, PipesModule, EductaionService, ChallengeCanDeactivate]
})
export class LessonsModule {}
