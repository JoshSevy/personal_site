import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss'],
})
export class SimpleHeaderComponent {
  isStayTuned = false;
  isBlogPage = false;

  constructor() {}
}
