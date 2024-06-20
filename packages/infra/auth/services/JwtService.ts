import { UserInfo } from "@project/domain/users/UserInfo.js"
import { Constant, Injectable } from "@tsed/di"
import { deserialize, serialize } from "@tsed/json-mapper"
import * as jose from "jose"
import { JWTPayload } from "jose"

export interface CustomJWTPayload extends JWTPayload {
  user: UserInfo
}

@Injectable()
export class JwtService {
  @Constant("envs.JWT_SECRET")
  private secret: string

  @Constant("envs.JWT_ISSUER")
  private issuer: string

  @Constant("envs.JWT_AUDIENCE")
  private aud: string

  @Constant("envs.JWT_EXPIRE_TIME", "2h")
  private expireTime: string

  @Constant("envs.JWT_ALG_ENCRYPTION", "A128CBC-HS256")
  private enc: string

  @Constant("envs.JWT_ALG", "dir")
  private alg: string

  async encode(payload: CustomJWTPayload) {
    const secret = jose.base64url.decode(this.secret)

    return new jose.EncryptJWT({
      ...payload,
      user: serialize(payload.user)
    })
      .setProtectedHeader({ alg: this.alg, enc: this.enc })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.aud)
      .setExpirationTime(this.expireTime)
      .encrypt(secret)
  }

  async decode(jwt: string) {
    const secret = jose.base64url.decode(this.secret)

    const result = await jose.jwtDecrypt<CustomJWTPayload>(jwt, secret, {
      issuer: this.issuer,
      audience: this.aud
    })

    return {
      ...result,
      payload: {
        ...result.payload,
        user: deserialize<UserInfo>(result.payload.user, { type: UserInfo })
      }
    }
  }
}
