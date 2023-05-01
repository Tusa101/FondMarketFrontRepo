import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LevelItem } from '../level-item';

@Component({
  selector: 'wpfe-level-bar-button',
  templateUrl: './level-bar-button.component.html',
  styleUrls: ['./level-bar-button.component.scss']
})
export class LevelBarButtonComponent implements OnInit {
  @Input() isActive: boolean;
  @Input() isAvailable: boolean;
  @Input() action?: void;
  @Input() level: LevelItem;

  constructor() {
  }

  ngOnInit(): void {

  }

  public buttonActiveColor(): string {
    return this.isActive ? "" : "#89898945";
  }

  public some() {

  }
}
