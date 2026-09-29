import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    dehydrate: () => ({ queryCache: JSON.stringify(dehydrate(queryClient)) }),
    hydrate: (data) => {
      hydrate(queryClient, JSON.parse(data.queryCache));
    },
    defaultPreloadStaleTime: 0,
  });

  return router;
};
