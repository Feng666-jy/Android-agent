import type { Response } from "express";
import type { ApiResponse } from "../types/index.js";

export function success<T>(res: Response, data: T, message = "success", status = 200): void {
  const body: ApiResponse<T> = { code: 0, message, data };
  res.status(status).json(body);
}

export function fail(res: Response, message: string, code = -1, status = 400): void {
  const body: ApiResponse<null> = { code, message, data: null };
  res.status(status).json(body);
}

export function unauthorized(res: Response, message = "Unauthorized"): void {
  fail(res, message, 2000, 401);
}

export function forbidden(res: Response, message = "Forbidden"): void {
  fail(res, message, 2002, 403);
}

export function notFound(res: Response, message = "Not found"): void {
  fail(res, message, 1002, 404);
}

export function serverError(res: Response, message = "Internal server error"): void {
  fail(res, message, 5000, 500);
}