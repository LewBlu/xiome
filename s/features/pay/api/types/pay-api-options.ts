
import {Stripe} from "stripe"
import {PayTables} from "./tables/pay-tables.js"
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"

export interface PayApiOptions {
	rando: Rando
	stripe: Stripe
	rawPayTables: PayTables
	verifyToken: VerifyToken
}