import retry from "./index";

describe(__filename, () => {
  it(`can run successfully with defaults`, async () => {
    const f = () => 1;
    expect(await retry(f)).toEqual(1);
    const af = async () => 1;
    expect(await retry(af)).toEqual(1);
  });

  it(`can throw the error thrown`, async () => {
    const e = new Error();
    const f = () => {
      throw e;
    };
    expect(retry(f)).rejects.toBe(e);
  });

  it(`can retry n times`, async () => {
    const attempts = 5;
    let trials = 0;
    const f = async () => {
      trials++;
      if (trials < attempts) throw new Error();
      return 1;
    };
    await retry(f, { attempts });
    expect(trials).toEqual(attempts);
  });

  it(`can retry n times with specified interval`, async () => {
    const attempts = 5;
    const interval = 200;
    let trials = 0;
    const trialTimestamp: Date[] = [];
    const f = async () => {
      trials++;
      trialTimestamp.push(new Date());
      if (trials < attempts) throw new Error();
      return 1;
    };
    await retry(f, { attempts, interval });
    expect(
      trialTimestamp.reduce(
        (prev, curr, ind, arr) =>
          prev &&
          (ind === 0 ||
            Math.abs(curr.getTime() - arr[ind - 1].getTime() - interval) < 100),
        true
      )
    ).toBeTruthy();
  });
});
