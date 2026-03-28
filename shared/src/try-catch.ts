type Success<T> = [data: T, error: undefined]
type Failure = [data: undefined, error: Error]
type Result<T> = Success<T> | Failure

export async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>>
export function tryCatch<T>(fn: () => T): Result<T>
export function tryCatch<T>(fn: () => T | Promise<T>): Result<T> | Promise<Result<T>> {
  try {
    const result = fn()
    if (result instanceof Promise) {
      return result.then(
        (data) => [data, undefined] as Success<T>,
        (err) => [undefined, err instanceof Error ? err : new Error(String(err))] as Failure
      )
    }
    return [result, undefined]
  } catch (err) {
    return [undefined, err instanceof Error ? err : new Error(String(err))]
  }
}
