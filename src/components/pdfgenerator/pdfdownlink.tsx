'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CreatePDF } from '.';
import { Button } from '../ui/button';
import { FileDown } from 'lucide-react';

type PropsType = {
  cvData?: CvData;
};

const Pdfdownlink = (props: PropsType) => {
  return (
    <div>
      <PDFDownloadLink
        document={<CreatePDF formData={props.cvData} />}
        fileName={`${props.cvData?.fullName}Avensia-CV.pdf`}
        style={{ textDecoration: 'none', color: 'blue' }}
      >
        {({ loading }) => (
          <Button variant="secondary">
            <FileDown />
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default Pdfdownlink;
