This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Key Features:

- [Next-auth v5](https://authjs.dev/guides/upgrade-to-v5) (Auth.js)
- Next.js 14 with server actions
- Credentials Provider
- OAuth Provider (Social login with Google & GitHub)
- Forgot password functionality
- Email verification
- Two factor verification (2FA)
- User roles (Admin & User)
- Login component (Opens in redirect or modal)
- Register component
- Forgot password component
- Verification component
- Error component
- Login button
- Logout button
- Role Gate
- Exploring next.js middleware
- Extending & Exploring next-auth session
- Exploring next-auth callbacks
- useCurrentUser hook
- useRole hook
- currentUser utility
- currentRole utility
- Example with server component
- Example with client component
- Render content for admins using RoleGate component
- Protect API Routes for admins only
- Protect Server Actions for admins only
- Change email with new verification in Settings page
- Change password with old password confirmation in Settings page
- Enable/disable two-factor auth in Settings page
- Change user role in Settings page (for development purposes only)
- Free Postgres sql DB on [NEON](https://neon.tech/)
- Our entire application is protected (user needs to-be logged in ) except lending page, login, sign-up page.
- Logged in users cant access login page or sign-up page. gets redirected if tried to access.
- People registered with OAuth providers(google/github) don't need email verification (field auto set for them)
- Here email verification is a Date type not a boolean. So we can see at a glace when an user verified his/her email.
- User can regenerate verify mail by trying to login with a registered but not verified email.
- 2FA will expire every time a user loges in. Means user need to authenticate every time he/she loges in.
- 2FA code will expire after 15 minutes the 6 digit authentication code will be sent to email.

## Packages:

- ShadCN : reuseable components. (button, form, input, dropdown-menu, avatar, badge, sonner, switch, select, dialog)
- React-icons: icon PKG.
- Zod: validator
- React-hook-form: Simplifies the creation and validation of forms in React.
- Prisma: ORM
- @prisma/client: Auto-generated query builder that enables type-safe database access.
- @auth/prisma-adapter: ([Auth.js for prisma](https://authjs.dev/reference/adapter/prisma))
- Bcrypt & @types/bcrypt: A library to help you hash passwords.
- Next-auth@beta: V5 of nextAuth.
- UUID & @types/uuid: For the creation of RFC4122 UUIDs. Here used for generating verification tokens.
- Resend: For sending verification email.
- react-spinners: A collection of loading spinners with React.js based on Halogen.

## improvement:

- Enable option to send verification email again after 3 minutes with a clock counting the time.
