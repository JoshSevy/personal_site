import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface MetaTag {
  name: string;
  content: string;
}

interface OpenGraphTag {
  property: string;
  content: string;
}

type Tag = MetaTag | OpenGraphTag;

function isMetaTag(tag: Tag): tag is MetaTag {
  return 'name' in tag;
}

function isOpenGraphTag(tag: Tag): tag is OpenGraphTag {
  return 'property' in tag;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateMetaTags(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string[];
  }) {
    const { title, description, image, url, type = 'website', keywords } = config;

    // Basic meta tags
    const metaTags: MetaTag[] = [
      { name: 'description', content: description || '' },
      { name: 'keywords', content: keywords?.join(', ') || '' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ];

    // Open Graph tags
    const ogTags: OpenGraphTag[] = [
      { property: 'og:title', content: title || '' },
      { property: 'og:description', content: description || '' },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url || '' },
      { property: 'og:image', content: image || '' }
    ];

    // Twitter Card tags
    const twitterTags: MetaTag[] = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || '' },
      { name: 'twitter:description', content: description || '' },
      { name: 'twitter:image', content: image || '' }
    ];

    // Update title
    if (title) {
      this.title.setTitle(`${title} | Joshua Sevy`);
    }

    // Update meta tags
    [...metaTags, ...ogTags, ...twitterTags].forEach(tag => {
      if (isMetaTag(tag)) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      } else if (isOpenGraphTag(tag)) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      }
    });
  }

  addStructuredData(data: any) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Common structured data types
  addPersonStructuredData(data: {
    name: string;
    jobTitle: string;
    url: string;
    sameAs?: string[];
    worksFor?: {
      name: string;
      url: string;
    };
  }) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      url: data.url,
      sameAs: data.sameAs,
      worksFor: data.worksFor ? {
        '@type': 'Organization',
        name: data.worksFor.name,
        url: data.worksFor.url
      } : undefined
    };

    this.addStructuredData(structuredData);
  }

  addArticleStructuredData(data: {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: {
      name: string;
      url: string;
    };
  }) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: {
        '@type': 'Person',
        name: data.author.name,
        url: data.author.url
      }
    };

    this.addStructuredData(structuredData);
  }
} 