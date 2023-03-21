import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data-service';
import { EducationInfoPageComponent } from './EducationPage/education-info-page/education-info-page.component';
import { EducationInfoTileComponent } from './EducationPage/education-info-tile/education-info-tile.component';
import { EducationPageComponent } from './EducationPage/education-page/education-page.component';
import { LevelBarComponent } from './levelBar/level-bar.component';
import { LevelBarButtonComponent } from './levelBar/level-bar-button/level-bar-button.component';


@NgModule({
  declarations: [
    AppComponent,
    EducationPageComponent,
    EducationInfoTileComponent,
    EducationInfoPageComponent,
    LevelBarComponent,
    LevelBarButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
