import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wpfe-level-bar-button',
  templateUrl: './level-bar-button.component.html',
  styleUrls: ['./level-bar-button.component.scss']
})
export class LevelBarButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isActive: boolean = false;
  @Input() action: void = undefined;
  @Input() title: string = "";
}
