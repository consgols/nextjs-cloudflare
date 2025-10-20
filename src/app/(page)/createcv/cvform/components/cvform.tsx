import React, { FunctionComponent, useEffect } from 'react';
import { ObjectId } from 'mongodb';
import { Input } from '@/components/ui/input';
import ProfilePicture from './profilepicture';
import { Separator } from '@/components/ui/separator';
import Projects from './formsections/projects';
import { Button } from '@/components/ui/button';
import PhoneField from './phonefield';
import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import TextAreaFieldWithLimit from './textfieldareawithlimits';
import WorkExperience from './formsections/workexperience';
import { H2 } from '@/components/ui/typography';
import { CircleX, Save } from 'lucide-react';
import { useLoader } from '@/app/context/LoaderContext';
import { Spinner } from '@/components/ui/spinner';

type PropsType = {
  initialData: CvData & { _id?: string | ObjectId };
  formState: CvData;
  cvId: string;
  setCvId: React.Dispatch<React.SetStateAction<string>>;
  setFormState: React.Dispatch<React.SetStateAction<CvData>>;
  imgPreviewUrl: string | null;
  setImgPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setImgFile: React.Dispatch<React.SetStateAction<File | null>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (field: keyof CvData, value: any) => void;
  handleSubmit: () => void;
};
const CVForm: FunctionComponent<PropsType> = ({
  initialData,
  cvId,
  setCvId,
  formState,
  setFormState,
  imgPreviewUrl,
  setImgPreviewUrl,
  setImgFile,
  handleChange,
  handleSubmit,
}) => {
  const { loading } = useLoader();
  // if your initialData might change (e.g., client nav), keep cvId in sync
  useEffect(() => {
    if (initialData?._id) setCvId(initialData._id.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id]);

  useEffect(() => {
    return () => {
      if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);
    };
  }, [imgPreviewUrl]);

  const onUploadImage = (file: File | null) => {
    if (!file) {
      setImgFile(null);
      if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);
      setImgPreviewUrl(null);
      handleChange('imgDataUrl', ''); // clear persisted URL
      return;
    }

    const url = URL.createObjectURL(file);
    if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);

    setImgFile(file);
    setImgPreviewUrl(url);
    handleChange('imgDataUrl', url);
  };

  const updateArrayItem = <T,>(key: keyof CvData, idx: number, patch: T) => {
    setFormState(prev => {
      const next = structuredClone(prev) as CvData;

      if (typeof next[key][idx] === 'string') {
        // Replace string directly
        (next[key] as unknown as string[])[idx] = patch as unknown as string;
      } else {
        // Merge object
        (next[key] as T[])[idx] = { ...next[key][idx], ...patch };
      }

      return next;
    });
  };

  // Add one item to an array field on CvData.
  // If the key doesn't exist yet, it will be created as an array with the new item.
  const addArrayItem = <K extends keyof CvData>(key: K, factory: () => CvData[K] extends (infer U)[] ? U : never) => {
    setFormState(prev => {
      const current = prev[key] as unknown as unknown[];
      const safe = Array.isArray(current) ? current : []; // create if missing/invalid
      return {
        ...prev,
        [key]: [factory(), ...safe] as unknown as CvData[K],
      };
    });
  };

  const removeArrayItem = (key: keyof CvData, idx: number) => {
    setFormState(prev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const copy = [...(prev[key] as any[])];
      copy.splice(idx, 1);
      return { ...prev, [key]: copy } as CvData;
    });
  };

  const addTechnology = () => addArrayItem('technologies', () => '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTechnology = (idx: number, value: string) => updateArrayItem<string>('technologies', idx, value as any);
  const removeTechnology = (idx: number) => removeArrayItem('technologies', idx);

  const addCertificates = () => addArrayItem('certificates', () => '');
  const updateCertificates = (idx: number, value: string) => updateArrayItem<string>('certificates', idx, value);
  const removeCertificates = (idx: number) => removeArrayItem('certificates', idx);

  //////////////////////////////////////////

  return (
    <FieldSet>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()} className="space-y-8">
        {/* Basic Info */}
        <Input type="hidden" name="id" value={cvId} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <ProfilePicture form={formState} onUploadImage={onUploadImage} />
            {/* About */}
            <TextAreaFieldWithLimit
              label="About"
              value={formState.about}
              onChange={about => handleChange('about', about)}
              maxText={1000}
              placeHolder="Write a concise professional summary (aim for 600-1000 characters)."
            />
          </div>
          <div className="space-y-3">
            <FieldGroup>
              <FieldLabel htmlFor="full-name" className="block text-sm font-medium">
                Full Name
              </FieldLabel>
              <Input
                id="full-name"
                type="text"
                value={formState.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="position" className="block text-sm font-medium">
                Position
              </FieldLabel>
              <Input
                id="position"
                type="text"
                value={formState.position}
                onChange={e => handleChange('position', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="email" className="block text-sm font-medium">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="linkedin" className="block text-sm font-medium">
                LinkedIn
              </FieldLabel>
              <Input
                id="linkedin"
                type="url"
                value={formState.linkedIn}
                onChange={e => handleChange('linkedIn', e.target.value)}
              />
            </FieldGroup>
            <PhoneField
              value={formState.phone}
              onChange={phoneField => {
                handleChange('phone', phoneField.e164);
              }}
            />
          </div>
        </div>
        <Separator />
        {/* Projects */}
        <Projects
          projects={formState.projects}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          updateArrayItem={updateArrayItem}
        />
        <Separator />

        {/* Work Experience */}
        <WorkExperience
          experiences={formState.workExperience}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          updateArrayItem={updateArrayItem}
        />
        <Separator />
        {/* Education */}
        <div className="space-y-3">
          <SectionHeader title="Education" onAdd={() => addArrayItem('education', blankEdu)} addLabel="Add Education" />
          {formState.education.length === 0 && (
            <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Education&quot; to create one.</p>
          )}
          {formState.education.map((ed: Education, i: number) => (
            <div key={`ed-${i}`} className="space-y-2 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium invisible">Education</p>
                <CircleX strokeWidth={1.25} onClick={() => removeArrayItem('education', i)} />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FieldGroup>
                  <FieldLabel htmlFor={`degree-${i}`}>Degree</FieldLabel>
                  <Input
                    id={`degree-${i}`}
                    className="rounded-xl border px-3 py-2"
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={e => updateArrayItem('education', i, { degree: e.target.value })}
                  />
                  <FieldDescription>
                    Enter your degree or program (e.g. BS Engineering, BA Design, MSc Computer Science).
                  </FieldDescription>
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor={`institution-${i}`}>Institution</FieldLabel>
                  <Input
                    id={`institution-${i}`}
                    className="rounded-xl border px-3 py-2"
                    placeholder="Institution"
                    value={ed.institution}
                    onChange={e => updateArrayItem('education', i, { institution: e.target.value })}
                  />
                  <FieldDescription>Name of the school or university (e.g. University of Bohol).</FieldDescription>
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor={`ed-date-${i}`}>Date</FieldLabel>
                  <Input
                    id={`ed-date-${i}`}
                    className="rounded-xl border px-3 py-2"
                    placeholder="Date"
                    value={ed.date}
                    onChange={e => updateArrayItem('education', i, { date: e.target.value })}
                  />
                  <FieldDescription>
                    Study period (e.g. 2006–2007, Aug 2015–May 2019, or 2018–Present).
                  </FieldDescription>
                </FieldGroup>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        {/* Technologies */}
        <div className="space-y-3">
          <SectionHeader title="Skillset" onAdd={addTechnology} addLabel="Add Skillset" />
          {formState.technologies.length === 0 && (
            <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Skillset&quot; to create one.</p>
          )}
          <div className="space-y-2">
            {formState.technologies.map((tech: string, i: number) => (
              <div key={`tech-${i}`} className="flex items-center gap-3">
                <Input
                  className="flex-1 rounded-xl border px-3 py-2"
                  placeholder={`Skill`}
                  value={tech}
                  onChange={e => updateTechnology(i, e.target.value)}
                />
                <RemoveButton onClick={() => removeTechnology(i)} />
              </div>
            ))}
          </div>
        </div>
        {/* Certificates */}
        <div className="space-y-3">
          <SectionHeader title="Certificates" onAdd={addCertificates} addLabel="Add Certificates" />
          {formState.certificates.length === 0 && (
            <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Certificates&quot; to create one.</p>
          )}
          <div className="space-y-2">
            {formState?.certificates?.map((cert: string, i: number) => (
              <div key={`cert-${i}`} className="flex items-center gap-3">
                <Input
                  className="flex-1 rounded-xl border px-3 py-2"
                  placeholder={`Certificates`}
                  value={cert}
                  onChange={e => updateCertificates(i, e.target.value)}
                />
                <RemoveButton onClick={() => removeCertificates(i)} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="w-1/6  px-4 py-3  shadow-sm">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Save /> Save CV
              </>
            )}
          </Button>
        </div>
      </form>
    </FieldSet>
  );
};

export default CVForm;

export const blankWork = (): WorkExperience => ({ company: '', role: '', date: '', workDetails: '' });
export const blankEdu = (): Education => ({ degree: '', institution: '', date: '' });
export const blankProj = (): Project => ({ title: '', role: '', date: '', projectDetails: '' });

export function SectionHeader({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <H2 className="text-lg font-semibold">{title}</H2>
      {onAdd && (
        <Button type="button" onClick={onAdd} className="px-3 py-1.5 text-sm">
          {addLabel ?? 'Add'}
        </Button>
      )}
    </div>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      Remove
    </Button>
  );
}
