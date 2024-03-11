import { Response } from "express";

interface ItokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "none" | "strict" | undefined;
  secure?: boolean;
}

//Cookies Optins
export const accessTokenOption: ItokenOptions = {
  expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 60 * 1000),
  maxAge: 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const setAccessToken = (user: any, res: Response) => {
  const accessToken = user.getJWTToken();

  //Only Set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOption.secure = true;
  }
  //Setting Access Token into Cookies of Client
  res.cookie("access_token", accessToken, accessTokenOption);
  //Sending Response To Client
  return { accessToken };
};
