import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p class="text-xl text-gray-600">Full-Stack Developer & Software Engineer</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">About Me</h2>
          <p class="text-gray-600">
            I'm a passionate full-stack developer with expertise in modern web technologies.
            I love creating elegant solutions to complex problems.
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Skills</h2>
          <ul class="list-disc list-inside text-gray-600">
            <li>Frontend: Angular, React, TypeScript</li>
            <li>Backend: Node.js, Python</li>
            <li>Database: PostgreSQL, MongoDB</li>
            <li>DevOps: Docker, AWS</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    // Update meta tags
    this.seoService.updateMetaTags({
      title: 'Joshua Sevy - Full-Stack Developer',
      description: 'Portfolio website of Joshua Sevy, a full-stack developer specializing in modern web technologies.',
      keywords: ['full-stack developer', 'web development', 'Angular', 'React', 'TypeScript', 'Node.js'],
      url: 'https://yourdomain.com'
    });

    // Add structured data
    this.seoService.addPersonStructuredData({
      name: 'Joshua Sevy',
      jobTitle: 'Full-Stack Developer',
      url: 'https://yourdomain.com',
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername'
      ]
    });
  }
}
