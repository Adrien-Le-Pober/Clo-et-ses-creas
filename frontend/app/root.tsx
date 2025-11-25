import { AuthProvider } from "~/auth/authContext";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

import Navbar from "./layouts/navbar";
import Footer from "./layouts/footer";

import error_404 from "./../assets/images/error_404.png";
import error_404_mobile from "./../assets/images/error_404_mobile.png";
import { CartProvider } from "./order/cart/CartContext";
import AddToCartModal from "./components/addToCartModal";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type:"image/jpg", href:"../public/favicon.jpg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Belleza&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <html lang="fr">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            
            <header>
              <Navbar/>
            </header>

            <main className="container mx-auto min-h-56">
              <AddToCartModal />
              {children}
            </main>
            
            <Footer/>

            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </CartProvider>
    </AuthProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    is404 = error.status === 404;
    message = is404 ? "404" : error.status.toString();
    details = is404 ? "" : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      {is404 ? (
        <picture>
          <source srcSet={error_404} media="(min-width: 768px)" />
          <img src={error_404_mobile} alt="404 error" />
        </picture>
      ) : (
        <h1>{message}</h1>
      )}
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
