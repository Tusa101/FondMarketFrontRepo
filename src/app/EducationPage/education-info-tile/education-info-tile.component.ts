import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data-service';
import { ThemeItem } from './education-info-tile-item';

@Component({
  selector: 'wpfe-education-info-tile',
  templateUrl: './education-info-tile.component.html',
  styleUrls: ['./education-info-tile.component.scss']
})
export class EducationInfoTileComponent implements OnInit {
  @Input() imgPath: string = "";

  constructor(
  ) {
    
  }
  
  ngOnInit(): void {
  }

}
