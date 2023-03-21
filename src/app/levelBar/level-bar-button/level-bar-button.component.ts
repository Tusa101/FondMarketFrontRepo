import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LevelItem } from '../level-item';

@Component({
  selector: 'wpfe-level-bar-button',
  templateUrl: './level-bar-button.component.html',
  styleUrls: ['./level-bar-button.component.scss']
})
export class LevelBarButtonComponent implements OnInit {
  @Input() isActive?: boolean;
  @Input() action?: void;
  @Input() level: LevelItem;

  constructor() {
  }

  ngOnInit(): void {

  }

  public some(){

  }

}
