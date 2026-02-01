import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RU Study Hub',
    short_name: 'RU Hub',
    description: 'Ranchi University BCA Resources: Notes, PYQs, Syllabus',
    start_url: '/',
    display: 'standalone', // Removes browser address bar when installed
    background_color: '#ffffff',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}