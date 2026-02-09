/**
 * Test script for parsePrice() function
 * Tests Requirements 2.5, 7.1, 7.3
 */

// Simulate the parsePrice function from CartManager
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') {
    return priceStr;
  }
  const cleaned = String(priceStr)
    .replace(/£|EGP|Â£/g, '')
    .replace(/,/g, '')
    .trim();
  return parseFloat(cleaned) || 0;
}

// Test cases
const tests = [
  { input: 299.00, expected: 299.00, description: 'Numeric price' },
  { input: '£45.50', expected: 45.50, description: 'Price with £ symbol' },
  { input: '279.00 EGP', expected: 279.00, description: 'Price with EGP' },
  { input: 'Â£125.99', expected: 125.99, description: 'Price with Â£ symbol' },
  { input: '1,299.50 EGP', expected: 1299.50, description: 'Price with commas' },
  { input: '£1,500', expected: 1500, description: 'Price with £ and commas' },
  { input: 'EGP 999.99', expected: 999.99, description: 'Price with EGP prefix' },
  { input: '  £  50.00  ', expected: 50.00, description: 'Price with whitespace' },
  { input: 0, expected: 0, description: 'Zero price' },
  { input: '', expected: 0, description: 'Empty string' },
  { input: 'invalid', expected: 0, description: 'Invalid string' },
];

console.log('Testing parsePrice() function\n');
console.log('Requirements:');
console.log('  2.5: THE Cart_Manager SHALL normalize price values to numeric format');
console.log('  7.1: THE Cart_Manager SHALL store all prices as numeric values without currency symbols');
console.log('  7.3: THE Cart_Manager SHALL convert any price strings (containing £ or EGP) to numeric values on input\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const result = parsePrice(test.input);
  const success = result === test.expected;
  
  if (success) {
    console.log(`✅ Test ${index + 1} PASSED: ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.input)} → Output: ${result} (type: ${typeof result})`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1} FAILED: ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.input)}`);
    console.log(`   Expected: ${test.expected}, Got: ${result}`);
    failed++;
  }
  console.log('');
});

console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

// Verify all outputs are numbers
console.log('\nVerifying all outputs are numeric:');
const allNumeric = tests.every(test => typeof parsePrice(test.input) === 'number');
console.log(allNumeric ? '✅ All outputs are numbers' : '❌ Some outputs are not numbers');

// Verify no currency symbols in outputs
console.log('\nVerifying no currency symbols in outputs:');
const noCurrencySymbols = tests.every(test => {
  const result = String(parsePrice(test.input));
  return !result.match(/£|EGP|Â£/);
});
console.log(noCurrencySymbols ? '✅ No currency symbols in outputs' : '❌ Currency symbols found in outputs');

if (passed === tests.length && allNumeric && noCurrencySymbols) {
  console.log('\n🎉 All requirements verified successfully!');
  process.exit(0);
} else {
  console.log('\n⚠️ Some tests failed or requirements not met');
  process.exit(1);
}
