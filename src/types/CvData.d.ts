// ---------------- Types ----------------
type Education = { degree: string; institution: string; date: string };
type Project = { title: string; role: string; date: string; projectDetails: string };
type WorkExperience = { company: string; role: string; date: string; workDetails: string };

type CvData = {
  fullName: string;
  imgDataUrl: string;
  position: string;
  email: string;
  linkedIn: string;
  phone: string;
  about: string;
  education: Education[];
  projects: Project[];
  workExperience: WorkExperience[];
  technologies: string[];
  certificates: string[];
};
