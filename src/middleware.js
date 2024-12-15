import { getToken } from "next-auth/jwt"; // Import NextAuth's function to get the JWT from the request
import { NextResponse } from "next/server"; // Import NextResponse for handling responses in middleware

export async function middleware(req) {
   // Log every request URL middleware processes

  // Extract the token from the request, which indicates the user's authentication state
  const token = await getToken({
    req, // Pass the request object
    secret: process.env.NEXTAUTH_SECRET, // Use the secret key defined in .env.local for JWT validation
    secureCookie: process.env.NODE_ENV === "production", // Use secure cookies in production for better security
  });
  // Log the token (null if unauthenticated)

  const { pathname } = req.nextUrl; // Extract the pathname from the request URL
   // Log the pathname for debugging

  // Allow access to the home page ("/") and API routes ("/api/*")
  if (pathname === "/" || pathname.startsWith("/api")) {
    // Log public route access
    return NextResponse.next(); // Continue to the requested resource
  }

  // Redirect unauthenticated users trying to access the /dashboard route
  if (pathname.startsWith("/dashboard") && !token) {
     // Log the redirect
    const loginUrl = new URL("/sign-in", req.url); // Create a new URL object for the /sign-in route
    return NextResponse.redirect(loginUrl); // Redirect the user to the login page
  }

  // Allow access to all other routes if no conditions are met
   // Log that the request is allowed
  return NextResponse.next(); // Continue to the requested resource
}



/*The log output indicates that your application is running smoothly with the middleware and token verification processes working as intended. Here’s a summary and some points to consider:

Key Observations:
Middleware Functionality:

The middleware is triggered for various requests (/, /api/auth/session, and static assets).
The token is being fetched, validated, and logged for each request.
Public routes are correctly allowing requests to proceed without authentication issues.
Token Information:

Tokens contain user data such as email, sub, id, iat (issued at), and exp (expiration).
Expiration times are validated, and the tokens are successfully allowing access to protected and public routes.
Next.js Compilation:

Pages and static files are compiling as expected (/, /api/auth/[...nextauth], etc.).
Hot Module Replacement (HMR) files like webpack.hot-update.json are being fetched and updated, suggesting the development environment is active and responsive.
Warnings:

A warning for NEXTAUTH_URL suggests that the environment variable for NEXTAUTH_URL might not be set. This URL is essential for NextAuth.js to determine the base URL for the application.
Fix: Add the NEXTAUTH_URL environment variable in .env or .env.local:
arduino
Copy code
NEXTAUTH_URL=http://localhost:3000
Replace with your production URL when deploying.
API and Route Handling:

Requests to /api/auth/session and other API endpoints are working, returning 200 responses.
Middleware logs confirm that authentication and route permissions are functioning properly.
Recommendations:
Check Middleware Logging:

If middleware logs are not required in production, consider reducing their verbosity to avoid clutter.
Optimize Token Validation:

Tokens are fetched and logged multiple times for static assets (e.g., /next.svg). If these routes don’t need authentication, exclude them from middleware checks for better performance.
Address NEXTAUTH_URL Warning:

Ensure NEXTAUTH_URL is correctly configured to avoid potential issues with callback URLs or authentication workflows.
Enhance Security:

Hide sensitive logs (e.g., token details) in production to safeguard user information.
If you're testing a new feature or encountering issues, let me know so we can dive deeper into the relevant areas. */





/*Request Pathname: /_next/static/webpack/b848056c8fdb125f.webpack.hot-update.json
Request allowed to proceed.
Middleware triggered: http://localhost:3000/_next/static/webpack/webpack.b848056c8fdb125f.hot-update.js
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/webpack.b848056c8fdb125f.hot-update.js
Request allowed to proceed.
 GET /api/auth/session 200 in 9719ms
Middleware triggered: http://localhost:3000/_next/static/webpack/28283f5749113ea7.webpack.hot-update.json
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/28283f5749113ea7.webpack.hot-update.json
Request allowed to proceed.
Middleware triggered: http://localhost:3000/_next/static/webpack/app/layout.28283f5749113ea7.hot-update.js
Middleware triggered: http://localhost:3000/_next/static/webpack/webpack.28283f5749113ea7.hot-update.js
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/app/layout.28283f5749113ea7.hot-update.js
Request allowed to proceed.
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/webpack.28283f5749113ea7.hot-update.js
Request allowed to proceed.
 ✓ Compiled in 1825ms (654 modules)
Middleware triggered: http://localhost:3000/
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /
Public route accessed, allowing request.
Middleware triggered: http://localhost:3000/_next/static/webpack/ba05a27b29e5db18.webpack.hot-update.json
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/ba05a27b29e5db18.webpack.hot-update.json
Request allowed to proceed.
 GET / 200 in 598ms
Middleware triggered: http://localhost:3000/_next/static/webpack/app/layout.ba05a27b29e5db18.hot-update.js
Middleware triggered: http://localhost:3000/_next/static/webpack/webpack.ba05a27b29e5db18.hot-update.js
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/app/layout.ba05a27b29e5db18.hot-update.js
Request allowed to proceed.
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/webpack/webpack.ba05a27b29e5db18.hot-update.js
Request allowed to proceed.
Middleware triggered: http://localhost:3000/_next/static/css/app/layout.css?v=1733473025977
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/css/app/layout.css
Request allowed to proceed.
Middleware triggered: http://localhost:3000/
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /
Public route accessed, allowing request.
 GET / 200 in 402ms
Middleware triggered: http://localhost:3000/_next/static/css/app/layout.css?v=1733473043551
Middleware triggered: http://localhost:3000/_next/static/chunks/webpack.js?v=1733473043551
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/css/app/layout.css
Request allowed to proceed.
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
Request Pathname: /_next/static/chunks/webpack.js
Request allowed to proceed.
Middleware triggered: http://localhost:3000/_next/static/chunks/app-pages-internals.js
Middleware triggered: http://localhost:3000/_next/static/chunks/main-app.js?v=1733473043551
Middleware triggered: http://localhost:3000/_next/static/chunks/app/page.js
Middleware triggered: http://localhost:3000/_next/static/chunks/app/layout.js
Token fetched: {
  email: 'recipieGuru14@gmail.com',
  sub: '6751a8af0299789fa76bca45',
  id: '6751a8af0299789fa76bca45',
  iat: 1733466099,
  exp: 1736058099,
  jti: '561d32e7-04db-4079-b610-06d623d4c473'
}
  

The log output indicates that your application is running smoothly with the middleware and token verification processes working as intended. Here’s a summary and some points to consider:

Key Observations:
Middleware Functionality:

The middleware is triggered for various requests (/, /api/auth/session, and static assets).
The token is being fetched, validated, and logged for each request.
Public routes are correctly allowing requests to proceed without authentication issues.
Token Information:

Tokens contain user data such as email, sub, id, iat (issued at), and exp (expiration).
Expiration times are validated, and the tokens are successfully allowing access to protected and public routes.
Next.js Compilation:

Pages and static files are compiling as expected (/, /api/auth/[...nextauth], etc.).
Hot Module Replacement (HMR) files like webpack.hot-update.json are being fetched and updated, suggesting the development environment is active and responsive.
Warnings:

A warning for NEXTAUTH_URL suggests that the environment variable for NEXTAUTH_URL might not be set. This URL is essential for NextAuth.js to determine the base URL for the application.
Fix: Add the NEXTAUTH_URL environment variable in .env or .env.local:
arduino
Copy code
NEXTAUTH_URL=http://localhost:3000
Replace with your production URL when deploying.
API and Route Handling:

Requests to /api/auth/session and other API endpoints are working, returning 200 responses.
Middleware logs confirm that authentication and route permissions are functioning properly.
Recommendations:
Check Middleware Logging:

If middleware logs are not required in production, consider reducing their verbosity to avoid clutter.
Optimize Token Validation:

Tokens are fetched and logged multiple times for static assets (e.g., /next.svg). If these routes don’t need authentication, exclude them from middleware checks for better performance.
Address NEXTAUTH_URL Warning:

Ensure NEXTAUTH_URL is correctly configured to avoid potential issues with callback URLs or authentication workflows.
Enhance Security:

Hide sensitive logs (e.g., token details) in production to safeguard user information.
If you're testing a new feature or encountering issues, let me know so we can dive deeper into the relevant areas.*/
