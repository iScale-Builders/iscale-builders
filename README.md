# iScaleXchange

[![License: Open Launch](https://img.shields.io/badge/License-Open_Launch-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)

iScaleXchange is a public directory for AI builder tools, workflows, and launch
experiments. The live site is [iscalexchange.com](https://iscalexchange.com).

> Built on [Open-Launch](https://open-launch.com) and distributed under the
> Open-Launch License. iScaleXchange retains the required visible
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

For local development, set `NEXT_PUBLIC_URL` and `NEXT_PUBLIC_APP_URL` to your
local URL in `.env`. Clerk, Postgres, and Redis are required for authenticated
submissions, voting, comments, and admin workflows.

The public build is designed to compile without a local database connection.
When database env is missing, static category, alternative, comparison, and
sitemap lists fall back to empty generated lists instead of using mock product
data.

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
- Resend

## Deployment

Production is intended to run at [iscalexchange.com](https://iscalexchange.com).
Set `NEXT_PUBLIC_URL` and any public app URL variables to that domain for
production.

## Contributing

Contributions are welcome when they fit the project direction, quality bar,
license obligations, and public-repo safety rules. Start with
[CONTRIBUTING.md](CONTRIBUTING.md), [GOVERNANCE.md](GOVERNANCE.md), and
[SUPPORT.md](SUPPORT.md).

Large changes should begin as an issue before implementation. Maintainers are
not obligated to merge changes that are off-direction, unsafe, too broad, or not
worth the long-term maintenance cost.

## License

This project is distributed under the Open-Launch License. See [LICENSE](LICENSE)
for details. The license requires visible dofollow attribution to
[Open-Launch](https://open-launch.com).

Additional notices and brand-use rules are documented in [NOTICE.md](NOTICE.md)
and [TRADEMARKS.md](TRADEMARKS.md). The iScaleLabs and iScaleXchange names,
logos, domains, and brand assets are not licensed for unrestricted reuse.

Security reports should follow [SECURITY.md](SECURITY.md). Community behavior is
governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
