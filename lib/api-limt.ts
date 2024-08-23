

import { MAX_FREE_COUNTS } from "@/constants";
import { auth } from "@clerk/nextjs/server";

export const incrementApiLimit = async () => {
  const { xId } = auth();

  if (!xId) {
    return;
  }

  const xApiLimit = await xxApiLimit.findUnique({
    where: { xId: xId },
  });

  if (xApiLimit) {
    await xxApiLimit.update({
      where: { xId: xId },
      data: { count: xApiLimit.count + 1 },
    });
  } else {
    await xxApiLimit.create({
      data: { xId: xId, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const { xId } = auth();

  if (!xId) {
    return false;
  }

  const xApiLimit = await x.xApiLimit.findUnique({
    where: { xId: xId },
  });

  if (!xApiLimit || xApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { xId } = auth();

  if (!xId) {
    return 0;
  }

  


};