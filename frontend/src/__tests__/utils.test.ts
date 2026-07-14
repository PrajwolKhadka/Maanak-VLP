import '@testing-library/jest-dom';
import { getYoutubeEmbedUrl, getInitials, formatDuration, greetingByTime } from '@/lib/utils';

describe('Utils', () => {
  it('should extract YouTube video ID from standard URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(getYoutubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('should extract YouTube video ID from short URL', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(getYoutubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('should return initials from name', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Alice')).toBe('A');
  });

  it('should format duration correctly', () => {
    expect(formatDuration('14:22')).toBe('14:22');
    expect(formatDuration('')).toBe('—');
  });

  it('should return correct greeting based on time', () => {
    const greeting = greetingByTime();
    expect(['Good Morning', 'Good Afternoon', 'Good Evening']).toContain(greeting);
  });
});