const sum = require("../utils/exampleModule");

test("two plus four is six", () => {
  expect(2 + 2).toBe(4);
});

test("two plus four is six_2", () => {
  expect(sum(2, 4)).toBe(6);
});

//https://jestjs.io/docs/using-matchers#exceptions

test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });

