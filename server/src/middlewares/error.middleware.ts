import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"
import { serviceErrorMap } from "../constants/serviceError"

export function errorMiddleware(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Express error middleware is untyped by convention
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    })
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Duplicate value already exists",
      code: "DUPLICATE_VALUE",
    })
  }

  if (err.code === "P2023" || err.code === "P2007") {
    return res.status(400).json({
      message: "Invalid ID format",
      code: "INVALID_ID_FORMAT",
    })
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Resource not found",
      code: "RESOURCE_NOT_FOUND",
    })
  }

  if (serviceErrorMap[err.message]) {
    const mappedError = serviceErrorMap[err.message]

    return res.status(mappedError.statusCode).json({
      message: mappedError.message,
      code: err.message,
    })
  }

  return res.status(500).json({
    message: "Internal server error",
  })
}
