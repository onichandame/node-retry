import retry from "./index";
import assert from "assert";

describe(__filename, () => {
  it(`can run successfully with defaults`, async () => {
    const f = () => 1;
    assert((await retry(f)) === 1);
    const af = async () => 1;
    assert((await retry(af)) === 1);
  });

  it(`can throw the error thrown`, async () => {
    const e = new Error();
    const f = () => {
      throw e;
    };
    await assert.rejects(retry(f), e);
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
    assert(trials === attempts);
  });
});
