import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Command {
  input: string;
  output: string;
}

@Component({
  selector: 'app-interactive-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-black text-green-400 p-4 rounded-lg font-mono h-[500px] overflow-y-auto border border-green-500/20">
      <div class="flex items-center mb-4">
        <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      
      <div class="space-y-2">
        <div *ngFor="let command of commands" class="mb-2">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">></span>
            <span>{{ command.input }}</span>
          </div>
          <div class="ml-4 text-gray-300" [innerHTML]="command.output"></div>
        </div>
        
        <div class="flex items-center">
          <span class="text-green-500 mr-2">></span>
          <input 
            type="text" 
            [(ngModel)]="currentInput"
            (keyup.enter)="executeCommand()"
            class="bg-transparent border-none outline-none flex-1"
            placeholder="Enter command..."
            autofocus
          >
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `]
})
export class InteractiveTerminalComponent implements OnInit {
  commands: Command[] = [];
  currentInput = '';
  availableCommands = {
    'help': 'Available commands: help, about, skills, projects, contact, clear, matrix, hack, exit',
    'about': 'Welcome to the secret terminal! I\'m a full-stack developer who loves creating elegant solutions to complex problems.',
    'skills': '• Frontend: Angular, React, TypeScript\n• Backend: Node.js, Python\n• Database: PostgreSQL, MongoDB\n• DevOps: Docker, AWS\n• Other: Git, CI/CD',
    'projects': '• Personal Website (Angular)\n• E-commerce Platform (React + Node.js)\n• Data Analytics Dashboard (Python + D3.js)',
    'contact': 'Email: your.email@example.com\nGitHub: github.com/yourusername\nLinkedIn: linkedin.com/in/yourusername',
    'clear': 'Clearing terminal...',
    'matrix': 'Wake up, Neo...\nThe Matrix has you...',
    'hack': 'Initiating hack sequence...\nJust kidding! 😄',
    'exit': 'Exiting terminal...'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.executeCommand('help');
  }

  executeCommand(command?: string) {
    if (!command) {
      command = this.currentInput.trim();
    }

    if (!command) return;

    if (command === 'clear') {
      this.commands = [];
      return;
    }

    if (command === 'exit') {
      this.router.navigate(['/']);
      return;
    }

    const output = this.availableCommands[command as keyof typeof this.availableCommands] || 
      'Command not found. Type "help" for available commands.';

    this.commands.push({ input: command, output });
    this.currentInput = '';
  }
} 