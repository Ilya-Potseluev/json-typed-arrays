const { createParser } = require('./dist/index.js');

const parser = createParser();

describe('parser', () => {
	test('parse', () => {
		const parsed = parser.parse('{"typedArray": "Int8Array:AA=="}');
		expect(parsed).toEqual({ typedArray: new Int8Array([0]) });
	});

	test('stringify', () => {
		const str = parser.stringify({
			typedArray: new Int8Array([0]),
		});
		expect(str).toEqual('{"typedArray":"Int8Array:AA=="}');
	});

	test('parse with custom reviver', () => {
		const parsed = parser.parse(
			'{"typedArray": "Int8Array:AA=="}',
			(key, value) => {
				if (value instanceof Int8Array) {
					return value.toString();
				}
				return value;
			}
		);
		expect(parsed).toEqual({ typedArray: '0' });
	});

	test('stringify with custom replacer', () => {
		const str = parser.stringify(
			{ typedArray: new Int8Array([0]) },
			(key, value) => {
				if (value instanceof Int8Array) {
					return value.toString();
				}
				return value;
			}
		);
		expect(str).toEqual('{"typedArray":"0"}');
	});

	test('stringify and parse 1 million Float64Array', () => {
		let arr = new Float64Array(Array(1e6).fill(Math.random()));
		let encoded = parser.stringify({ arr });
		let arr2 = parser.parse(encoded).arr;

		expect(arr2).toEqual(arr);
	});
});
