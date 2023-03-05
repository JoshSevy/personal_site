import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class BlogHomeComponent implements OnInit {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.loading$.next(false);
    }, 2000);
  }
}
