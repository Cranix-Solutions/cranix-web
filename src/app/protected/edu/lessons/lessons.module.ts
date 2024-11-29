import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { ChallengeCanDeactivate } from 'src/app/services/challenges.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { LessonsPage } from './lessons.page';
import { RoomControlComponent } from './room-control/room-control.component';
import { RoomDevComponent } from './room-control/device/roomdev.component';
import { MypositiveComponent } from './mypositive/mypositive.component';
import { ChallengesComponent } from './challenges/challenges.component'
import { TestsComponent } from './tests/tests.component'
import { PtmsComponent } from './ptms/ptms.component';

const routes: Routes = [
  {
    path: 'lessons',
    canActivate: [CanActivateViaAcls],
    component: LessonsPage,
    children: [
      {
        path: 'ptms',
        component: PtmsComponent
      },
      {
        path: 'tests',
        canDeactivate: [ChallengeCanDeactivate],
        component: TestsComponent
      },
      {
        path: 'challenges',
        canDeactivate: [ChallengeCanDeactivate],
        component: ChallengesComponent
      },
      {
        path: 'roomcontrol',
        component: RoomControlComponent
      },

      {
        path: 'mypositive',
        component: MypositiveComponent
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
    CranixSharedModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    QuillModule.forRoot()
  ],
  declarations: [
    LessonsPage,
    RoomControlComponent,
    ChallengesComponent,
    RoomDevComponent,
    MypositiveComponent,
    PtmsComponent,
    TestsComponent
  ],
  providers:
    [ChallengeCanDeactivate]
})
export class LessonsModule { }
