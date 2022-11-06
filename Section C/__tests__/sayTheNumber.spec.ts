import { sayTheNumber } from "../src/sayTheNumber";
import { expect } from "chai";
import "mocha";

describe("sayTheNumber function", () => {

  describe("(with valid inputs)", () => {
    const testValues = [
      { "number": 0, "phrase": "zero" },
      { "number": 45271475183, "phrase": "forty five billion, two hundred and seventy one million, four hundred and seventy five thousand, one hundred and eighty three" },
      { "number": 1983274, "phrase": "one million, nine hundred and eighty three thousand, two hundred and seventy four" },
      { "number": 703000000004, "phrase": "seven hundred and three billion and four" },
      { "number": 93045027, "phrase": "ninety three million, forty five thousand and twenty seven" },
      { "number": 999999999999999, "phrase": "nine hundred and ninety nine trillion, nine hundred and ninety nine billion, nine hundred and ninety nine million, nine hundred and ninety nine thousand, nine hundred and ninety nine" },
      { "number": 600000, "phrase": "six hundred thousand" },
      { "number": 10101010101, "phrase": "ten billion, one hundred and one million, ten thousand, one hundred and one" },
      { "number": 16009018007015, "phrase": "sixteen trillion, nine billion, eighteen million, seven thousand and fifteen" },
      { "number": 12, "phrase": "twelve" },
      { "number": 502, "phrase": "five hundred and two" },
      { "number": 631419000, "phrase": "six hundred and thirty one million, four hundred and nineteen thousand" },
    ];
  
    testValues.forEach(({ number: input, phrase: expectedPhrase }) => {
      it(`should return ${expectedPhrase} for an input of ${outputSpaceSeparated(input)}`, () => {
        const result = sayTheNumber(input);
        expect(result).to.equal(expectedPhrase);
      });
    });
  });

  describe("(with invalid inputs)", () => {
    const errorValues = [
      { "input": "1234567", "message": "Input must be a number" },
      { "input": -45, "message": "Input must be an integer between 0 and 999 999 999 999 999" },
      { "input": Math.pow(10, 15), "message": "Input must be an integer between 0 and 999 999 999 999 999" },
      { "input": 658.129, "message": "Input must be an integer" },
    ];

    errorValues.forEach(({ input, message: errorMessage }) => {
      it(`should throw an error for an input ${input} (type "${typeof input}")`, () => {
        try {
          sayTheNumber(input as number);
        } catch(e: any) {
          expect(e.message).to.equal(errorMessage);
        }
      });
    });
  });
});

function outputSpaceSeparated(n: number): string {
  const groups: string[] = [];
  let remainder: number;
  while (n > 0) {
    remainder = n % 1000;
    groups.unshift(
      n < 1000
      ? `${remainder}`
      : padToThreeDigits(remainder)
    );

    n = ((n - remainder) / 1000);
  }

  if (groups.length) {
    return groups.join(" ");
  }
  return "0";
}

function padToThreeDigits(n: number): string {
  if (n < 10) return `00${n}`;
  if (n < 100) return `0${n}`;
  return `${n}`;
}