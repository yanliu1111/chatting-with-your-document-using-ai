# Chatting with your documents using AI 🐱‍💻

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
- ✅ Create database<br>

Payment and Launch <br>

## Tech stack:

- clsx tailwind-merge
- Theme in global.css from 'https://ui.shadcn.com/themes'
- tailwindcss-animate @tailwindcss/typography
- lucide-react
- npx shadcn-ui@latest init (choose components ui from uishadcn website)
  -- for example `npx shadcn-ui@latest add button`
- in div, set `aria-hidden='true'` for screen readers because is purely decorational people with visual disabilities won't care about it.Therefore, we can hide it on their devices making their navigation through our website much easier.
- For sign in function, `npm i @kinde-oss/kinde-auth-nextjs` (not really neccessary to learn this package for signin or register)
- [tRPC](https://trpc.io/docs/client/nextjs/setup) get automatically type safety from backend
-

## Learn Notes:

Just note for myself:

- alt+shit+o
- tsx-> in html, We\&apos;ll = we'll
- \_trpc folder under app is not for route (navigate to the URL)
- Data type: In `providers.tsx`, `Providers = ({ children }: PropsWithChildren)` same as `{child}:{children: ReactNode}`
