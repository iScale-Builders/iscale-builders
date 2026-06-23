# iScaleBuilders

[![License: Open Launch](https://img.shields.io/badge/License-Open_Launch-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)

iScaleBuilders is a public directory for AI builder tools, workflows, and launch
experiments. The live site is [iscalebuilders.com](https://iscalebuilders.com).

![iScaleBuilders preview](https://iscalebuilders.com/og.png)

> Built on [Open-Launch](https://open-launch.com) and distributed under the
> Open-Launch License. iScaleBuilders retains the required visible
> "Powered by Open-Launch" attribution.

## Features

- Tool discovery and searchable listings
- User submissions, voting, and comments
- Builder profiles and project detail pages
- Blog and SEO article surfaces
- Category, alternative, and comparison pages
- Admin and moderation workflows
- Open-Launch attribution and badge pages

## Quick Start

```bash
git clone https://github.com/iScale-Builders/iscale-builders.git
cd iscale-builders
npm install --legacy-peer-deps
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:push
npm run dev
```

For local development, set `NEXT_PUBLIC_URL` and `BETTER_AUTH_URL` to your local
URL in `.env`.

## Verification

```bash
npm run build
node node_modules/typescript/bin/tsc --noEmit
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- Redis
- Clerk
- Stripe
- Resend

## Deployment

Production is intended to run at [iscalebuilders.com](https://iscalebuilders.com).
Set `NEXT_PUBLIC_URL` and any public app URL variables to that domain for
production.

## Contributing

Contributions are welcome once the public repo is open. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is distributed under the Open-Launch License. See [LICENSE](LICENSE)
for details. The license requires visible dofollow attribution to
[Open-Launch](https://open-launch.com).
