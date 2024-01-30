import { Request, Response, NextFunction } from "express";

const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const r = schema.validate(schema);
      console.log(r);
      next();
    } catch (e: any) {
      console.log(e);
      return res.status(400).send(e.errors);
    }
  };

export default validate;
