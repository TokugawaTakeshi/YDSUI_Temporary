import { InMemorySerialNanoID_Generator } from "../../Source";


export default class ExperimentalInMemorySerialNanoID_Generator extends InMemorySerialNanoID_Generator {

  public readonly NAME: string = "ExperimentalInMemorySerialNanoID_Generator";

  public constructor(options?: InMemorySerialNanoID_Generator.Options) {
    super(options);
  }

  public getForbiddenIDs(): Set<string> {
    return this.forbiddenIDs;
  }

}
