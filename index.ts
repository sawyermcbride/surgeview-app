//index.ts

import * as dotenv from "dotenv";
dotenv.config();

import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import signupRouter from "./routes/signup";
import loginRouter from "./routes/login";
import campaignRouter from "./routes/campaign";
import authRouter from "./routes/auth";
import youtubeRouter from "./routes/youtube";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { testConnection } from "./db";
import cors from "cors";
import { expressjwt as jwt } from "express-jwt";



if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if(!process.env.YOUTUBE_API_KEY) {
  throw new Error("YouTube API key is not defined");
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3001;

console.log("JWT_SECRET: ", process.env.JWT_SECRET);

app.use(
  cors({
    origin:
      "http://10.0.0.47:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);

app.use( (req: Request, res: Response, next) => {
  console.log(req.url);
  next();
})

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

app.use("/youtube", youtubeRouter);

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/auth", authRouter);

app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
  }).unless({
    path: [
      '/signup',
      '/login',
      '/youtube', // Exclude this route from JWT authentication
    ]
  })
);


//Protected routes: 

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

app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
