import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-education-info-page',
  templateUrl: './education-info-page.component.html',
  styleUrls: ['./education-info-page.component.scss']
})
export class EducationInfoPageComponent implements OnInit {
  
  @Input() infoText: string = "";

  constructor() { }

  ngOnInit(): void {
  }
  
}
