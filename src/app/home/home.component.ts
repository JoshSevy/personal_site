import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-shell max-w-5xl mx-auto px-4 py-12 md:py-16">
      <header class="text-center mb-14 md:mb-20">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-[var(--site-muted)] mb-3">
          Joshua Sevy
        </p>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--site-text)]">
          Full-stack engineer
        </h1>
        <p class="text-lg text-[var(--site-muted)] max-w-2xl mx-auto leading-relaxed">
          I build reliable web applications with Angular, TypeScript, and pragmatic architecture.
        </p>
        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <a
            routerLink="/blog"
            class="button-primary px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Blog
          </a>
          <a
            routerLink="/resume"
            class="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[var(--site-border)] hover:bg-white/5 transition"
          >
            Resume
          </a>
          <a
            routerLink="/contact"
            class="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[var(--site-border)] hover:bg-white/5 transition"
          >
            Contact
          </a>
        </div>
      </header>

      <div class="grid md:grid-cols-2 gap-6">
        <section class="bg-card rounded-xl p-6 border border-[var(--site-border)]">
          <h2 class="text-lg font-semibold mb-3 text-[var(--site-text)]">Focus</h2>
          <p class="text-[var(--site-muted)] text-sm leading-relaxed">
            Product-quality frontends, clear APIs, and performance that holds up for real users—not
            just demos.
          </p>
        </section>
        <section class="bg-card rounded-xl p-6 border border-[var(--site-border)]">
          <h2 class="text-lg font-semibold mb-3 text-[var(--site-text)]">Stack</h2>
          <ul class="text-sm text-[var(--site-muted)] space-y-2">
            <li>Angular, TypeScript, RxJS</li>
            <li>GraphQL, REST, Node</li>
            <li>Testing, CI, accessibility-minded UI</li>
          </ul>
        </section>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Joshua Sevy — Full-stack engineer',
      description:
        'Portfolio and blog of Joshua Sevy: full-stack engineering with Angular, TypeScript, and modern web architecture.',
      keywords: [
        'full-stack developer',
        'Angular',
        'TypeScript',
        'GraphQL',
        'software engineer',
      ],
      url: 'https://www.joshuasevy.com',
    });

    this.seoService.addPersonStructuredData({
      name: 'Joshua Sevy',
      jobTitle: 'Full-stack engineer',
      url: 'https://www.joshuasevy.com',
      sameAs: [
        'https://github.com/JoshSevy',
        'https://www.linkedin.com/in/joshua-sevy',
      ],
    });
  }
}
