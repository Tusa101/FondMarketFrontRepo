import { Component, Input, OnInit } from '@angular/core';
import { LevelItem } from 'src/app/levelBar/level-item';
import { DataService } from '../../data-service';
import { Themes } from '../Themes';

@Component({
  selector: 'wpfe-education-info-page',
  templateUrl: './education-info-page.component.html',
  styleUrls: ['./education-info-page.component.scss']
})
export class EducationInfoPageComponent implements OnInit {

  @Input() infoText: string = "";

  public levels: number[] = this.dataService.levelList.map(item => item.title as number); //REWORK 
  public hotKeys: LevelItem[] = this.dataService.getHotKey();
  private theme: Themes = Themes.theme1;

  constructor(
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  public getLevels(): LevelItem[] {
    return this.dataService.levelList;
  }

  public getText(): string {
    console.log(this.dataService.getFullThemeText(this.theme, this.levels));
    return this.dataService.getFullThemeText(this.theme, this.levels);
  }

  public getHotKeys() {
    return this.hotKeys;
  }

  private filterLevelsByTheme() {
    //this.levels = this.levels.filter(item => item.isLevelContainsTheme(this.theme));
  }

  private filterInfoTextByLevel() {  //maybe need rework on future

  }
}
