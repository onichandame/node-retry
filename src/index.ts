type RetryOptions = {
  attempts?: number;
};

export default async <T = any>(
  f: () => T | Promise<T>,
  opts?: RetryOptions
): Promise<T> => {
  const attempts = opts?.attempts || 1;
  let trials = 0;
  while (true) {
    trials++;
    try {
      return await f();
    } catch (e) {
      if (trials >= attempts) throw e;
    }
  }
};
