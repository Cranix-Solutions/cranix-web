import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { ShowScreenshotComponent } from './show-screenshot/show-screenshot.component'
import { PrintPageComponent } from './print-page/print-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'showScreen',
          component: ShowScreenshotComponent
        },
        {
          path: 'printPage',
          component: PrintPageComponent
        }
    ]
  }
];

@NgModule({
  imports: [
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule,ShowScreenshotComponent,PrintPageComponent],
  declarations: [ShowScreenshotComponent,PrintPageComponent]
})
export class PublicPageModule {}
