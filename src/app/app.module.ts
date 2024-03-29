import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EducationInfoPageComponent } from './EducationPage/education-info-page/education-info-page.component';
import { EducationInfoTileComponent } from './EducationPage/education-info-tile/education-info-tile.component';
import { EducationPageComponent } from './EducationPage/education-page/education-page.component';
import { LevelBarComponent } from './levelBar/level-bar.component';
import { LevelBarButtonComponent } from './levelBar/level-bar-button/level-bar-button.component';
import { LevelDropdownComponent } from './level-dropdown/level-dropdown.component';
import { LevelDropdownItemComponent } from './level-dropdown/level-dropdown-item/level-dropdown-item.component';
import { ThemesBarComponent } from './themes-bar/themes-bar.component';
import { ThemesBarItemComponent } from './themes-bar/themes-bar-item/themes-bar-item.component';


@NgModule({
  declarations: [
    AppComponent,
    EducationPageComponent,
    EducationInfoTileComponent,
    EducationInfoPageComponent,
    LevelBarComponent,
    LevelBarButtonComponent,
    LevelDropdownComponent,
    LevelDropdownItemComponent,
    ThemesBarComponent,
    ThemesBarItemComponent
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

