export function calculateMedian(numbers: number[]) {
    numbers.sort((a, b) => a - b);

    let middle = Math.floor(numbers.length / 2);

    if (numbers.length & 1) {
        return numbers[middle];
    } else {
        return (numbers[middle - 1] + numbers[middle]) / 2;
    }
}
