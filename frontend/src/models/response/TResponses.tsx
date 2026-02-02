export type TResponse<T> = {
    status: number;
    payload: T;
    message: string;
};
export type TErrorPayload =  {
  message: string;
  errors: Record<string, unknown> | null;
  status: number;
}

export class ErrorResponse extends Error {
  public readonly status: number;
  public readonly errors: Record<string, unknown> | null;

  constructor(payload: TErrorPayload, originalError?: unknown) {
    super(payload.message);

    this.name = 'DjangoApiError';
    this.status = payload.status;
    this.errors = payload.errors ?? null;

    Object.setPrototypeOf(this, new.target.prototype);

    if (originalError) {
      (this as any).cause = originalError;
    }
  }
}





