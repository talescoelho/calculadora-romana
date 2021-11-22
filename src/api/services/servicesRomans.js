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

const somaRomans = (romans) => {
  const newArr = Object.entries(numRoman).sort((a, b) => b[0] - a[0])
  let soma =  romans.reduce((acc, val) => {
      if (!val.includes('I')) {
        return acc + numRoman[val]
      } if (val[0] === 'I') {
        return acc + val.split('').reduce((a, e) => e === "I" ? a + 1 : numRoman[e] - a, 0)
      }
      return acc + val.split('').reduce((a, e) => e === "I" ? a + 1 : a + numRoman[e], 0)
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
      if (!val.includes('I')) {
        if (index === 0) {
          return numRoman[val] - acc;
        }
        return acc - numRoman[val];
      } if (val[0] === 'I') {
        const res = val.split('').reduce((a, e) => e === "I" ? a + 1 : numRoman[e] - a, 0)
        if (index === 0) {
          return res - acc;
        }
        return acc - res;
      }
      const res = val.split('').reduce((a, e) => e === "I" ? a + 1 : numRoman[e] - a, 0)
      if (index === 0) {
        return res - acc;
      }
      return acc - res;
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
