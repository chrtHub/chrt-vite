import retry from "async-retry";

await retry(
  async () => {
    // STUFF TO RETRY GOES HERE
  },
  {
    retries: 2,
    minTimeout: 1000,
    factor: 2,
  }
);
