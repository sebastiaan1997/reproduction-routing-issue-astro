# Astro 6 regression: nested prerendered catch-all no longer falls back to root SSR catch-all on Vercel

After upgrading from Astro 5 to Astro 6, unmatched nested catch-all routes return `404` on Vercel instead of falling back to the root SSR catch-all if the nested catch-all is prerendered. I verified that Astro `5.16.5` behaved consistently between local dev and Vercel production on the Vercel free tier.

Routes:

```txt
src/pages/[...slug].astro         # prerender = false
src/pages/nested/[...slug].astro  # prerender = true, with getStaticPaths()
```

Nested static paths:

```astro
---
import type { GetStaticPaths } from "astro";

export const prerender = true;

export const getStaticPaths = (() => {
  return [
    { params: { slug: "1" } },
    { params: { slug: "2" } },
  ];
}) satisfies GetStaticPaths;
---
```

Root catch-all:

```astro
---
export const prerender = false;
---
```

## Expected

Unknown nested paths should fall back to the root SSR catch-all if the nested catch-all is prerendered, as they did in Astro `5.16.5`:

```txt
/nested/3 -> src/pages/[...slug].astro
```

## Actual

Astro 6 on Vercel:

```txt
/test     -> root SSR catch-all
/nested/1 -> prerendered nested route
/nested/3 -> 404
```

Astro 6 local dev still sends `/nested/3` to the root SSR catch-all, matching Astro 5. The regression only appears in the Astro 6 Vercel production build.

I checked the Astro v6 migration guide and did not see this route fallback behavior documented as a breaking change.

Is this fallback behavior change intentional in Astro 6? If so, what is the recommended way to prerender known nested catch-all paths while allowing unknown nested paths to fall back to a root server-rendered catch-all?
