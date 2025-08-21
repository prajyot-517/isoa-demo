import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [ process.env.SESSION_SECRET ],
    secure: true,
  },
});

export { getSession, commitSession, destroySession };
