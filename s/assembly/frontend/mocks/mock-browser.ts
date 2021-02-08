
import {mockRemote} from "./mock-remote.js"
import {mockApiOrigin} from "./mock-api-origin.js"
import {assembleModels} from "../assemble-models.js"
import {MockLatency} from "../../../framework/add-mock-latency.js"
import {loginWithLinkTokenOrUseExistingLogin} from "../auth/login-with-link-token-or-use-existing-login.js"

import {SystemApi} from "../../backend/types/system-api.js"

export async function mockBrowser({api}: {api: SystemApi}) {
	const {mockTokenIframe} = mockApiOrigin()

	async function mockAppWindow({
			appId,
			apiLink,
			latency,
			windowLink,
		}: {
			appId: string
			apiLink: string
			windowLink: string
			latency: MockLatency
		}) {
		const {tokenStore, onStorageEvent} = mockTokenIframe(appId)
		const {remote, authGoblin} = mockRemote({
			api,
			appId,
			apiLink,
			latency,
			tokenStore,
			origin: new URL(windowLink).origin,
		})
		onStorageEvent(authGoblin.refreshFromStorage)
		const models = await assembleModels({
			remote,
			authGoblin,
			link: windowLink,
		})
		await loginWithLinkTokenOrUseExistingLogin({
			link: windowLink,
			authModel: models.authModel,
		})
		return {models, remote}
	}

	return {mockAppWindow}
}
