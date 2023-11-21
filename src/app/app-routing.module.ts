import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationInfoPageComponent } from './EducationPage/education-info-page/education-info-page.component';
import { EducationPageComponent } from './EducationPage/education-page/education-page.component';

export const routes: Routes = [
  { path: 'education-page', component: EducationPageComponent },
  { path: 'education-info/:id', component: EducationInfoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
