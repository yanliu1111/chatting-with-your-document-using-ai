/*
https://docs.uploadthing.com/nextjs/appdir
*/
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      //only the authenticated user can upload images
      const { getUser } = getKindeServerSession();
      const user = getUser();
      if (!user || !user.id) throw new Error('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userID: metadata.userId,
          url: 'https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}',
          uploadStatus: 'PROCESSING',
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
