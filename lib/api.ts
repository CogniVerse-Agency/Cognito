import { ZodError } from "zod";

export function apiSuccess<T>(data: T, message?: string) {
  return Response.json(
    message ? { data, message } : { data },
    {
      status: 200
    }
  );
}

export function apiError(
  error: string,
  status = 500,
  details?: unknown
) {
  return Response.json(
    details ? { error, details } : { error },
    {
      status
    }
  );
}

export function getErrorDetails(error: unknown) {
  if (error instanceof ZodError) {
    return error.flatten();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error;
}
