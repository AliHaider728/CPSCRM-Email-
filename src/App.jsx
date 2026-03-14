import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppLayout } from "./components/layout/AppLayout.jsx";
import Dashboard    from "./pages/Dashboard.jsx";
import Clients      from "./pages/Clients.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import Emails       from "./pages/Emails.jsx";
import Team         from "./pages/Team.jsx";
import Notifications from "./pages/Notifications.jsx";
import NotFound     from "./pages/not-found.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
    mutations: { retry: 0 },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/"              component={Dashboard} />
        <Route path="/clients"       component={Clients} />
        <Route path="/clients/:id"   component={ClientDetail} />
        <Route path="/emails"        component={Emails} />
        <Route path="/team"          component={Team} />
        <Route path="/notifications" component={Notifications} />
        <Route                       component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}