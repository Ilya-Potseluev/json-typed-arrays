const TypedArrays = [
	'Int8Array',
	'Uint8Array',
	'Uint8ClampedArray',
	'Int16Array',
	'Uint16Array',
	'Int32Array',
	'Uint32Array',
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
] as const;

function toBase64(buffer: ArrayBuffer) {
	let binary = '';
	let bytes = new Uint8Array(buffer);

	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function fromBase64(base64: string) {
	let binary = atob(base64);
	let bytes = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

export function createParser(
	arrayBufferToBase64 = toBase64,
	base64ToArrayBuffer = fromBase64
) {
	return {
		parse(
			text: string,
			reviver?: ((this: any, key: string, value: any) => any) | undefined
		) {
			return JSON.parse(text, function (key, value) {
				if (typeof value === 'string') {
					let [type, data] = value.split(':');
					if (TypedArrays.includes(type as any)) {
						value = new globalThis[
							type as typeof TypedArrays[number]
						](base64ToArrayBuffer(data));
					}
				}
				if (typeof reviver === 'function') {
					value = reviver.call(this, key, value);
				}
				return value;
			});
		},

		stringify(
			value: any,
			replacer?:
				| (number | string)[]
				| null
				| ((this: any, key: string, value: any) => any),
			space?: string | number
		) {
			return JSON.stringify(
				value,
				function (key, value) {
					if (Array.isArray(replacer))
						if (!Array.isArray(this) && key && !(key in replacer))
							return undefined;
					if (typeof replacer === 'function')
						value = replacer.call(this, key, value);

					if (TypedArrays.includes(value?.constructor.name)) {
						value =
							value.constructor.name +
							':' +
							arrayBufferToBase64(value.buffer);
					}
					return value;
				},
				space
			);
		},
	} as Pick<JSON, 'parse' | 'stringify'>;
}
