import { useEffect } from "react";
import { signIn, supabase } from "./supabaseClient";

export const useAuth = () => {
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        try {
          await signIn("michael.studenets+1@gmail.com", "$Ms123456");
          console.log("Successfully signed in");
          const {
            data: { session: newSession },
          } = await supabase.auth.getSession();
          console.log("Session after sign-in:", newSession);
        } catch (error) {
          console.error("Auto-sign-in failed:", error);
        }
      } else {
        console.log("Existing session:", session);
      }
    };
    initAuth();
  }, []);
};
