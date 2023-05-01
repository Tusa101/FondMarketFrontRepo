import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeItem } from '../EducationPage/education-info-tile/education-info-tile-item';
import { LevelItem } from './level-item';
import { Themes } from '../EducationPage/Themes';
import { DataService } from '../data-service';

@Component({
  selector: 'wpfe-level-bar',
  templateUrl: './level-bar.component.html',
  styleUrls: ['./level-bar.component.scss']
})
export class LevelBarComponent implements OnInit {
  @Input() mode: BarMode;
  @Input() selectedLevels: LevelItem[] = [];
  @Input() levels: LevelItem[];
  @Input() theme: Themes;
  @Output() activeLevels = new EventEmitter<LevelItem[]>();

  constructor(
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  public changeSelectedLevels(level: LevelItem) {
    if (this.isButtonActive(level)) {
      this.selectedLevels = this.selectedLevels.filter(item => item.title != level.title);
    }
    else {
      this.selectedLevels.push(level);
    }
    this.activeLevels.emit(this.selectedLevels);
  }

  public isButtonAvailable(level: LevelItem): boolean {
    if (this.mode === BarMode.level) {
      return this.dataService.themesList.find(item => item.title === this.theme)?.activeLevels?.some(item => item == level.title) ?? false;
    }
    return true;
  }

  public isButtonActive(level: LevelItem): boolean {
    return this.selectedLevels?.some(item => item.title === level.title);
  }
}

export enum BarMode {
  level,
  HotKeys
}
