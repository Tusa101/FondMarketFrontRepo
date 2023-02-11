import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './EducationPage/data-service';
import { EducationInfoPageComponent } from './EducationPage/education-info-page/education-info-page.component';
import { EducationInfoTileComponent } from './EducationPage/education-info-tile/education-info-tile.component';
import { EducationPageComponent } from './EducationPage/education-page/education-page.component';


@NgModule({
  declarations: [
    AppComponent,
    EducationPageComponent,
    EducationInfoTileComponent,
    EducationInfoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
