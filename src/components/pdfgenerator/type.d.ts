type CVFormData = {
  formData?: CvData;
};

type CVFormProjectsData = {
  projects?: Project[];
};

type CVFormWorkExperienceData = {
  workExperience?: WorkExperience[];
};

type CVFormEducationData = {
  educations?: { degree: string; institution: string; date: string }[];
};
