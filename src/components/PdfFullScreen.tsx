import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Document, Page } from 'react-pdf';
import { Expand, Loader2 } from 'lucide-react';

import { Button } from './ui/button';
import SimpleBar from 'simplebar-react';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { useToast } from './ui/use-toast';

interface PdfFullScreenProps {
  fileUrl: string;
}

const PdfFullScreen = ({ fileUrl }: PdfFullScreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant='ghost' className='gap-1.5' aria-label='fullscreen'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        {/* right moving bar, simplebar is same as PdfRenderer too*/}
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
          {/* copy from PdfRenderer, ref and document */}
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
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileUrl}
              className='max-h-full'
            >
              {/* map over all pages we have */}
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={width ? width : 1}
                  className='max-h-full'
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
