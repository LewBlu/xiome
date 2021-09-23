
import {mockRemote} from "renraku/x/remote/mock-remote.js"
import {mockHttpRequest} from "renraku/x/remote/mock-http-request.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {mockVideoMeta} from "./meta/mock-meta.js"
import {VideoTables} from "../types/video-tables.js"
import {getRando} from "../../../toolbox/get-rando.js"
import {makeVideoModels} from "../models/video-models.js"
import {videoPrivileges} from "../api/video-privileges.js"
import {makeDacastService} from "../api/services/dacast-service.js"
import {mockAuthTables} from "../../auth/tables/mock-auth-tables.js"
import {mockDacastClient} from "../dacast/mocks/mock-dacast-client.js"
import {mockConfig} from "../../../assembly/backend/config/mock-config.js"
import {mockAppTables} from "../../auth/aspects/apps/tables/mock-app-tables.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {mockVerifyDacastApiKey} from "../dacast/mocks/mock-verify-dacast-api-key.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

interface SetupOptions {
	privileges: string[]
}

export const badApiKey = "nnn"
export const goodApiKey = "yyy"

const viewPrivilege = "9244947a5736b1e0343340e8911e1e39bce60241f96dc4e39fbec372eb716bb2"

export const roles = {
	unworthy: [],
	viewer: [viewPrivilege],
	moderator: [
		videoPrivileges["view all videos"],
		videoPrivileges["moderate videos"],
	],
}

const verifyDacastApiKey = mockVerifyDacastApiKey({goodApiKey})

export async function videoTestingSetup({privileges}: SetupOptions) {
	const rando = await getRando()
	const origin = "example.com"
	const storage = memoryFlexStorage()
	const videoTables = await mockStorageTables<VideoTables>(storage, {
		dacastAccountLinks: true,
	})
	const authTables = await mockAuthTables(storage)
	const authPolicies = prepareAuthPolicies({
		appTables: await mockAppTables(storage),
		authTables: new UnconstrainedTables(authTables),
		config: mockConfig({
			platformHome: "",
			platformOrigins: [],
		}),
		verifyToken: mockVerifyToken()
	})
	const numptyService = makeDacastService({
		verifyDacastApiKey,
		videoTables: new UnconstrainedTables(videoTables),
		basePolicy: authPolicies.anonPolicy,
	})
	const dacastService = mockRemote(numptyService).withMeta({
		meta: await mockVideoMeta({
			privileges,
			origins: [origin],
			userId: rando.randomId().toString(),
		}),
		request: mockHttpRequest({origin}),
	})
	return makeVideoModels({dacastService})
}

export async function setupLinked(options: SetupOptions) {
	const models = await videoTestingSetup(options)
	await models.dacastModel.linkAccount({apiKey: goodApiKey})
	return models
}