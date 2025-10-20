import React, { FunctionComponent } from 'react';
import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { blankProj, SectionHeader } from '../cvform';
import TextAreaFieldWithLimit from '../textfieldareawithlimits';
import { P } from '@/components/ui/typography';
import { CircleX } from 'lucide-react';

type PropsType = {
  projects: Project[];
  addArrayItem: <K extends keyof CvData>(key: K, factory: () => CvData[K] extends (infer U)[] ? U : never) => void;
  removeArrayItem: (key: keyof CvData, idx: number) => void;
  updateArrayItem: <T>(key: keyof CvData, idx: number, patch: T) => void;
};

const Projects: FunctionComponent<PropsType> = ({ projects, addArrayItem, removeArrayItem, updateArrayItem }) => {
  return (
    <div className="space-y-3">
      <SectionHeader
        title="Avensia Projects"
        onAdd={() => addArrayItem('projects', blankProj)}
        addLabel="Add Project"
      />
      {projects.length === 0 && (
        <P className="text-sm text-gray-500">No entries yet. Click &quot;Add Project&quot; to create one.</P>
      )}
      {projects.map((pr, i) => (
        <FieldSet key={`pr-${i}`}>
          <div className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <P className="text-sm font-medium invisible">Project</P>
              <CircleX onClick={() => removeArrayItem('projects', i)} size={20} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldGroup className="mb-3">
                <FieldLabel htmlFor={`project-title-${i}`}>Title</FieldLabel>
                <Input
                  id={`project-title-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Title"
                  value={pr.title}
                  onChange={e => updateArrayItem('projects', i, { title: e.target.value })}
                />
                <FieldDescription>Enter the project name (e.g. Eurosko, Kid/Hemtex).</FieldDescription>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor={`project-role-${i}`}>Role</FieldLabel>
                <Input
                  id={`project-role-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Role"
                  value={pr.role}
                  onChange={e => updateArrayItem('projects', i, { role: e.target.value })}
                />
                <FieldDescription>Specify your position in this project.</FieldDescription>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor={`project-date-${i}`}>Date</FieldLabel>
                <Input
                  id={`project-date-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Date"
                  value={pr.date}
                  onChange={e => updateArrayItem('projects', i, { date: e.target.value })}
                />
                <FieldDescription>
                  Enter the project duration (e.g. Jan 2023 - Dec 2024 or 2025 - current).
                </FieldDescription>
              </FieldGroup>
            </div>
            <TextAreaFieldWithLimit
              value={pr.projectDetails}
              onChange={projd => updateArrayItem('projects', i, { projectDetails: projd })}
              maxText={800}
              label="Project Details"
              placeHolder="Write a concise Project Summary (aim for 600-800 characters)."
              textRows={6}
              htmlFor={`project-details-${i}`}
            />
          </div>
        </FieldSet>
      ))}
    </div>
  );
};

export default Projects;
