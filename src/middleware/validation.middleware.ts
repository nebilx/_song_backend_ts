import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError } from "joi";

const validationMiddleware = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: {
            message: error.details.map((detail) => detail.message).join(", "),
          },
        });
      } else {
        next(error);
      }
    }
  };
};

export default validationMiddleware;
