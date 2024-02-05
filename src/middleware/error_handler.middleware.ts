import { Response, Request, NextFunction } from "express";
import { errorMsg } from "../type/index.type";

const errorhandler = (
  err: errorMsg,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
};

export default errorhandler;
