import { NoInitialConditionsCaseTester } from "../Source";
import TestablePersistentSerialNanoIDsGenerator from
      "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";
import TestableInMemorySerialNanoIDsGenerator from
      "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";


NoInitialConditionsCaseTester.test([
  (options: NoInitialConditionsCaseTester.InstanceCreator.Options): NoInitialConditionsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestablePersistentSerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalPersistentSerialNanoIDsGenerator"
      }),
  (options: NoInitialConditionsCaseTester.InstanceCreator.Options): NoInitialConditionsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestableInMemorySerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalInMemorySerialNanoID_Generator"
      })
]);
