import { Request, Response } from "express";
import log from "./logger";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ContractnSign",
      version: "1.0.0",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/Schema/*.js"], // files containing annotations as above
};

const swaggerSpecs = swaggerJsDoc(options);

const swaggerDocs = (app: any, port: number) => {
  app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  log.info(`Swagger Docs available at http://localhost:${port}/swagger-docs`);
};

export default swaggerDocs;
