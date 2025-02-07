import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    this.startTypingEffect("With over four years leading development for Spectrum.net and its Ionic application,\n" +
      "      I specialize in building scalable, performant web applications. Passionate about web technologies, accessibility, and frontend architecture,\n" +
      "      I help teams craft robust, user-friendly digital experiences.");
  }

  startTypingEffect(text: string) {
    let index = 0;
    const speed = 25;
    const element = document.getElementById('typed-text');

    function type() {
      if (index < text.length) {
        element!.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    }
    type();
  }

}
