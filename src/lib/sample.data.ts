import type { CV } from './cv.schema';

const sample: CV = {
  basics: {
    name: 'Ada Lovelace',
    title: 'Software Engineer',
    email: 'ada@example.com',
    summary: 'Engineer with a passion for compilers and HCI.',
  },
  skills: ['TypeScript', 'React', 'Node.js'],
  work: [
    {
      company: 'Analytical Engines Inc.',
      title: 'Senior Engineer',
      start: '2023-03',
      summary: 'Led the design of a domain-specific language.',
      bullets: ['Designed IR and codegen pipeline', 'Improved compile times by 37%'],
    },
  ],
  education: [{ school: 'U of Imagination', degree: 'BSc Computer Science', start: '2016-09', end: '2020-06' }],
  projects: [],
};

export default sample;
