'use client';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

import { Button } from './ui/button';
import { useState } from 'react';

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
        {/* custom button, not a button that dialog is inherently, aschild makes the Button instead not pre-wrapped in one more button */}
        <Button>Upload PDF</Button>
      </DialogTrigger>
      {/* use custom components for dialog content */}
      <DialogContent>example content</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
