# Chatting with your documents using AI 🤗

Learning resouce from Youtube channel [Josh tried coding](https://www.youtube.com/watch?v=ucX2zXAZ1I0&t=3760s&ab_channel=Joshtriedcoding)

## Getting Started

First, run the development server:

```bash
npm run dev
```

## Develop progress:

✅ Landing Page <br>
✅ Navigation<br>
✅ Auth<br>
Functionality <br>

- ✅ Dashboard setting<br>
- ✅ tRPC setup<br>
- ✅ Create database using Prisma<br>
- ✅ Syncing Database<br>
- ✅ Delete File functionality<br>
- ✅ Dynamic [fileid] Routing<br>
- ✅ Product Page<br>

Payment and Launch <br>

## Tech stack:

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

## Learn Notes:

- alt+shit+o (Just note for myself)
- tsx-> in html, We\&apos;ll = we'll
- \_trpc folder under app is not for route (navigate to the URL)
- Data type: In `providers.tsx`, `Providers = ({ children }: PropsWithChildren)` same as `{child}:{children: ReactNode}`
- Setting auth-callback, frontend set: `src/app/auth-callback/page.tsx`, backend set: `src/trpc/index.ts`
- `npx prisma studio` check prisma database in browser, host on http://localhost:5555/
- Everytime change `schema.prima file`, do `npx prisma db push` and `npx prisma generate`
- Determinate progress bar
