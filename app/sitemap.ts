import { MetadataRoute } from 'next';

// Base URL of your website (Update this when you deploy to production if you get a custom domain)
const BASE_URL = 'https://ru-study-hub.vercel.app';

// Reuse your Official Syllabus Mapping to generate links
const ALL_SEMESTERS = [
  {
    id: "1",
    subjects: ["c1", "c2", "aecc1", "ge1a", "ge1b"]
  },
  {
    id: "2",
    subjects: ["c3", "c4", "aecc2", "ge2a", "ge2b"]
  },
  {
    id: "3",
    subjects: ["c5", "c6", "c7", "sec1", "ge3a", "ge3b"]
  },
  {
    id: "4",
    subjects: ["c8", "c9", "c10", "sec2", "ge4a", "ge4b"]
  },
  {
    id: "5",
    subjects: ["c11", "c12", "dse1", "dse2"]
  },
  {
    id: "6",
    subjects: ["c13", "c14", "dse3", "dse4"]
  }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/syllabus`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pyq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mock-tests`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamically add Semester and Subject Pages
  ALL_SEMESTERS.forEach((sem) => {
    // Add Semester Page (e.g., /semester/1)
    routes.push({
      url: `${BASE_URL}/semester/${sem.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Add Subject Pages (e.g., /semester/1/c1)
    sem.subjects.forEach((subjectId) => {
      routes.push({
        url: `${BASE_URL}/semester/${sem.id}/${subjectId}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Notes change often
        priority: 0.8,
      });
    });
  });

  return routes;
}