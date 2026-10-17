export namespace SerialNanoID_Generator {

  export type Options = Readonly<{
    initialPositions?: ReadonlyArray<string>;
    initialSeries?: number;
    mustInclude0thSeriesToIDs?: boolean;
  }>;

}
