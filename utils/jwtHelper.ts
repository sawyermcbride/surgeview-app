import jwt from "jsonwebtoken";

interface User {
  email: string;
}

const generateToken = (user: User) => {
  console.log("Generating token for user");
  console.log(user.email);
  const payload = {
    email: user.email,
  };

  const options = {
    expiresIn: "6h",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
  return token;
};

export default generateToken;
