import  Jwt  from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request{
      usuario?: string | jwt.JwtPayload
    }
  }

}