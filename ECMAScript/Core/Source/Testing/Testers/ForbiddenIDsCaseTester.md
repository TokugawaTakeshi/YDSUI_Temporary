You're right, my mistake. Since `CHECKPOINT 3` does print, the assertions pass. The only problem is the order things run in. And since `generateOne()` runs during the collection phase, the first test is actually checking the state *after* the new ID was issued, not before. In the first suite both checks happen to expect the same 4 IDs, so you can't see this from the results.

Here are two ways to get the order you want. In both, I shortened the IDs with `.repeat()` to keep the example readable.

## Option A: `test` with `context.test` (`await` really waits)

This is closest to how you expected it to work. Use a `test` for each implementation instead of a `describe`, and run the steps as subtests through the context:

```ts
import { type TestContext } from "node:test";

// ...

Testing.describe(
  "Forbidden IDs ...",
  (): void => {

    Testing.describe(
      "... has been set initially",
      (): void => {

        for (const createInstance of instancesCreators) {

          const {
            instance: serialNanoID_Generator,
            nameForLogging: implementationNameForLogging
          }: Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator> = createInstance({
            initialPositions: Array.from({ length: 21 }, (): string => "3"),
            forbiddenIDs: new Set([
              "5".repeat(21),
              "4".repeat(21),
              `${ "3".repeat(20) }4`,
              "3".repeat(21),
              "2".repeat(21),
              "1".repeat(21)
            ])
          });

          Testing.test(
            implementationNameForLogging,
            async (context: TestContext): Promise<void> => {

              console.log("CHECKPOINT 1");

              await context.test(
                "No RAM has been wasted for the storing of irrelevant IDs",
                async (): Promise<void> => {
                  console.log("CHECKPOINT 2");
                  const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();
                  Assert.deepStrictEqual(forbiddenIDs.size, 4);
                  // ...other assertions
                  console.log("CHECKPOINT 3");
                }
              );

              console.log("CHECKPOINT 4");

              /* Runs only after the subtest above has completed */
              const nextID: string = await serialNanoID_Generator.generateOne();

              await context.test(
                "Next ID is matching with expected one",
                (): void => {
                  Assert.deepStrictEqual(nextID, `${ "3".repeat(20) }5`);
                }
              );

              await context.test(
                "Not relevant IDs has been removed after issuing of new ID",
                async (): Promise<void> => {
                  const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();
                  Assert.deepStrictEqual(forbiddenIDs.size, 4);
                  // ...other assertions
                }
              );

            }
          );

        }

      }
    );

    Testing.describe(
      "... has been reported",
      (): void => {

        for (const createInstance of instancesCreators) {

          const { instance: serialNanoID_Generator, nameForLogging: implementationNameForLogging } =
              createInstance({ initialPositions: Array.from({ length: 21 }, (): string => "3") });

          Testing.test(
            implementationNameForLogging,
            async (context: TestContext): Promise<void> => {

              await serialNanoID_Generator.reportExternallyIssuedUsageOfIDs([
                "5".repeat(21),
                "4".repeat(21),
                `${ "3".repeat(20) }4`,
                "3".repeat(21),
                "2".repeat(21),
                "1".repeat(21)
              ]);

              await context.test("Not relevant IDs has been removed after reporting", async (): Promise<void> => {
                /* ... */
              });

              const nextID: string = await serialNanoID_Generator.generateOne();

              await context.test("Next ID is matching with expected one", (): void => {
                Assert.deepStrictEqual(nextID, `${ "3".repeat(20) }5`);
              });

              await context.test("No RAM has been wasted for the storing of irrelevant IDs", async (): Promise<void> => {
                /* ... size === 2 */
              });

            }
          );

        }

      }
    );

  }
).
    catch(Logger.logPromiseError);
```

Output for each implementation: `1 → 2 → 3 → 4 → …`

## Option B: keep `describe`, put state changes inside tests

Tests inside one `describe` run one at a time, in the order they were registered. So you can move each state change into the test that needs it, and use a `before` hook for setup:

```ts
Testing.describe(implementationNameForLogging, (): void => {

  /* Setup that must happen before ALL tests of this suite */
  Testing.before(async (): Promise<void> => {
    await serialNanoID_Generator.reportExternallyIssuedUsageOfIDs([ /* ... */ ]);
  });

  Testing.test("Not relevant IDs has been removed after reporting", async (): Promise<void> => {
    /* ... */
  });

  Testing.test("Next ID is matching with expected one", async (): Promise<void> => {
    Assert.deepStrictEqual(await serialNanoID_Generator.generateOne(), `${ "3".repeat(20) }5`);
  });

  Testing.test("No RAM has been wasted for the storing of irrelevant IDs", async (): Promise<void> => {
    /* ... size === 2 */
  });

});
```

The downside: the third test depends on the second one having run. If you run the third one alone (for example with `--test-name-pattern`), it will fail.

## In both options

- `describe` callbacks are synchronous (`(): void`). There's nothing to `await` in them, so the `Promise.all` wrappers aren't needed.
- `for…of` replaces `map(async …)`, because the suite body only registers tests.
