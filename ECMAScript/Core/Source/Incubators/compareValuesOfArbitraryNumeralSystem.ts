export namespace ComparingValuesOfArbitraryNumeralSystem {

  export type Result = Readonly<{
    isFirstValueStrictlyGreater: boolean;
    isFirstValueGreaterOrEqualsToSecondOne: boolean;
    isFirstValueStrictlySmaller: boolean;
    isFirstValueSmallerOrEqualsToSecondOne: boolean;
    areValueEquals: boolean;
    isSecondValueStrictlyGreater: boolean;
    isSecondValueGreaterOrEqualsToFirstOne: boolean;
    isSecondValueStrictlySmaller: boolean;
    isSecondValueSmallerOrEqualsToFirstOne: boolean;
  }>;

}


export function compareValuesOfArbitraryNumeralSystem(
  positionsOfFirstValue: ReadonlyArray<string>,
  positionsOfSecondValue: ReadonlyArray<string>,
  positions: ReadonlyArray<string>
): ComparingValuesOfArbitraryNumeralSystem.Result {

  for (const [ characterIndex, characterOfFirstValue ] of positionsOfFirstValue.entries()) {

    const positionIndexOfFirstCharacter: number = positions.indexOf(characterOfFirstValue);
    const positionIndexOfSecondCharacter: number = positions.indexOf(positionsOfSecondValue[characterIndex]);

    if (positionIndexOfFirstCharacter === positionIndexOfSecondCharacter) {
      continue;
    }


    const isFirstValueStrictlyGreater: boolean = positionIndexOfFirstCharacter > positionIndexOfSecondCharacter;

    return {
      isFirstValueStrictlyGreater,
      isFirstValueGreaterOrEqualsToSecondOne: isFirstValueStrictlyGreater,
      isFirstValueStrictlySmaller: !isFirstValueStrictlyGreater,
      isFirstValueSmallerOrEqualsToSecondOne: !isFirstValueStrictlyGreater,
      areValueEquals: false,
      isSecondValueStrictlyGreater: !isFirstValueStrictlyGreater,
      isSecondValueGreaterOrEqualsToFirstOne: !isFirstValueStrictlyGreater,
      isSecondValueStrictlySmaller: isFirstValueStrictlyGreater,
      isSecondValueSmallerOrEqualsToFirstOne: isFirstValueStrictlyGreater
    };

  }


  return {
    isFirstValueStrictlyGreater: false,
    isFirstValueGreaterOrEqualsToSecondOne: true,
    isFirstValueStrictlySmaller: false,
    isFirstValueSmallerOrEqualsToSecondOne: true,
    areValueEquals: true,
    isSecondValueStrictlyGreater: false,
    isSecondValueGreaterOrEqualsToFirstOne: true,
    isSecondValueStrictlySmaller: false,
    isSecondValueSmallerOrEqualsToFirstOne: true
  };

}
