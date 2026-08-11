/**
 * 惰性操作包装。
 *
 * 让 `prisma.model.update({...})` 这类调用在「立即执行」与「事务内执行」之间可选：
 * - 直接 await 时，LazyOp 是一个 thenable，立即执行底层操作；
 * - 作为数组元素传给 $transaction 时，$transaction 会通过 _run() 在 BEGIN/COMMIT 内按序执行。
 */

export class LazyOp<T = unknown> {
  private readonly fn: () => T | PromiseLike<T>;

  constructor(fn: () => T | PromiseLike<T>) {
    this.fn = fn;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      const value = this.fn();
      return Promise.resolve(value).then(onfulfilled as any, onrejected as any);
    } catch (err) {
      return Promise.reject(err).then(onfulfilled as any, onrejected as any);
    }
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.then(undefined, onrejected as any);
  }

  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.then(
      (value) => {
        if (onfinally) onfinally();
        return value;
      },
      (err) => {
        if (onfinally) onfinally();
        throw err;
      }
    );
  }

  /** 事务专用：立即同步执行底层操作 */
  _run(): T {
    return this.fn() as T;
  }
}
