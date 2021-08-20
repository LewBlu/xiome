
import {applyMockHacks} from "./assembly/frontend/mocks/apply-mock-hacks.js"
import {memoryFlexStorage} from "./toolbox/flex-storage/memory-flex-storage.js"
import {registerComponents} from "./framework/component/register-components.js"
import {mockConnectApp} from "./assembly/frontend/connect/mock/mock-connect-app.js"
import {addMockLatency} from "./assembly/frontend/mocks/effects/add-mock-latency.js"
import {assembleAndInitializeFrontend} from "./assembly/frontend/assemble-and-initialize-frontend.js"

void async function demos() {
	const connection = await mockConnectApp({
		appWindowLink: window.location.href,
		origins: [window.location.origin],
		storage: memoryFlexStorage(),
	})

	connection.remote = addMockLatency({
		remote: connection.remote,
		latency: {min: 200, max: 800},
	})

	const frontend = await assembleAndInitializeFrontend(connection)
	applyMockHacks({connection, frontend})
	const xiome = {...connection, ...frontend}
	document.body.prepend(xiome.modalsElement)

	await xiome.models.accessModel.sendLoginLink("creative@xiome.io")

	const demoComponents = {}
	for (const [key, value] of Object.entries(xiome.components))
		demoComponents[`Demo${key}`] = value

	registerComponents(demoComponents)
}()