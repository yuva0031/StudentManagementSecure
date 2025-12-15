# Secured Student Management System

## Backend (ASP.NET Core Web API) + Frontend (Angular Standalone + SSR)

- Authorized and authenticated users can register, log in, and perform secured CRUD operations on student records  
- Used a persistent SQL database to store and manage student data records

- Identified that browser-specific APIs such as `localStorage` are unavailable during server-side rendering  
- Used `PLATFORM_ID` and `isPlatformBrowser()` to conditionally execute browser-only authentication logic  
- Ensured authentication-related operations are activated only when running in the browser environment  
- Stored JWT tokens in `localStorage` for this implementation, with access restricted to browser context only  

- Authentication is handled using ASP.NET Core Identity  
- Secured backend API endpoints using the `[Authorize]` attribute  

- Implemented a global Angular HTTP interceptor (`auth.interceptor.ts`)  
- Interceptor intercepts all outgoing HTTP requests and automatically attaches the JWT Bearer token using `setHeaders`, ensuring authorized access without manual header handling  

- Implemented frontend route protection using `AuthGuard` to restrict access to the `/students` route unless the user is authenticated  

- Used Angular `signal()` for managing reactive application state such as authentication status and student list  
- even though angular updates UI on update for asynchronous requests to update UI, used `signal()`, `computed()`, and `effect()` to enable synchronous access  
- proper SSR hydration at the browser level by relying on Angular signals for change detection  

