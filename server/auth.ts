import { expressjwt as jwt } from 'express-jwt'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import jwks from 'jwks-rsa'
import 'dotenv/config'

const domain = process.env.AUTH0_DOMAIN
const audience = process.env.AUTH0_AUDIENCE

if (!domain || !audience) {
  console.error('Missing AUTH0_DOMAIN or AUTH0_AUDIENCE environment variables')
  console.error('AUTH0_DOMAIN:', domain)
  console.error('AUTH0_AUDIENCE:', audience)
  throw new Error('Auth0 configuration incomplete')
}

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
})

export default checkJwt

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JwtRequest<TReq = any, TRes = any>
  extends Request<ParamsDictionary, TRes, TReq> {
  auth?: JwtPayload
}