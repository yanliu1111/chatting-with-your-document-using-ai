# Chatting with your documents using AI 🤗

Learning resouce from Youtube channel 👍 [Josh tried coding](https://www.youtube.com/watch?v=ucX2zXAZ1I0&t=3760s&ab_channel=Joshtriedcoding)

## 🏁 Getting Started

First, run the development server:

```bash
npm run dev
```

## 👩‍🎨 Develop progress:

✅ Landing Page <br>
✅ Navigation<br>
✅ Auth<br>

🧱 Functionality <br>

- ✅ Dashboard setting<br>
- ✅ tRPC setup<br>
- ✅ Create database using Prisma<br>
- ✅ Syncing Database<br>
- ✅ Delete File functionality<br>
- ✅ Dynamic [fileid] Routing<br>
- ✅ Product Page<br>
- ✅ PDF Uploader functionality and ui<br>
- ✅ Features bar for PDF Viewer<br>
- ✅ Create Message section and instant loading State<br>
- ✅ ChatInput functionality<br>
- ✅ Streaming API response in real time<br>
- LLM (semantic query) (first try 😀)<br>
- pinecone.io for vector database

  Payment and Launch <br>

## 🧷Tech stack:

- clsx tailwind-merge
- Theme in global.css from 'https://ui.shadcn.com/themes'
- tailwindcss-animate @tailwindcss/typography
- lucide-react
- npx shadcn-ui@latest init (choose components ui from uishadcn website)
  -- for example `npx shadcn-ui@latest add button` `npx shadcn-ui@latest add dialog`
- in div, set `aria-hidden='true'` for screen readers because is purely decorational people with visual disabilities won't care about it.Therefore, we can hide it on their devices making their navigation through our website much easier.
- For sign in function, `npm i @kinde-oss/kinde-auth-nextjs` (not really neccessary to learn this package for signin or register)
- [tRPC](https://trpc.io/docs/client/nextjs/setup) get automatically type safety from backend
- Prisma `npx prisma init` using mysql
- Planetscale - select Prisma as ORM `npx prisma db push`
- Dependency install `react-loading-skeleton` for loading animation
- Dependency install `install date-fns` for date format
- Dependency install `react-pdf` for pdf viewer
- Dependency install `react-dropzone` for drag and drop file
- Dependency install `shadcn-ui@latest add progress` for progress bar animation
- `uploadthing.com` for PDF storage, and install `@uploadthing/react`
- Dependency install `react-resize-detector` for resize window
- Dependency install `npx shadcn-ui@latest add input` for input box
- Dependency install `react-hook-form`and `@hookform/resolvers` for form validation
- Dependency install `shadcn-ui@latest add dropdown-menu`
- Dependency install `simplebar-react` for scroll bar
- Dependency install `npx shadcn-ui@latest add textarea` for message textarea
- Dependency install `react-textarea-autosize` for auto resize textarea
- Install `@pinecone-database/pinecone`
- Install `langchain`
- Install `pdf-parse` for langchain pdf parsing
- Install `openai`
- Install `ai` from `https://www.npmjs.com/package/ai`

## 🎃 Learn Notes:

- 😍 I just found the way to ask github copilot question using `control+shit+I`, which is silimar asking gpt platform, but it is easier to directly ask programming related questions in vscode. I like it.

- alt+shit+o (Just note for myself)
- tsx-> in html, We\&apos;ll = we'll
- \_trpc folder under app is not for route (navigate to the URL)
- Data type: In `providers.tsx`, `Providers = ({ children }: PropsWithChildren)` same as `{child}:{children: ReactNode}`
- Setting auth-callback, frontend set: `src/app/auth-callback/page.tsx`, backend set: `src/trpc/index.ts`
- `npx prisma studio` check prisma database in browser, host on http://localhost:5555/
- Everytime change `schema.prima file`, do `npx prisma db push` and `npx prisma generate`
- Determinate progress bar
- Simple PDF loading code for 1st testing

```ts
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
  <Page pageNumber={1} />
</Document>
```

## 🐞Bug fix:

1. Fix bug:
   When render pdf file got the error in cmd `you may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.` This is why needs <mark>worker</mark> <br>
   Go to `next.config` and change

```js
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};
```

pdf is not like images we cannot render them instead we need a custom webpack config inside of next config and `pdfRenderer.tsx`

```ts
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
```

<br>
2. Got the error, just after login

```
Unhandled Runtime Error
Error:
Invalid `prisma.user.findFirst()` invocation:
Error querying the database: Server error: `ERROR HY000 (1105): unavailable: unable to connect to branch nv0jhhj9a59u'
 if (!user || !user.id) redirect('/auth-callback?origin=dashboard');
  13 |
> 14 | const dbUser = await db.user.findFirst({
     |               ^
  15 |   where: {
  16 |     id: user.id,
  17 |   },
```

1. The reason is planetscale database is not connected. Go to planetscale and connect the database again. Then, go to `prisma/schema.prisma` and change the database name to the new one.
2. Then, run `npx prisma db push` and `npx prisma generate` again. It should be fixed. Then `ctrl` + `shift` + `P` choose `Developer: Reload Window` (02:12:30)
3. Go to `$ npx prisma studio` to clean up the user email and pdf upload files.
   All work fine now.
