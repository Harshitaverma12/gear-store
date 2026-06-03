# DECISIONS.md

## The decision I could have gone either way on: client-side filtering vs per-request API calls

When the nav links needed to filter by category, the obvious approach was hitting
`GET /products/category/:name` on each click — one request, fresh data, less JS work.
I went the other way: fetch all 20 products and both category endpoints once in a
`Promise.all` on mount, then filter entirely in the browser.

The reason was "Sale." FakeStore has no `/products/category/sale` endpoint, so sale had
to be a client-side flag (`p.id % 3 === 0`) from the start. Once one filter lives
client-side, mixing two strategies — API calls for real categories, local filtering for
sale — means two loading states, two error paths, and filters that can't be composed.
Doing everything client-side made sale, category, and search all work the same way:
read from URL params, filter the same array, no extra fetch. With 20 products the
performance cost is nothing. With 2,000 it would be a different call.

The case for per-request: fresher data, smaller initial payload, server-side pagination
becomes possible. I'd switch if the catalogue grew or if the API returned real sale data.

---

## What I'd clean up with more time

**Stock is per-size globally, not per-colour-per-size.** Right now a medium in Forest
Green and a medium in Navy share the same stock number. The data model in
`productConfig.js` would need to become `{ colorId → { sizeId → stock } }`. The hook
and UI are already structured so the change would be contained — but it's the thing I'd
fix first before calling this production-ready.

**`onSale` is `p.id % 3 === 0`.** Products 3, 6, 9, 12... are on sale. That's a
placeholder. In a real system this comes from the API or a promotions service. The
15% discount and the `×3.2` price scale are in `productConfig.js` so they're easy to
find, but the flag itself is fiction.

**Gallery images are Unsplash, not product photos.** The first image is the real
FakeStore product image. The remaining four gallery slots are category-matched Unsplash
photos — jewellery photos for jewellery, electronics for electronics — but they're not
the same product. A real PDP needs multiple studio shots of the same item, which this
API doesn't provide.

**No error boundary.** Async fetch errors are handled gracefully, but a rendering error
inside `ProductInfo` or `CartDrawer` would crash the whole page. A single
`ErrorBoundary` wrapping the route tree would fix that.

**No tests.** The variant selection logic — sold-out blocking, quantity capping, URL
sync — is the most likely place to introduce regressions when something else changes.
It should have Vitest unit tests. It doesn't.
