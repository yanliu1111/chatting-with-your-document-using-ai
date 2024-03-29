import { OpenAIStream, StreamingTextResponse } from 'ai';

import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getPineconeClient } from '@/lib/pinecone';
import { ms } from 'date-fns/locale';
import { openai } from '@/lib/openai';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const { id: userId } = user;
  if (!userId) return new Response('Unauthorized', { status: 401 });
  //body contents are validated against the schema, schema validation library, zod, makes sure that we always have data. Create a validator for each endpoint.
  //before create body contents, we created the validators in lib/validators/SendMessageValidator.ts
  const { fileId, message } = SendMessageValidator.parse(body);
  // when parse works, it always fileId and message init. Find file in db
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });
  if (!file) return new Response('Not found', { status: 404 });
  //if file found, create message, do db
  //create message in prisma/schema
  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });
  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index('docsai');
  //debugging, for instead namespacing using metadata
  //instead add metadata to each document you send to db and for getting similaritySearches just pass the metadata you included as third argument. this way you dont need to use namespaces in pinecone vectorStore
  //use metadata to each document you send to db and for getting similaritySearches just pass the metadata you included as third argument. this way you dont need to use namespaces in pinecone vectorStore
  const userMessage = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    filter: { fileId },
  });

  const results = await userMessage.similaritySearch(message, 4); // 4 closest results

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6, // 6 previous messages
  });
  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ('user' as const) : ('assistant' as const), //as const means that the type is a string literal
    content: msg.text,
  }));
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      // how to prompt the model
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            
      \n----------------\n
      
      PREVIOUS CONVERSATION:
      ${formattedPrevMessages.map((message) => {
        if (message.role === 'user') return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}
      
      \n----------------\n
      
      CONTEXT:
      ${results.map((r) => r.pageContent).join('\n\n')}
      
      USER INPUT: ${message}`,
      },
    ],
  });
  //real time streaming back to client, install package ai
  //cannot trpc but instead of custom route
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });
  //just returned steam from here , now accept in the context
  return new StreamingTextResponse(stream);
};
