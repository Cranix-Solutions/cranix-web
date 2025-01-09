import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { RegisterPTMComponent } from './register-ptm/register-ptm.component';
const routes: Routes = [
  {
    path: '',
    children: [
        { 
          path: 'registerPTM/:id',
          component: RegisterPTMComponent
        }
    ]
  }
];

@NgModule({
  imports: [
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule,RegisterPTMComponent],
  declarations: [RegisterPTMComponent]
})
export class TrustedModule {}
