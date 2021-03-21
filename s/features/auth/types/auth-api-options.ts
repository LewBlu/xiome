
import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {PlatformConfig} from "../../../assembly/backend/types/platform-config.js"
import {SendLoginEmail} from "./emails/send-login-email.js"

export interface AuthApiOptions {
	rando: Rando
	config: PlatformConfig
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}