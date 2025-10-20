import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { CreatePDF } from '.';

export default function ClientPdfViewer({ cvData }: { cvData?: CvData }) {
  return (
    <div className="h-[70vh] w-full">
      <PDFViewer showToolbar={false} style={{ width: '100%', height: '100%' }}>
        <CreatePDF formData={cvData} />
      </PDFViewer>
    </div>
  );
}
