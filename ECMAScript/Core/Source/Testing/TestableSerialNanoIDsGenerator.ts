export interface TestableSerialNanoIDsGenerator {

  reportExternallyIssuedUsageOfIDs: (targetIDs: ReadonlyArray<string>) => Promise<void>;

  generateOne: () => Promise<string>;

  getForbiddenIDs: () => Promise<Set<string>>;

}

export namespace TestableSerialNanoIDsGenerator {

  export type Options = Readonly<{
    initialPositions?: ReadonlyArray<string>;
    initialSeries?: number;
    mustInclude0thSeriesToIDs?: boolean;
    issuedButUsageNotConfirmedIDs?: ReadonlySet<string>;
    issuedButWillNotBeUsedIDs?: ReadonlySet<string>;
    forbiddenIDs?: ReadonlySet<string>;
  }>;

}
