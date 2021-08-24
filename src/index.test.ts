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
});
