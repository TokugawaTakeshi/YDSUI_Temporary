namespace Tester {

  export type Implementation<GeneratorType, Options> =
      Readonly<{
        instanceCreator: InstanceCreator<GeneratorType, Options>;
        nameForLogging: string;
      }>;

  export type InstanceCreator<GeneratorType, Options> = (options: Options) => Promise<GeneratorType>;

}


export default Tester;
