// Custom Merge Sort for sorting posts without using Array.prototype.sort

/**
 * Generic merge sort implementation.
 * @param {any[]} array
 * @param {(a: any, b: any) => number} compareFn
 * @returns {any[]}
 */
export const mergeSort = (array, compareFn) => {
  if (!Array.isArray(array)) return [];
  const cmp =
    compareFn ||
    ((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

  const sort = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    return merge(left, right);
  };

  const merge = (left, right) => {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (cmp(left[i], right[j]) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
    }

    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    return result;
  };

  return sort(array.slice());
};


