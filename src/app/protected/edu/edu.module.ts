import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA }            from '@angular/core';
import { CommonModule }  from '@angular/common';
import { LessonsModule } from './lessons/lessons.module';
//Own Stuff
import { CranixSharedModule }            from 'src/app/shared/cranix-shared.module';

@NgModule({
  declarations: [],
  imports: [
    CranixSharedModule,
    CommonModule,
    LessonsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class EduModule { }
