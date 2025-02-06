import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeKey = 'dark-mode';

  constructor() {
    this.loadTheme();
  }

  toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDark));
  }

  loadTheme() {
    const isDark = JSON.parse(localStorage.getItem(this.darkModeKey) || 'false');
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }
}
