
import {Service} from "../../../../../types/service.js"
import {html} from "../../../../../framework/component.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {manageAdminsTopic} from "../../../topics/manage-admins-topic.js"
import {adminManagerControls} from "./aspects/admin-manager-controls.js"
import {emailValidator} from "../../../topics/apps/admin-email-validator.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"
import {adminManagerStateAndActions} from "./aspects/admin-manager-state-and-actions.js"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"
import {renderWrappedInLoading} from "../../../../../framework/loading/render-wrapped-in-loading.js"

export function makeAdminManager({app, manageAdminsService, query}: {
		app: AppDisplay
		manageAdminsService: Service<typeof manageAdminsTopic>
		query: <E extends HTMLElement>(selector: string) => E
	}) {

	const {state, actions} = adminManagerStateAndActions()
	const controls = adminManagerControls({
		app,
		state,
		actions,
		manageAdminsService,
	})

	function handleEmailChange(event: ValueChangeEvent<string>) {
		const email = event.detail ?? undefined
		actions.setAssignerDraft({email})
	}

	function handleAssignButtonPress() {
		const textInput = query<XioTextInput>(".adminassigner xio-text-input")
		controls.assignAdmin()
		textInput.text = ""
	}

	function renderAdminAssigner() {
		return html`
			<div class=adminassigner>
				<div>
					<xio-text-input
						part=textinput
						.validator=${emailValidator}
						@valuechange=${handleEmailChange}>
							email
					</xio-text-input>
				</div>
				<div>
					<xio-button
						?disabled=${!state.assignerDraft.email}
						@press=${handleAssignButtonPress}>
							grant
					</xio-button>
				</div>
			</div>
		`
	}

	function renderAdminList() {
		return html`
			<div class=adminlist>
				${renderWrappedInLoading(state.adminsLoadingView, admins => html`
					<ul>
						${admins.map(({email, userId}) => html`
							<li>
								<span>${email}</span>
								<xio-button @press=${() => controls.revokeAdmin(userId)}>
									revoke
								</xio-button>
							</li>
						`)}
					</ul>
				`)}
			</div>
		`
	}

	function render() {
		return html`
			<h4>manage admins</h4>
			${renderAdminAssigner()}
			${renderAdminList()}
		`
	}

	return {render, controls}
}