// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/').pop();

  const slugFetch = await fetch(`${req.nextUrl.origin}/api/get-link/${slug}`);
  if (slugFetch.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  const data = await slugFetch.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:slug'
};
