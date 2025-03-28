import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineEvent {
  date: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  link?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <!-- Timeline events -->
      <div class="space-y-12">
        <div *ngFor="let event of events; let i = index" 
             class="relative flex items-center"
             [class.ml-auto]="i % 2 === 0"
             [class.mr-auto]="i % 2 === 1">
          
          <!-- Timeline dot -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
          
          <!-- Content -->
          <div [class.ml-8]="i % 2 === 0"
               [class.mr-8]="i % 2 === 1"
               class="w-1/2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            
            <!-- Date -->
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ event.date }}</div>
            
            <!-- Title and Company -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ event.title }}</h3>
            <h4 class="text-lg text-gray-700 dark:text-gray-300 mb-3">{{ event.company }}</h4>
            
            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ event.description }}</p>
            
            <!-- Skills -->
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of event.skills"
                    class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                {{ skill }}
              </span>
            </div>
            
            <!-- Link if available -->
            <a *ngIf="event.link"
               [href]="event.link"
               target="_blank"
               rel="noopener noreferrer"
               class="mt-4 inline-block text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TimelineComponent {
  events: TimelineEvent[] = [
    {
      date: '2023 - Present',
      title: 'Senior Software Engineer',
      company: 'Current Company',
      description: 'Leading development of micro-frontend architecture and implementing modern web technologies.',
      skills: ['Angular', 'TypeScript', 'Micro Frontends', 'GraphQL'],
      link: 'https://example.com'
    },
    {
      date: '2021 - 2023',
      title: 'Software Engineer',
      company: 'Previous Company',
      description: 'Developed and maintained enterprise-level applications using modern web technologies.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS']
    },
    // Add more events as needed
  ];
} 