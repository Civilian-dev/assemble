/** @internal */
export function testType<T>(_?: T): T {
  return undefined as any;
}

export default testType
