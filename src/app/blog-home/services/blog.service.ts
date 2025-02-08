import { Injectable } from '@angular/core';
import { BlogPost } from './../blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private posts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with Angular',
      excerpt: 'A quick guide to understanding Angular and its core concepts.',
      content: '<p>Angular is a powerful framework for building...</p>',
      author: 'Joshua Sevy',
      publishDate: '2025-02-08',
      tags: ['Angular', 'Frontend', 'Tutorial'],
      imageUrl: 'assets/angular-guide.jpg',
    },
    {
      id: 2,
      title: 'Improving App Performance',
      excerpt: 'Learn how to optimize your Angular app for better performance.',
      content: '<p>Performance optimization is crucial for...</p>',
      author: 'Joshua Sevy',
      publishDate: '2025-01-15',
      tags: ['Performance', 'Optimization', 'Angular'],
      imageUrl: 'assets/performance-tips.jpg',
    },
  ];

  getAllPosts(): BlogPost[] {
    return this.posts;
  }

  getPostById(id: number): BlogPost | undefined {
    return this.posts.find(post => post.id === id);
  }
}
