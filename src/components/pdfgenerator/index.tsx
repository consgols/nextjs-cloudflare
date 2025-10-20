import React from 'react';
import { Document, Page, StyleSheet, View, Font } from '@react-pdf/renderer';
import { Heading } from './heading';
import Name from './name';
import Section from './section';
import About from './aboutme';
import Projects from './projects';
import Skills from './skills';
import Certificates from './certificates';
import Education from './education';
import WorkExperience from './workexperience';
import { isValueValid } from '@/app/lib/utils/validations';

const coverUrl = '/assets/images/CoverPhoto-crop.jpg';
const samplePFUrl = '/assets/images/avensia-logo-light.jpg';

Font.register({
  family: 'Poppins',
  fonts: [{ src: '/assets/fonts/regular.ttf' }, { src: '/assets/fonts/bold.ttf', fontWeight: 'bold' }],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: '#0F2037',
    paddingTop: 20,
    paddingBottom: 10,
  },
  layout: {
    marginLeft: 36,
    marginRight: 36,
    marginTop: -50,
  },
  name: {
    fontSize: 24,
    paddingLeft: 32,
    paddingRight: 32,
  },
  role: {
    fontSize: 12,
    paddingLeft: 32,
    paddingRight: 32,
  },
  h4: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 0,
  },
});

export const CreatePDF = ({ formData }: { formData?: CvData }) => {
  return (
    <Document author="Avensia">
      <Page style={styles.page} size="LEGAL" orientation="portrait" wrap={false}>
        <View style={{ height: 200, marginTop: -20 }}>
          <Heading
            coverUrl={coverUrl ?? ''}
            samplePFUrl={formData?.imgDataUrl ? formData?.imgDataUrl : samplePFUrl}
            PFurl={formData?.imgDataUrl}
          />
        </View>
        <View style={styles.layout}>
          <Section hr={false} wrap>
            <Name formData={formData} />
          </Section>
          {isValueValid(formData?.about) && (
            <Section title="About" hr={false} wrap>
              <About aboutMe={formData?.about} />
            </Section>
          )}
          {isValueValid(formData?.projects) && (
            <Section title="Projects" hr={false} wrap>
              <Projects projects={formData?.projects} />
            </Section>
          )}
          {isValueValid(formData?.workExperience) && (
            <Section title="Work Experience" hr wrap>
              <WorkExperience workExperience={formData?.workExperience} />
            </Section>
          )}
          {isValueValid(formData?.technologies) && (
            <Section title="Skills" hr wrap>
              <Skills skills={formData?.technologies} />
            </Section>
          )}
          {isValueValid(formData?.education) && (
            <Section title="Educations" hr wrap>
              <Education educations={formData?.education} />
            </Section>
          )}
          {isValueValid(formData?.certificates) && (
            <Section title="Certificates" hr wrap>
              <Certificates certs={formData?.certificates} />
            </Section>
          )}
        </View>
      </Page>
    </Document>
  );
};
