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
import { QuillModule } from 'ngx-quill';

const routes: Routes = [
  {
    path: 'lessons',
    canActivate: [CanActivateViaAcls],
    component: LessonsPage,
    children: [
      {
        path: 'tests',
        component:TestsComponent
      },
      {
        path: 'challenges',
        component:ChallengesComponent
      },
      {
        path: 'roomcontrol',
        component:RoomControlComponent
      },
      
      {
        path: 'mypositive',
        component:MypositiveComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'lessons/challenges', pathMatch: 'full'
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
  providers: [TranslateService, PipesModule,EductaionService]
})
export class LessonsModule {}
