const dictionary: {[key: number]: string} = {
	0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
	5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
	10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
	14: "fourteen", 15: "fifteen", 16: "sixteen", 17: "seventeen",
	18: "eighteen", 19: "nineteen", 20: "twenty", 30: "thirty",
	40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty",
	90: "ninety", 100: "hundred", 1000: "thousand", 1000000: "million",
	1000000000: "billion", 1000000000000: "trillion"
};

/**
 * Translates a number to how it would be said in English
 * @param num Any integer from 0 up to and including 999 999 999 999 999
 * @returns How the number would be said in English
 */
export function sayTheNumber(num: number): string {
  if (typeof num !== "number") {
    throw new Error("Input must be a number");
  }
  if (num < 0 || num >= Math.pow(10, 15) || Number.isInteger(num)) {
    throw new Error("Input must be an integer between 0 and 999 999 999 999 999");
  }

	const numberGroups = splitNumber(num);
  // wordGroups will store the English phrase for each group of numbers
  const wordGroups: string[] = [];
  for (let i = 0; i < numberGroups.length; i++) {
    // only add the phrase to wordGroups if it's not just going to be "zero"
    if (numberGroups[i] > 0) {
      const word = sayNumberHelper(numberGroups[i]);
      // by spec, the longest groups.length will be is 5
      // so the possible values of exponent are 0, 3, 6, 9 and 12
      const exponent = 3 * (numberGroups.length - (i + 1));
      const suffix = getSuffix(exponent); // e.g. "thousand", "million"

      wordGroups.push(suffix ? `${word} ${suffix}` : word);
    } else if (numberGroups.length === 1) { // however, if 0 IS the full number, then put it in there!
      wordGroups.push(
        sayNumberHelper(0),
      );
    }
  }
	
  // Special case: If wordGroups looks like ["four million", "ninety one thousand", "twelve"],
  // return "four million, ninety one thousand and twelve", not "four million, ninety one thousand, twelve"
  const lastNumberGroup = numberGroups[numberGroups.length - 1];
  if (wordGroups.length > 1 &&  lastNumberGroup < 100 && lastNumberGroup > 0) {
    const l = wordGroups.length - 1;
    // If there's just two groups, normalPart will be empty.  But if there's more than that,
    // normalPart will comprise all the groups that can just be comma-separated
    const normalPart = wordGroups.slice(0, l - 1);
    // If normalPart is something like ["one hundred thousand", "one thousand"], we want there to
    // be a comma after "one thousand" too, so we add an empty string to normalPart in order to ensure that
    if (normalPart.length > 0) normalPart.push("");
    const unusualPart = wordGroups.slice(l - 1).join(" and ");
    return normalPart.join(", ") + unusualPart;
  }

  // Otherwise, just return the word groups comma-separated, e.g.
  // ["five hundred and sixty two thousand", "four hundred and forty four"] translates
  // to "five hundred and sixty two thousand, four hundred and forty four"
  return wordGroups.join(", ")
}

/**
 * Get the suffix associated with a particular power of 10, e.g. 10 ** 3 returns "thousand",
 * 10 ** 12 returns "trillion".
 * @param exponent The exponent to which 10 must be raised
 * @returns The suffix for that power of 10, if it is available in the dictionary; otherwise
 * it returns an empty string
 */
function getSuffix(exponent: number): string {
  // Special case: As much as 10 ** 0 is in the dictionary, we never use "one"
  // as a suffix for a number
  if (exponent === 0) return "";

  const powerOf10 = Math.pow(10, exponent);
  return dictionary[powerOf10] ?? "";
}

/**
 * Split a number into groups of three, counting from the "end" of that number
 * @param number A non-negative integer
 * @returns e.g. for an input 5 761 848 284, an array [[5], [761], [848], [284]]
 * would be returned
 */
function splitNumber(num: number): number[] {
  const numStr = `${num}`;
  // remainder will help us figure out if the first group is shorter than 3 digits
  const remainder = numStr.length % 3;
  // If remainder is 1 or 2, the first element in groups must just be the first one or
  // two digits respectively; otherwise we can just create an empty array and populate all
  // of it using the loop
  const groups = remainder > 0
    ? [ parseInt(numStr.substring(0, remainder), 10) ]
    : [];
  // Start looping after the first one / two digits if remainder was 1 or 2;
  // otherwise start looping from the very first digit
  for (let i = remainder; i < numStr.length; i += 3) {
    // Each time, grab the next three characters and put them into the groups array
    const groupStr = numStr.substring(i, i + 3);
    groups.push(
      parseInt(groupStr, 10),
    );
  }
    
  return groups;
}

/**
 * Translates a number into how it would be said in English, focusing specifically on
 * numbers smaller than 1000
 * @param num Any number from 0 up to and including 999
 * @returns How num would be said in English
 */
function sayNumberHelper(num: number): string {
  // 0 <= n < 20: Numbers with special names, so we look them up in the dictionary
  if (num < 20) {
    return dictionary[num];
  }
  
  // 20 <= n < 100: The tens part of these numbers have special names too, which we
  // look up in the dictionary
  if (num < 100) {
    const tens = Math.floor(num / 10); // some number between 2 and 9
    const tensWord = dictionary[tens * 10];

    const units = num % 10; // some number between 0 and 9
    if (units === 0) return tensWord; // e.g. just return "ninety", not "ninety zero"
    
    const unitsWord = dictionary[units]; // numbers between 0 and 9 have special names
    return `${tensWord} ${unitsWord}`;
  }
  
  // 100 <= n < 1000: We need to specify how to say the "hundreds" part of this number,
  // and then we can use the logic above to say the remaining part of the number
  if (num < 1000) {
    const hundreds = Math.floor(num / 100); // some number between 1 and 9
    const hundredsWord = `${dictionary[hundreds]} hundred`; // e.g. "three hundred"
    const remainder = num % 100; // the "remaining part of the number", e.g. the 23 in 123
    if (remainder === 0) return hundredsWord; // e.g. return "five hundred", not "five hundred and zero"
    
    const remainderWord = sayNumberHelper(remainder);
    return `${hundredsWord} and ${remainderWord}`;
  }

  throw new Error("This function only accepts integers from 0 to 999");
}