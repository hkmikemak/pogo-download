declare interface Array<T> {
  unique(this: Array<T>): Array<T>;
  createPair(this: Array<T>): Array<Array<T>>;
  groupBy<K, J>(
    this: Array<T>,
    keySelector: (input: T) => K,
    valueSelector: (input: T) => J
  ): Map<K, Array<J>>;
}

Array.prototype.unique = function <T>(this: Array<T>) {
  return [...new Set(this)];
};

Array.prototype.createPair = function <T>(this: Array<T>) {
  return this.flatMap((value1, index1) => {
    return this.slice(index1 + 1).map((value2) => {
      return [value1, value2];
    });
  });
};

Array.prototype.groupBy = function <T, K, J>(
  this: Array<T>,
  keySelector: (input: T) => K,
  valueSelector: (input: T) => J
) {
  const map = new Map<K, Array<J>>();

  this.forEach((item) => {
    const key = keySelector(item);
    const value = valueSelector(item);
    const array = map.get(key);
    if (!array) {
      map.set(key, [value]);
    } else {
      array.push(value);
    }
  });

  return map;
};
