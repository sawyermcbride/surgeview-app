import jwt from "jsonwebtoken";

interface User {
  email: string;
}

interface GenerateTokenResponse {
  refreshToken: string | null,
  accessToken: string
}

/**
 * 
 * @param user object containing email like {email: name@site.com}
 * @param generateRefreshToken boolean to generate refresh token or not
 * @returns GenerateResponseToken containing object with 
 *  - accessToken: string
 *  - refreshToken: string or null (if not requested in parameter)
 */

const generateToken = (user: User, generateRefreshToken: boolean): GenerateTokenResponse => {

  const payload = {
    email: user.email,
  };

  
  const accessToken = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
    expiresIn: "6h"
  });

  let refreshToken: string | null = null;
  
  if(generateRefreshToken) {
      refreshToken = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn: "7d"
    })

  }
  
  return {accessToken, refreshToken};
};

export default generateToken;
