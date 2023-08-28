const { evaluateExpression } = require("../src/expressionEvaluator");

describe("evaluateExpression", () => {
  it("should evaluate cell references", () => {
    const data = {
      A1: 2,
      B1: 3,
    };
    expect(evaluateExpression("A1", data)).toBe(2);
    expect(evaluateExpression("B1", data)).toBe(3);
  });

  it("should evaluate the SUM function", () => {
    const data = {
      A1: 2,
      B1: 3,
    };
    expect(evaluateExpression("SUM(A1, B1)", data)).toBe(5);
  });

  it("should handle errors for invalid expressions", () => {
    const data = {
      A1: 2,
      B1: "not a number",
    };
    expect(evaluateExpression("=A1 + B1", data)).toBe("#ERROR: ...");
  });

  it("should evaluate the MULTIPLY function", () => {
    const data = {
      A1: 2,
      B1: 3,
    };
    expect(evaluateExpression("MULTIPLY(A1, B1)", data)).toBe(6);
  });

  it("should evaluate the DIVIDE function", () => {
    const data = {
      A1: 6,
      B1: 2,
    };
    expect(evaluateExpression("DIVIDE(A1, B1)", data)).toBe(3);
  });

  it("should evaluate the GT function", () => {
    const data = {
      A1: 5,
      B1: 3,
    };
    expect(evaluateExpression("GT(A1, B1)", data)).toBe(true);
    expect(evaluateExpression("GT(B1, A1)", data)).toBe(false);
  });

  it("should evaluate the EQ function", () => {
    const data = {
      A1: 5,
      B1: 3,
    };
    expect(evaluateExpression("EQ(A1, B1)", data)).toBe(false);
    expect(evaluateExpression("EQ(B1, B1)", data)).toBe(true);
  });

  it("should evaluate the NOT function", () => {
    const data = {
      A1: true,
      B1: false,
    };
    expect(evaluateExpression("NOT(A1)", data)).toBe(false);
    expect(evaluateExpression("NOT(B1)", data)).toBe(true);
  });

  it("should evaluate the AND function", () => {
    const data = {
      A1: true,
      B1: false,
    };
    expect(evaluateExpression("AND(A1, B1)", data)).toBe(false);
    expect(evaluateExpression("AND(A1, A1)", data)).toBe(true);
  });

  it("should evaluate the OR function", () => {
    const data = {
      A1: true,
      B1: false,
    };
    expect(evaluateExpression("OR(A1, B1)", data)).toBe(true);
    expect(evaluateExpression("OR(B1, B1)", data)).toBe(false);
  });

  it("should evaluate the CONCAT function", () => {
    const data = {
      A1: "Hello",
      B1: "World",
    };
    expect(evaluateExpression("CONCAT(A1, B1)", data)).toBe("HelloWorld");
  });

  it("should handle errors for invalid expressions", () => {
    const data = {
      A1: 2,
      B1: "not a number",
    };
    expect(evaluateExpression("INVALID_FUNCTION(A1, B1)", data)).toBe(
      "#ERROR: ..."
    );
    expect(evaluateExpression("SUM(A1, B1, C1)", data)).toBe("#ERROR: ...");
  });
});
