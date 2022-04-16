export const bufferToObject = bufString => JSON.parse(Buffer.from(bufString).toString())
export const bufferToString = bufString => Buffer.from(bufString).toString()
