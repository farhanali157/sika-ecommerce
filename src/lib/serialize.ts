// src/lib/serialize.ts

type DecimalToNumber<T> = T extends { d: number[]; e: number; s: number }
  ? number
  : T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<DecimalToNumber<U>>
  : T extends object
  ? { [K in keyof T]: DecimalToNumber<T[K]> }
  : T

function isDecimalLike(value: unknown): value is { toNumber: () => number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).toNumber === "function" &&
    typeof (value as Record<string, unknown>).toFixed === "function"
  )
}

/**
 * Converts any Prisma Decimal object or Date instance into standard numbers/strings
 * for safe passing across Server and Client component boundaries.
 *
 * IMPORTANT: This walks the object graph directly rather than using a JSON.stringify
 * replacer. Prisma's Decimal class implements toJSON(), and JSON.stringify always
 * calls toJSON() on a value BEFORE handing it to the replacer function — so a replacer
 * can never actually see the original Decimal instance, only the string toJSON()
 * already produced. Detecting decimals via a replacer silently never fires.
 */
export function serializeDecimals<T>(data: T): DecimalToNumber<T> {
  if (data === null || data === undefined) return data as DecimalToNumber<T>

  if (isDecimalLike(data)) {
    return data.toNumber() as DecimalToNumber<T>
  }

  if (data instanceof Date) {
    return data.toISOString() as DecimalToNumber<T>
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeDecimals(item)) as DecimalToNumber<T>
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(data as Record<string, unknown>)) {
      result[key] = serializeDecimals((data as Record<string, unknown>)[key])
    }
    return result as DecimalToNumber<T>
  }

  return data as DecimalToNumber<T>
}

/**
 * Utility to safely normalize single Decimal values or numbers
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  return Number(value) || 0
}