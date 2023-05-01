import { Component, Input, OnInit } from '@angular/core';
import { Themes } from 'src/app/EducationPage/Themes';

@Component({
  selector: 'wpfe-themes-bar-item',
  templateUrl: './themes-bar-item.component.html',
  styleUrls: ['./themes-bar-item.component.scss']
})
export class ThemesBarItemComponent implements OnInit {
  @Input() themeTitle: Themes;
  @Input() isThemeSelected: boolean;

  public cum: number;
  public swallow: number = 15;

  constructor() { }

  ngOnInit(): void {
  }

  public get selectedThemeColor(): string {
    return this.isThemeSelected ? "#49a23f" : "";
  }

  public get selectedThemeJustify(): string {
    return this.isThemeSelected ? "center" : "";
  }

}


export abstract class CumBuster {
  public cum: number;
  public cumEater: number = 10;
  public abstract eatCum(): void;
}

//export function eatCum2(): void {};

export class Children extends CumBuster {
  public override eatCum(): void {}
}

