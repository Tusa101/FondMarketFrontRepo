import { Component, Input, OnInit } from '@angular/core';
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

  @Input() levels: LevelItem[] = [];

}
