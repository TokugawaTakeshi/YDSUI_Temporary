import type { TestableSerialNanoIDsGenerator } from "../../Source";
import { InMemorySerialNanoID_Generator } from "../../Source";


export default class TestableInMemorySerialNanoIDsGenerator implements TestableSerialNanoIDsGenerator
{

  /* [ Approach ]
   * Direct inheriting is impossible from the viewpoint of TypeScript because of TS2416 error, wrapping instead. */
  private readonly synchronousCore: InMemorySerialNanoID_Generator;

  public constructor(options?: TestableSerialNanoIDsGenerator.Options) {

    this.synchronousCore =

        new class extends InMemorySerialNanoID_Generator {
          public constructor(_options?: TestableSerialNanoIDsGenerator.Options) {
            super(_options);
          }
        }(options);

  }


  public async generateOne(): Promise<string> {
    return Promise.resolve(this.synchronousCore.generateOne());
  }

  public async reportExternallyIssuedUsageOfIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    this.synchronousCore.reportExternallyIssuedUsageOfIDs(targetIDs);
    return Promise.resolve();
  }

  public async getForbiddenIDs(): Promise<Set<string>> {
    return Promise.resolve(this.synchronousCore.getForbiddenIDs());
  }

  public async getIssuedButUsageNotConfirmedIDs(): Promise<Set<string>> {
    return Promise.resolve(this.synchronousCore.getIssuedButUsageNotConfirmedIDs());
  }

  public async getIssuedButWillNotBeUsedIDs(): Promise<Set<string>> {
    return Promise.resolve(this.synchronousCore.getIssuedButWillNotBeUsedIDs());
  }

}
