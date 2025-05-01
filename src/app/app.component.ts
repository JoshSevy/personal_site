import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorBoundaryComponent } from './components/error-boundary/error-boundary.component';
import { ApolloModule } from 'apollo-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ErrorBoundaryComponent, ApolloModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private konamiIndex = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === this.konamiCode[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiCode.length) {
        this.router.navigate(['/terminal']);
        this.konamiIndex = 0;
      }
    } else {
      this.konamiIndex = 0;
    }
  }
}
