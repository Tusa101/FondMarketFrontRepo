import { Component, Input, OnInit } from '@angular/core';
import { ThemeItem } from '../EducationPage/education-info-tile/education-info-tile-item';
import { LevelItem } from './level-item';

@Component({
  selector: 'wpfe-level-bar',
  templateUrl: './level-bar.component.html',
  styleUrls: ['./level-bar.component.scss']
})
export class LevelBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() levels: LevelItem[];
  @Input() Theme: ThemeItem;

  public isButtonActive(): boolean {
    return false;
  }
}
