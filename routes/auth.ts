import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";

const router = express.Router()


router.post("/validate-token", (req: Request, res: Response) => {
    const token = req.body.accessToken;
    console.log(req.body);
    if(!token) {
        console.log("Invalid token: /auth/validate-token");
        return res.status(401).json( {valid: false, message: "Token is missing"});
    } 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return res.status(200).json({valid: true, email: decoded.email});
    } catch(err) {
        res.status(401).json({valid: false, message: "Invalid token" });
    }

});

router.post("/refresh-token", (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        return res.status(401).json({message: "Refresh token required"});
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);

        const accessToken = jwt.sign(
            {email: decoded.email},
            process.env.JWT_SECRET as string, 
            {expiresIn: "30m"}
        )

        return res.status(200).json({accessToken});
    } catch(err) {
        return res.status(403).json( {message: "Invalid refresh token"});
    }

});

export default router; 