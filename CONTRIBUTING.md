# Contributing to iScaleXchange

Thank you for considering a contribution. iScaleXchange is open source, but it
is maintainer-led: contributions are welcome when they fit the product direction,
quality bar, license obligations, and public-repo safety rules.

## Before You Start

Open an issue before starting work when the change is large, changes product
direction, changes public UI patterns, affects licensing/branding, changes
database schema, or adds a dependency.

Small fixes can go straight to a pull request.

## Contribution Terms

By contributing, you confirm that:

- you have the right to submit the contribution;
- your contribution is submitted under this repository's license;
- your contribution does not include secrets, private data, or code copied from
  a source that cannot be redistributed here;
- you understand that maintainers may edit, reject, or close contributions that
  do not fit the project.

We use Developer Certificate of Origin style sign-off. Please sign commits with:

```bash
git commit -s -m "Describe the change"
```

## Local Setup

```bash
git clone https://github.com/iScale-Builders/iscale-builders.git
cd iscale-builders
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

Clerk, Postgres, and Redis are required for authenticated submissions, voting,
comments, and admin workflows. Public builds are allowed to compile without a
local database connection; in that case generated static lists fall back to
empty lists instead of mock product data.

## Required Checks

Before opening a pull request, run:

```bash
npm run build
node node_modules/typescript/bin/tsc --noEmit
npm audit
```

Do not add a check to the pull request description unless it actually passed.

## Product And UI Standards

- Keep the existing visual system and interaction patterns unless the issue or
  pull request explicitly proposes a design change.
- Do not add mock/fake product data as live product truth.
- Do not reintroduce paid pricing or payment routes without maintainer approval.
- Keep comments available on coming-soon listings unless a maintainer approves a
  change.
- Keep public browsing/search/listing pages usable without authentication.
- Make mobile and desktop layouts readable, non-overlapping, and consistent with
  the existing app.

## Safety Rules

Do not commit:

- `.env` files, tokens, credentials, or real secrets;
- `.vercel`, local runtime state, logs, or machine-specific config;
- `AGENTS.md`, `CLAUDE.md`, `ROUTER.md`, `memory/`, `tasks/`, or private
  workspace/agent bridge files;
- private iScaleLabs planning docs, production data, screenshots with private
  data, or internal operating process.

## License And Attribution

This project is currently distributed under the Open-Launch License. The
required Open-Launch attribution must remain intact.

iScaleLabs and iScaleXchange names, logos, domains, and brand assets are not
licensed for reuse just because the code is public. See `NOTICE.md` and
`TRADEMARKS.md`.

## Pull Request Expectations

Pull requests should include:

- a clear summary;
- why the change is needed;
- screenshots or screen recordings for UI changes;
- the checks you ran;
- any risks, migrations, or follow-up work.

Maintainers may request changes, squash commits, edit wording, or close pull
requests that are stale, unsafe, too broad, off-direction, or not worth the
maintenance cost.

## Reporting Bugs And Security Issues

Use GitHub issues for normal bugs and feature requests.

Report security issues privately by following `SECURITY.md`.
