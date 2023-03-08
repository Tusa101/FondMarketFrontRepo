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

  public levels: LevelItem[] = [];
  private theme: Themes = Themes.All;

  constructor(
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  private getLevels() {
    this.dataService.getLevelsByTheme();
  }

  private filterLevelsByTheme() {
    this.levels = this.levels.filter(item => item.isLevelContainsTheme(this.theme));
  }

  private filterInfoTextByLevel() {  //maybe need rework on future

  }
}
