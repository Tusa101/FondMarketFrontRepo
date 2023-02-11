import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data-service';
import { InfoTileItem } from '../education-info-tile/education-info-tile-item';

@Component({
  selector: 'app-education-page',
  templateUrl: './education-page.component.html',
  styleUrls: ['./education-page.component.scss']
})
export class EducationPageComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) {
    
  }

  public tileList: InfoTileItem[] = this.dataService.infoTileList;

  ngOnInit(): void {
  }

}
