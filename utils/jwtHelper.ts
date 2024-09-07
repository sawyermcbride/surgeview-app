import jwt from "jsonwebtoken";

interface User {
  email: string;
}
let i = 1;

const generateToken = (user: User, generateRefreshToken: boolean) => {
  console.log("Generating token for user");
  console.log(`pass #${i++}`)
  console.log(user.email);
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
  
  return {token: accessToken, refreshToken};
};

export default generateToken;
