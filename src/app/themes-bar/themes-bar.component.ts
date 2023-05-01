import { Component, Input, OnInit } from '@angular/core';
import { Themes } from '../EducationPage/Themes';
import { DataService } from '../data-service';

@Component({
  selector: 'wpfe-themes-bar',
  templateUrl: './themes-bar.component.html',
  styleUrls: ['./themes-bar.component.scss']
})
export class ThemesBarComponent implements OnInit {
  @Input() actualTheme: Themes;

  constructor(
    private readonly dataService: DataService
  ) { }

  public get themeList(): Themes[] {
    return this.dataService.themesList.map(item => item.title);
  }

  public isThemeSelected(theme: Themes): boolean {
    return this.actualTheme === theme;
  }

  ngOnInit(): void {
  }

}
