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

/**
 * Converts any Prisma Decimal object or Date instance into standard numbers/strings
 * for safe passing across Server and Client component boundaries.
 */
export function serializeDecimals<T>(data: T): DecimalToNumber<T> {
  if (data === null || data === undefined) return data as DecimalToNumber<T>

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Catch Prisma Decimal instances or objects with decimal structures
      if (
        typeof value === "object" &&
        value !== null &&
        "d" in value &&
        Array.isArray(value.d)
      ) {
        return Number(value)
      }
      return value
    })
  )
}

/**
 * Utility to safely normalize single Decimal values or numbers
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  return Number(value) || 0
}