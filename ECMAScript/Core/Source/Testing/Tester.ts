namespace Tester {

  export type InstanceCreator<GeneratorType, Options> = (options: Options) => InstanceCreator.Data<GeneratorType>;

  export namespace InstanceCreator {

    export type Data<GeneratorType> = Readonly<{
      instance: GeneratorType;
      nameForLogging: string;
    }>;

  }

}


export default Tester;
