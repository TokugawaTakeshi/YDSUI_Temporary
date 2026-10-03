export interface SerialNanoID_Generator {

  reportExternallyIssuedUsageOfIDs: (targetIDs: ReadonlyArray<string>) => void;

}

export namespace SerialNanoID_Generator {

  export type Options = Readonly<{
    initialPositions?: ReadonlyArray<string>;
    initialSeries?: number;
    mustInclude0thSeriesToIDs?: boolean;
  }>;

}
