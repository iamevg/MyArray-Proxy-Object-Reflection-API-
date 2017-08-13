function toUint32(value) {
  return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
  let numericKey = toUint32(key);

  return String(numericKey) == key && numericKey < (Math.pow(2, 32) - 1);
}

class MyArray {
  constructor(length = 0) {
    this.length = length;

    return new Proxy(this, {
      set(trapTarget, key, value) {
        let currentLength = Reflect.get(trapTarget, "length");

        if (isArrayIndex(key)) {
          let numericKey = Number(key);

          if (numericKey >= currentLength) {
            Reflect.set(trapTarget, "length", numericKey + 1);
          }
        } else if (key === "length") {
          if (value < currentLength) {
            for (let i = currentLength - 1; i >= value; i -= 1) {
              Reflect.deleteProperty(trapTarget, i);
            }
          }
        }

        return Reflect.set(trapTarget, key, value);
      }
    });
  }

  forEach(cb) {
    for (let i = 0; i < this.length; i += 1) {
      cb(this[i], i, this);
    }
  }
}

let values = new MyArray(3);

console.log(values.length);

values[0] = 0;
values[1] = 1;
values[2] = 2;

console.log(values.length); // 3

values[3] = 3;

console.log(values.length); // 4
console.log(values[3]); // 3

values["name"] = "array";

values.length = 2;

console.log(values.length); // 2

values.forEach(value => console. log(`value: ${value}`));