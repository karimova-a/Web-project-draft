import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'youtubeSafe', standalone: true })
export class YoutubeSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    // Вытаскиваем video ID из любого формата YouTube ссылки
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    const videoId = match?.[1] ?? '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}