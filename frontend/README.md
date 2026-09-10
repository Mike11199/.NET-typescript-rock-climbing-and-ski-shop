# Storefront frontend

The storefront uses the .NET API at `/apiv2`. Legacy admin pages and Socket.IO chat have been removed. Successful password and Google logins open `/user`, including accounts with the historical `isAdmin` flag. Old `/admin/*` bookmarks redirect to `/user`.

From this directory:

- `npm start` starts Vite.
- `npm run build` creates the production build.
- `npm run test:cleanup` runs the login, navigation, and retired-route regression tests with Node.js 18 or newer. These tests use the existing TypeScript and React test renderer dependencies, with external services mocked.

The .NET API still has no customer profile-update endpoint; the existing profile-update form is a separate migration task.

