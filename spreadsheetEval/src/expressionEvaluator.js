const ERROR_MESSAGE = "#ERROR: ...";

function evaluateExpression(expression, data) {
  switch (true) {
    case /^[A-Z]+\d+$/.test(expression):
      return evaluateCellReference(expression, data);
    case expression.startsWith("SUM("):
      return evaluateSum(expression, data);
    case expression.startsWith("MULTIPLY("):
      return evaluateMultiply(expression, data);
    case expression.startsWith("DIVIDE("):
      return evaluateDivide(expression, data);
    case expression.startsWith("GT("):
      return evaluateGreater(expression, data);
    case expression.startsWith("EQ("):
      return evaluateEqual(expression, data);
    case expression.startsWith("NOT("):
      return evaluateNot(expression, data);
    case expression.startsWith("AND("):
      return evaluateAnd(expression, data);
    case expression.startsWith("OR("):
      return evaluateOr(expression, data);
    case expression.startsWith("IF("):
      return evaluateIf(expression, data);
    case expression.startsWith("CONCAT("):
      return evaluateConcat(expression, data);
    default:
      return ERROR_MESSAGE;
  }
}

function evaluateCellReference(expression, data) {
  const cellValue = data[expression];
  if (typeof cellValue === "string" && cellValue.startsWith("=")) {
    return evaluateExpression(cellValue.substring(1), data);
  }
  return cellValue;
}

function evaluateSum(expression, data) {
  const numbersString = expression.substring(4, expression.length - 1);
  const numbers = extractNumbers(numbersString, data);
  if (hasInvalidNumbers(numbers)) {
    return ERROR_MESSAGE;
  }
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum;
}

function evaluateMultiply(expression, data) {
  const numbersString = expression.substring(9, expression.length - 1);
  const numbers = extractNumbers(numbersString, data);
  if (hasInvalidNumbers(numbers) || !hasSameOperandType(numbers)) {
    return ERROR_MESSAGE;
  }
  const product = numbers.reduce((total, num) => total * num, 1);
  return product;
}

function evaluateDivide(expression, data) {
  const numbersString = expression.substring(7, expression.length - 1);
  const numbers = extractNumbers(numbersString, data);
  if (hasInvalidNumbers(numbers) || numbers.length !== 2 || numbers[1] === 0) {
    return ERROR_MESSAGE;
  }
  const result = numbers[0] / numbers[1];
  const acceptableError = 10 ** -7;
  if (Math.abs(numbers[0] - result * numbers[1]) <= acceptableError) {
    return result;
  } else {
    return ERROR_MESSAGE;
  }
}

function evaluateGreater(expression, data) {
  const numbersString = expression.substring(3, expression.length - 1);
  const numbers = extractNumbers(numbersString, data);
  if (hasInvalidNumbers(numbers) || numbers.length !== 2) {
    return ERROR_MESSAGE;
  }
  const [operand1, operand2] = numbers;
  return operand1 > operand2;
}

function evaluateEqual(expression, data) {
  const numbersString = expression.substring(3, expression.length - 1);
  const numbers = extractNumbers(numbersString, data);
  if (hasInvalidNumbers(numbers) || numbers.length !== 2) {
    return ERROR_MESSAGE;
  }
  const [operand1, operand2] = numbers;
  return operand1 === operand2;
}

function evaluateNot(expression, data) {
  const operandString = expression.substring(4, expression.length - 1);
  const operand = extractNumbers(operandString, data)[0];
  if (isNaN(operand)) {
    return ERROR_MESSAGE;
  }
  return !operand;
}

function evaluateAnd(expression, data) {
  const parametersString = expression.substring(4, expression.length - 1);
  const parameters = extractNumbers(parametersString, data);
  if (hasInvalidParameters(parameters)) {
    return ERROR_MESSAGE;
  }
  return parameters.every((param) => param === true);
}

function evaluateOr(expression, data) {
  const parametersString = expression.substring(3, expression.length - 1);
  const parameters = extractValues(parametersString, data);
  const convertedParameters = parameters.map((param) => {
    if (!isNaN(param)) {
      return parseInt(param, 10);
    }
    return param;
  });

  if (!hasSameOperandType(convertedParameters)) {
    return ERROR_MESSAGE;
  }

  if (parameters.includes("true")) {
    return true;
  }

  return parameters.includes(false);
}

function evaluateIf(expression, data) {
  const endIndex = expression.indexOf(")");
  const innerExpression = expression.substring(3, endIndex + 1).trim();
  const trueValueString = innerExpression
    .substring(innerExpression.indexOf("(") + 1, innerExpression.indexOf(","))
    .trim();
  const falseValueString = innerExpression
    .substring(innerExpression.indexOf(",") + 1, innerExpression.indexOf(")"))
    .trim();
  const condition = evaluateExpression(innerExpression, data);
  const answer = condition ? trueValueString : falseValueString;
  return data[answer];
}

function evaluateConcat(expression, data) {
  const valuesString = expression.substring(7, expression.length - 1).trim();
  const values = extractValues(valuesString, data);
  const concatenatedString = values.join("");
  return concatenatedString;
}

function extractValues(valuesString, data) {
  const values = valuesString.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const filteredValues = values.map((value) => {
    let trimmedValue = value.trim();
    if (/^"(.*)"$/.test(trimmedValue)) {
      trimmedValue = trimmedValue.slice(1, -1);
    }
    if (/^[A-Z]+\d+$/.test(trimmedValue)) {
      const cellValue = data[trimmedValue];
      if (cellValue === undefined) {
        return "";
      }
      return String(cellValue);
    }
    return trimmedValue;
  });
  return filteredValues;
}

function extractNumbers(numbersString, data) {
  const numbers = numbersString.split(",").map((num) => {
    const trimmedNum = num.trim();
    if (/^[A-Z]+\d+$/.test(trimmedNum)) {
      if (data.hasOwnProperty(trimmedNum)) {
        return data[trimmedNum];
      } else {
        return NaN;
      }
    }
    return Number(trimmedNum);
  });

  return numbers;
}

function hasInvalidNumbers(numbers) {
  return numbers.some((num) => isNaN(num));
}

function hasSameOperandType(numbers) {
  const operandTypes = new Set(numbers.map((num) => typeof num));
  return operandTypes.size === 1;
}

function hasInvalidParameters(parameters) {
  return parameters.some((param) => isNaN(param) || typeof param !== "boolean");
}

module.exports = {
  evaluateExpression,
};
