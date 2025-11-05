import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.superbaseUrl,
      environment.superbaseKey
    );
  }

  uploadImage(file: File): Observable<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    return from(
      this.supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return `${environment.superbaseUrl}/storage/v1/object/public/blog-images/${fileName}`;
      })
    );
  }

  deleteImage(url: string): Observable<void> {
    const fileName = url.split('/').pop();
    if (!fileName) {
      return new Observable(subscriber => {
        subscriber.error(new Error('Invalid image URL'));
        subscriber.complete();
      });
    }

    return from(
      this.supabase.storage
        .from('blog-images')
        .remove([fileName])
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
      })
    );
  }
} 