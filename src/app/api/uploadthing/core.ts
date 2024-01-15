/*
https://docs.uploadthing.com/nextjs/appdir
*/
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { db } from '@/db';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { getPineconeClient, pinecone } from '@/lib/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { create } from 'domain';
// also can use other services instead of openai to take the text and turn them into a vector
const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      //only the authenticated user can upload images
      const { getUser } = getKindeServerSession();
      const user = getUser();
      if (!user || !user.id) throw new Error('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`, // instead using file.url
          uploadStatus: 'PROCESSING',
        },
      });
      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        var pageLevelDocs = await loader.load();
        //debugging, for instead namespacing using metadata
        //instead add metadata to each document you send to db and for getting similaritySearches just pass the metadata you included as third argument. this way you dont need to use namespaces in pinecone vectorStore
        pageLevelDocs = pageLevelDocs.map((doc) => {
          doc.metadata = {
            ...doc.metadata,
            fileId: createdFile.id,
          };
          return doc;
        });
        const pagesAmt = pageLevelDocs.length;
        //vectorize and index entire document
        const pinecone = await getPineconeClient();
        const pineconeIndex = pinecone.Index('docsai');
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          //@ts-ignore
          pineconeIndex,
          filter: { fileId: createdFile.id },
        });
        await db.file.update({
          data: {
            uploadStatus: 'SUCCESS',
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        console.log('FetchError!: ', error);
        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
