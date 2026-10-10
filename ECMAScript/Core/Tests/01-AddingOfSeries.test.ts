import AddingOfSeriesCaseTester from "../Source/Testing/Testers/AddingOfSeriesCaseTester";

import TestableInMemorySerialNanoIDsGenerator from
      "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";
import TestablePersistentSerialNanoIDsGenerator from
      "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";


AddingOfSeriesCaseTester.test([
  (options: AddingOfSeriesCaseTester.InstanceCreator.Options): AddingOfSeriesCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestablePersistentSerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalPersistentSerialNanoIDsGenerator"
      }),
  (options: AddingOfSeriesCaseTester.InstanceCreator.Options): AddingOfSeriesCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestableInMemorySerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalInMemorySerialNanoID_Generator"
      })
]);
