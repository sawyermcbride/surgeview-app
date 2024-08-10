import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";
import signupRouter from "./routes/signup";
import loginRouter from "./routes/login";
import campaignRouter from "./routes/campaign";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { testConnection } from "./db";
import cors from "cors";
import { expressjwt as jwt } from "express-jwt";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;

app.use(
  cors({
    origin:
      "https://c304dd4f-9bd6-4c65-acc2-d9c0935d9e52-00-3pwa21tc6kufh.janeway.replit.dev:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "view/public")));

testConnection();
// app.get("*", (req: Request, res: Response) => {
//   res.status(200).sendFile(path.join(__dirname, "view/build", "index.html"));
// });
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
  }),
);

app.use("/campaign", campaignRouter);

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (err.name === "UnauthorizedError") {
      // If error is due to invalid JWT token
      return res.status(401).json({
        error: "Unauthorized",
        message: err.message,
      });
    }
    // For other errors, pass to default error handler
    next(err);
  },
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
