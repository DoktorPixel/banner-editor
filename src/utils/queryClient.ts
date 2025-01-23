import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Количество попыток в случае ошибки
      staleTime: 1000 * 60 * 5, // Время, пока данные считаются актуальными (5 минут)
      cacheTime: 1000 * 60 * 10, // Время жизни данных в кэше (10 минут)
    },
  },
});
