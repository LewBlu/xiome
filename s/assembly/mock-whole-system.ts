
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {AppPayload, AuthTokens, CoreApi, TriggerAccountPopup} from "../features/core/core-types.js"

import {getRando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {dbbyMemory} from "../toolbox/dbby/dbby-memory.js"

import {Tables} from "./assembly-types.js"
import {expiryGraceTime} from "./constants.js"
import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"
import {mockPlatformConfig} from "./mock-platform-config.js"

export async function mockWholeSystem({storage}: {
		storage: SimpleStorage
	}) {

	//
	// prerequisites and configurations
	//

	const rando = await getRando()
	const config = mockPlatformConfig({rando})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const tables: Tables = {
		core: {
			account: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
			accountViaPasskey: dbbyMemory(),
		},
	}

	//
	// backend assembly
	//

	const backend = await assembleBackend({
		rando,
		tables,
		storage,
		signToken,
		verifyToken,
	})

	//
	// bridge connecting backend and frontend
	//

	let triggerAccountPopup: TriggerAccountPopup = () => {
		throw new Error("mockNextLogin not set")
	}

	function mockNextLogin(
			authenticateAndAuthorize:
				(authTopic: CoreApi["authTopic"]) => Promise<AuthTokens>
		) {
		triggerAccountPopup = async() =>
			authenticateAndAuthorize(backend.coreApi.authTopic)
	}

	//
	// frontend assembly
	//

	const frontend = await assembleFrontend({
		backend,
		expiryGraceTime,
		triggerAccountPopup,
	})

	async function signAppToken(payload: AppPayload) {
		return signToken({payload, lifespan: config.tokens.lifespans.app})
	}

	//
	// return handy system internals for testing and debugging
	//

	return {config, backend, frontend, tables, mockNextLogin, signAppToken}
}
