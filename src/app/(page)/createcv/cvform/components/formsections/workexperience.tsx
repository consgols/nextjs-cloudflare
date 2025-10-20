import React, { FunctionComponent } from 'react';
import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { blankWork, SectionHeader } from '../cvform';
import TextAreaFieldWithLimit from '../textfieldareawithlimits';
import { P } from '@/components/ui/typography';
import { CircleX } from 'lucide-react';

type PropsType = {
  experiences: WorkExperience[];
  addArrayItem: <K extends keyof CvData>(key: K, factory: () => CvData[K] extends (infer U)[] ? U : never) => void;
  removeArrayItem: (key: keyof CvData, idx: number) => void;
  updateArrayItem: <T>(key: keyof CvData, idx: number, patch: T) => void;
};

const WorkExperience: FunctionComponent<PropsType> = ({
  experiences,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}) => {
  return (
    <div className="space-y-3">
      <SectionHeader
        title="Work Experience"
        onAdd={() => addArrayItem('workExperience', blankWork)}
        addLabel="Add Work Experience"
      />
      {(typeof experiences === 'undefined' || experiences.length === 0) && (
        <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Work Experience&quot; to create one.</p>
      )}
      {experiences?.map((experience, i) => (
        <FieldSet key={`experience-${i}`}>
          <div className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <P className="text-sm font-medium invisible">Experience</P>
              <CircleX onClick={() => removeArrayItem('workExperience', i)} size={20} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldGroup className="mb-3">
                <FieldLabel htmlFor={`experience-company-${i}`}>Company</FieldLabel>
                <Input
                  id={`experience-company-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Company"
                  value={experience.company}
                  onChange={e => updateArrayItem('workExperience', i, { company: e.target.value })}
                />
                <FieldDescription>Enter the company (e.g. Avensia, Hemtex, IKEA).</FieldDescription>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor={`experience-role-${i}`}>Role</FieldLabel>
                <Input
                  id={`experience-role-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Role"
                  value={experience.role}
                  onChange={e => updateArrayItem('workExperience', i, { role: e.target.value })}
                />
                <FieldDescription>Specify your position in this company.</FieldDescription>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor={`experience-date-${i}`}>Date</FieldLabel>
                <Input
                  id={`experience-date-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Date"
                  value={experience.date}
                  onChange={e => updateArrayItem('workExperience', i, { date: e.target.value })}
                />
                <FieldDescription>
                  Enter the work experience start and end date (e.g., Jan 2023 - Dec 2024 or Dec 2025 - current).
                </FieldDescription>
              </FieldGroup>
            </div>
            <TextAreaFieldWithLimit
              value={experience.workDetails}
              onChange={workdD => updateArrayItem('workExperience', i, { workDetails: workdD })}
              maxText={800}
              label="Work Details"
              placeHolder="Write a concise Work Experience Summary (aim for 600-800 characters)."
              textRows={6}
              htmlFor={`experience-details-${i}`}
            />
          </div>
        </FieldSet>
      ))}
    </div>
  );
};

export default WorkExperience;
