import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

@Component({
  selector: 'app-project-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Featured Project -->
      <div *ngIf="featuredProject" 
           class="md:col-span-2 lg:col-span-3">
        <div class="relative group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="aspect-video overflow-hidden">
            <img [src]="featuredProject.image" 
                 [alt]="featuredProject.title"
                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ featuredProject.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ featuredProject.description }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span *ngFor="let tech of featuredProject.technologies"
                    class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                {{ tech }}
              </span>
            </div>
            <div class="flex gap-4">
              <a *ngIf="featuredProject.github"
                 [href]="featuredProject.github"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                GitHub →
              </a>
              <a *ngIf="featuredProject.demo"
                 [href]="featuredProject.demo"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Live Demo →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Projects -->
      <div *ngFor="let project of otherProjects"
           class="group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="aspect-video overflow-hidden">
          <img [src]="project.image" 
               [alt]="project.title"
               class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ project.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span *ngFor="let tech of project.technologies"
                  class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
              {{ tech }}
            </span>
          </div>
          <div class="flex gap-4">
            <a *ngIf="project.github"
               [href]="project.github"
               target="_blank"
               rel="noopener noreferrer"
               class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              GitHub →
            </a>
            <a *ngIf="project.demo"
               [href]="project.demo"
               target="_blank"
               rel="noopener noreferrer"
               class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Live Demo →
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectShowcaseComponent {
  projects: Project[] = [
    {
      title: 'Featured Project',
      description: 'A showcase of your most impressive work with detailed features and technologies used.',
      image: 'https://via.placeholder.com/800x400',
      technologies: ['Angular', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
      github: 'https://github.com/yourusername/project',
      demo: 'https://demo.example.com',
      featured: true
    },
    {
      title: 'Project 2',
      description: 'Another impressive project showcasing your skills and expertise.',
      image: 'https://via.placeholder.com/800x400',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/yourusername/project2',
      featured: false
    },
    // Add more projects as needed
  ];

  get featuredProject(): Project | undefined {
    return this.projects.find(p => p.featured);
  }

  get otherProjects(): Project[] {
    return this.projects.filter(p => !p.featured);
  }
} 