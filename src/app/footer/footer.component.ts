import { Component } from '@angular/core';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    FaIconComponent,
    RouterLink,
  ],
})
export class FooterComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEnvelope, faPhone, faGithub, faLinkedin);
  }
}
