import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LevelItem } from 'src/app/levelBar/level-item';
import { DataService } from '../../data-service';
import { Themes } from '../Themes';

@Component({
  selector: 'wpfe-education-info-page',
  templateUrl: './education-info-page.component.html',
  styleUrls: ['./education-info-page.component.scss']
})
export class EducationInfoPageComponent implements OnInit {
  public levels: number[] = this.dataService.themesList?.find(item => item.title === this.theme)?.activeLevels ?? []; //REWORK 
  private selectedLevels: LevelItem[] = [];
  public hotKeys: LevelItem[] = this.dataService.getHotKey();
  public theme: Themes;

  constructor(
    private route: ActivatedRoute,
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.theme = params['id'];
    })
  }

  public getLevels(): LevelItem[] {
    return this.dataService.levelList;
  }

  public getText(): string {
    return this.dataService.getFullThemeText(this.theme, this.selectedLevels.map(item => item.title as number)); //REWORK
  }

  public getHotKeys() {
    return this.hotKeys;
  }

  public changeSelectedLevels(selectedLevels: LevelItem[]) {
    this.selectedLevels = selectedLevels;
  }
}
