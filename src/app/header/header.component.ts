import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mobileMenuOpen = false;
  constructor(private darkModeService: DarkModeService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
