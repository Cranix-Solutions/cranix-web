import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { ShowScreenshotComponent } from 'src/app/public/show-screenshot/show-screenshot.component'

const routes: Routes = [
  {
    path: '',
    children: [
        { 
          path: 'showScreen',
          component: ShowScreenshotComponent
        }
    ]
  }
];

@NgModule({
  imports: [
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule,ShowScreenshotComponent],
  declarations: [ShowScreenshotComponent]
})
export class PublicPageModule {}
