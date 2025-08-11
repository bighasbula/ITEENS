import { useUser as useClerkUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function useUser() {
  const { user, isLoaded } = useClerkUser();
  const createUserIfNotExists = useMutation(api.users.createUserIfNotExists);

  useEffect(() => {
    if (isLoaded && user) {
      // Create user record in Convex if it doesn't exist
      createUserIfNotExists({
        userId: user.id,
        username: user.username || user.firstName || user.emailAddresses[0]?.emailAddress,
      }).catch(console.error);
    }
  }, [isLoaded, user, createUserIfNotExists]);

  return {
    user,
    isLoaded,
    userId: user?.id,
  };
}
