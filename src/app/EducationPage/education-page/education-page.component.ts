import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data-service';
import { ThemeItem } from '../education-info-tile/education-info-tile-item';

@Component({
  selector: 'wpfe-education-page',
  templateUrl: './education-page.component.html',
  styleUrls: ['./education-page.component.scss']
})
export class EducationPageComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) {

  }

  public tileList: ThemeItem[] = this.dataService.themesList;

  ngOnInit(): void {
  }

}
