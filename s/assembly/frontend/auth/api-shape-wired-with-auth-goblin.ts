
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {makeAuthGoblin} from "../../../features/auth/goblin/auth-goblin.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {appTokenTopic} from "../../../features/auth/topics/app-token-topic.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"

export function prepareApiShapeWiredWithAuthGoblin({appId, tokenStore}: {
		appId: string
		tokenStore: TokenStore2
	}) {

	let authGoblin: AuthGoblin

	const shape = asShape<SystemApi>({
		auth: {
			appTokenService: {
				[_augment]: {
					getMeta: async() => undefined,
				},
				authorizeApp: true,
			},
			loginService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
					}),
				},
				authenticateViaLoginToken: true,
				authorize: true,
				sendLoginLink: true,
			},
			appService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				listApps: true,
				deleteApp: true,
				updateApp: true,
				registerApp: true,
			},
			manageAdminsService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				listAdmins: true,
				assignAdmin: true,
				revokeAdmin: true,
			},
			personalService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				setProfile: true,
			},
			userService: {
				[_augment]: {
					getMeta: async() => ({
						appToken: await authGoblin.getAppToken(),
						accessToken: await authGoblin.getAccessToken(),
					}),
				},
				getUser: true,
			},
		},
	})

	function installAuthGoblin({loginService, appTokenService}: {
			loginService: Service<typeof loginTopic>
			appTokenService: Service<typeof appTokenTopic>
		}) {
		authGoblin = makeAuthGoblin({
			appId,
			tokenStore,
			authorize: loginService.authorize,
			authorizeApp: appTokenService.authorizeApp,
		})
		return authGoblin
	}

	return {shape, installAuthGoblin}
}
