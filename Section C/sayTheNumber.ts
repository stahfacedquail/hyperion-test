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

function sayNumber(num: number): string {
	let isNegative = false;
	
	if (num < 0) {
		isNegative = true;
		num *= -1;
	}
	
	const groups = splitNumber(num);
  const wordGroups: string[] = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i] > 0) {
      const word = sayNumberHelper(groups[i]);
      const exponent = 3 * (groups.length - (i + 1));
      const suffix = generateSuffix(exponent);

      wordGroups.push(suffix ? `${word} ${suffix}` : word);
    }
  }
	
  let fullWord: string;
  if (wordGroups.length === 2 && groups[1] < 100) {
    fullWord = wordGroups.join(" and ");
  } else {
    fullWord = wordGroups.join(", ")
  }

	return isNegative ? `negative ${fullWord}` : fullWord;
}

function generateSuffix(exponent: number): string {
  if (exponent === 0) return "";

  const powerOf10 = Math.pow(10, exponent);
  if (powerOf10 in dictionary) return dictionary[powerOf10];

  return "";
}

function splitNumber(number: number): number[] {
  const numStr = `${number}`;
  const remainder = numStr.length % 3;
  const groups = remainder ? [ numStr.substring(0, remainder) ] : [];
  for (let i = remainder; i < numStr.length; i += 3) {
    groups.push(numStr.substring(i, i + 3));
  }
    
  return groups.map((group) => parseInt(group));
}

// number n must be such that 0 <= n < 1000
function sayNumberHelper(n: number): string {
  // 0 <= n < 20
  if (n < 20) {
    return dictionary[n];
  }
  
  // 20 <= n < 100
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const tensWord = dictionary[tens * 10];

    const units = n % 10;
    if (units === 0) return tensWord;
    
    const unitsWord = dictionary[units];
    return `${tensWord} ${unitsWord}`;
  }
  
  // 100 <= n < 1000
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const hundredsWord = `${dictionary[hundreds]} hundred`;
    const remainder = n % 100;
    if (remainder === 0) return hundredsWord;
    
    const remainderWord = sayNumberHelper(remainder);
    return `${hundredsWord} and ${remainderWord}`;
  }

  return "";
}