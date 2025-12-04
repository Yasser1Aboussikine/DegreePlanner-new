/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R = void, T = {}> {
    toMatchObject(expected: Record<string, any>): R;
  }

  interface ArrayLikeMatchers<T> {
    toHaveLength(expected: number): void;
  }

  interface Expect {
    any(classType: any): any;
  }
}

declare global {
  namespace jest {
    interface Matchers<R = void> {
      rejects: Matchers<R>;
    }
  }
}
