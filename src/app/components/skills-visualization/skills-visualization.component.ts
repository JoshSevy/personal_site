import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'other';
  years: number;
}

@Component({
  selector: 'app-skills-visualization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-4">
        <button *ngFor="let category of categories"
                (click)="selectedCategory = category"
                [class.bg-blue-500]="selectedCategory === category"
                [class.text-white]="selectedCategory === category"
                [class.bg-gray-200]="selectedCategory !== category"
                [class.text-gray-700]="selectedCategory !== category"
                class="px-4 py-2 rounded-lg transition-colors duration-200">
          {{ category | titlecase }}
        </button>
      </div>

      <!-- Skills Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let skill of filteredSkills"
             class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ skill.name }}
            </h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ skill.years }} years
            </span>
          </div>
          
          <!-- Progress Bar -->
          <div class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="absolute h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000"
                 [style.width.%]="skill.level">
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
          <span>Expert</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full mr-2"></div>
          <span>Advanced</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-300 dark:bg-blue-200 rounded-full mr-2"></div>
          <span>Intermediate</span>
        </div>
      </div>
    </div>
  `
})
export class SkillsVisualizationComponent implements OnInit {
  categories: ('frontend' | 'backend' | 'devops' | 'other')[] = ['frontend', 'backend', 'devops', 'other'];
  selectedCategory: 'frontend' | 'backend' | 'devops' | 'other' = 'frontend';

  skills: Skill[] = [
    {
      name: 'Angular',
      level: 95,
      category: 'frontend',
      years: 5
    },
    {
      name: 'TypeScript',
      level: 90,
      category: 'frontend',
      years: 5
    },
    {
      name: 'Node.js',
      level: 85,
      category: 'backend',
      years: 4
    },
    {
      name: 'GraphQL',
      level: 80,
      category: 'backend',
      years: 3
    },
    {
      name: 'Docker',
      level: 75,
      category: 'devops',
      years: 3
    },
    {
      name: 'AWS',
      level: 70,
      category: 'devops',
      years: 2
    },
    {
      name: 'Python',
      level: 65,
      category: 'other',
      years: 2
    }
  ];

  get filteredSkills(): Skill[] {
    return this.skills.filter(skill => skill.category === this.selectedCategory);
  }

  ngOnInit() {
    // Add any initialization logic here
  }
} 