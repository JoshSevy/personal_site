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
          Technical Manager & Full-Stack Engineer
        </h1>
        <p class="text-lg text-[var(--site-muted)] max-w-2xl mx-auto leading-relaxed">
          I lead engineering teams while staying hands-on in the codebase — architecting Angular
          systems, building AI-assisted engineering workflows, and helping teams ship
          independently.
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
            Player-coach leadership: architecture and delivery on one hand, team growth and
            process on the other — plus scaling AI-assisted workflows so engineers ship
            consistently without bottlenecking on one person.
          </p>
        </section>
        <section class="bg-card rounded-xl p-6 border border-[var(--site-border)]">
          <h2 class="text-lg font-semibold mb-3 text-[var(--site-text)]">Stack</h2>
          <ul class="text-sm text-[var(--site-muted)] space-y-2">
            <li>Angular (signals, standalone, OnPush), TypeScript, RxJS</li>
            <li>GraphQL (Apollo), REST, Node</li>
            <li>AI-assisted engineering tooling, agentic workflows</li>
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
      title: 'Joshua Sevy — Technical Manager & Full-Stack Engineer',
      description:
        'Portfolio and blog of Joshua Sevy: technical leadership and full-stack engineering with Angular, GraphQL, and AI-assisted development workflows.',
      keywords: [
        'technical manager',
        'engineering leadership',
        'full-stack developer',
        'Angular',
        'TypeScript',
        'GraphQL',
        'AI-assisted development',
        'software engineer',
      ],
      url: 'https://www.joshuasevy.com',
    });

    this.seoService.addPersonStructuredData({
      name: 'Joshua Sevy',
      jobTitle: 'Technical Manager & Full-Stack Engineer',
      url: 'https://www.joshuasevy.com',
      sameAs: [
        'https://github.com/JoshSevy',
        'https://www.linkedin.com/in/joshua-sevy',
      ],
    });
  }
}
