/*https://www.npmjs.com/package/react-pdf*/
'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ChevronDown, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useResizeDetector } from 'react-resize-detector';
import { useToast } from './ui/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface pdfRenderProps {
  url: string;
}
const PdfRenderer = ({ url }: pdfRenderProps) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      {/* pdf options */}
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button variant='ghost' aria-label='previous page'>
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input className='w-12 h-8' />
          </div>
        </div>
      </div>

      {/* pdf viewer */}
      <div className='flex-1 w-full max-h-screen'>
        <div ref={ref}>
          <Document
            loading={
              <div className='flex justify-center'>
                <Loader2 className='my-24 h-6 w-6 animate-spin' />
              </div>
            }
            onLoadError={() => {
              toast({
                title: 'Error loading pdf',
                description: 'Something went wrong while loading the pdf.',
                variant: 'destructive',
              });
            }}
            file={url}
            className='max-h-full'
          >
            <Page width={width ? width : 1} pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
