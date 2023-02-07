import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class BlogHomeComponent implements OnInit {
  loading = true;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
