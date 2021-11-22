const numRoman = {
  M: 1000,
  IM: 999,
  D: 500,
  ID: 449,
  C: 100,
  IC: 99,
  L: 50,
  IL: 49,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
}

function convertToRomans(num, newArr) {
  let result = '';
  for (let index = 0; index < newArr.length;) {
    if (newArr[index][1] > num) {
      index += 1;
    } else if (num === 0) {
      break;
    } else {
      result += newArr[index][0]
      num -= newArr[index][1];
    }
  }
  return result;
}

function sumChars(num) {
  if (num[0] === 'I') {
    return num.split('').reduce((acc, el) => el === "I" ? acc + 1 : numRoman[el] - acc, 0);
  }
  return num.split('').reduce((acc, el) => el === "I" ? acc + 1 : numRoman[el] + acc, 0);
}

const somaRomans = (romans) => {
  const newArr = Object.entries(numRoman).sort((a, b) => b[0] - a[0])
  let soma =  romans.reduce((acc, val) => {
      val = sumChars(val);
      return acc + val;
    } ,0)
  
  return {
    result: soma,
    resultRomanos: convertToRomans(soma, newArr),
    equacao: `${romans.join(' + ')} = ${convertToRomans(soma, newArr)}`
  };
};

const subtracaoRomans = (romans) => {
  const newArr = Object.entries(numRoman).sort((a, b) => b[0] - a[0])
  let sub =  romans.reduce((acc, val, index) => {
    val = sumChars(val);
      if (index === 0) {
        return val - acc;
      }
      return acc - val;
    } ,0)
  if (sub <= 0) {
    return { message: 'números romanos não podem ser ZERO "0" ou NEGATIVOS' }
  } 
 
  return {
    result: sub,
    resultRomanos: convertToRomans(sub, newArr),
    equacao: `${romans.join(' - ')} = ${convertToRomans(sub, newArr)}`
  };
};

module.exports = {
  somaRomans,
  subtracaoRomans,
};
