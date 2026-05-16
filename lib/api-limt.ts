import { MAX_FREE_COUNTS } from "@/constants";
import { auth } from "@clerk/nextjs/server";

export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  // TODO: wire up database-backed API limit tracking
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  // TODO: wire up database-backed API limit tracking
  return true;
};

export const getApiLimitCount = async (): Promise<number> => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  // TODO: wire up database-backed API limit tracking
  return 0;
};
