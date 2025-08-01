import { useEffect, useState } from "react";
import { signIn, supabase } from "./supabaseClient";

export const useAuth = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        try {
          // await signIn("michael.studenets+1@gmail.com", "$Ms123456");
          await signIn("vladprytula.work@gmail.com", "Password1111");
          console.log("Successfully signed in");
        } catch (error) {
          console.error("Auto-sign-in failed:", error);
        }
      }
      // else {
      //   console.log("Existing session:", session);
      // }

      setIsAuthReady(true);
    };

    initAuth();
  }, []);

  return { isAuthReady };
};
