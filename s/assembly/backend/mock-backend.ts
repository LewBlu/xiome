
import {assembleApi} from "./assemble-api.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {mockPrerequisites} from "./mock-prerequisites.js"

import {AppPayload, LoginEmailDetails} from "../../features/auth/auth-types.js"
import {MockSystemOptions} from "../types/mock-system-options.js"

export async function mockBackend({
		rando,
		tableStorage,
		platformHome,
		platformLabel,
		technicianEmail,
		sendLoginEmail,
		generateNickname,
	}: MockSystemOptions) {

	const {
		config,
		tables,
		signToken,
		verifyToken,
	} = await mockPrerequisites({
		rando,
		tableStorage,
		platformHome,
		platformLabel,
		technicianEmail,
	})

	let latestLoginEmail: LoginEmailDetails
	const getLatestLoginEmail = () => latestLoginEmail

	const api = assembleApi({
		rando,
		config,
		tables,
		signToken,
		verifyToken,
		generateNickname,
		sendLoginEmail: async details => {
			latestLoginEmail = details
			await sendLoginEmail(details)
		},
	})

	const platformAppToken = await signToken<AppPayload>({
		payload: {
			platform: true,
			appId: config.platform.appDetails.appId,
			origins: config.platform.appDetails.origins,
		},
		lifespan: 365 * (1000 * 60 * 60 * 24),
	})

	return {
		api,
		config,
		tables,
		platformAppToken,
		getLatestLoginEmail,
		mockBrowser: async() => mockBrowser({api}),
	}
}