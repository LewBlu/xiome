
import {Await} from "../../../../types/await.js"
import {makeChatModel} from "../../models/chat-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../../framework/component.js"

import styles from "./xiome-chat.css.js"
import {ChatStatus} from "../../common/types/chat-concepts.js"
import {whenOpReady} from "../../../../framework/op-rendering/when-op-ready.js"

@mixinStyles(styles)
export class XiomeChat extends ComponentWithShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}> {

	@property({type: String})
	room: string = "default"

	get #model() {
		return this.share.chatModel
	}

	#room: Await<ReturnType<ReturnType<typeof makeChatModel>["room"]>>

	async init() {
		this.#room = await this.#model.room(this.room)
		this.requestUpdate()
	}

	#renderModerationHeader() {
		const status = this.#room.status
		const toggleStatus = () => {
			this.#room.setRoomStatus(
				this.#room.status === ChatStatus.Offline
					? ChatStatus.Online
					: ChatStatus.Offline
			)
		}
		return this.#model.allowance.moderateAllChats
			? html`
				<header>
					<p>room="${this.room}"</p>
					<p>
						<xio-button @press=${toggleStatus}>
							set status
							${status === ChatStatus.Offline ? "online" : "offline"}
						</xio-button>
					</p>
				</header>
			`
			: null
	}

	#renderHistory() {
		return html`
			<div class=history>
				${this.#model.allowance.viewAllChats
					? html`
						<ol>
							<li>lol chat messages go here</li>
						</ol>
					`
					: html`
						<p class=unprivileged>you are not privileged to view the chat</p>
					`}
			</div>
		`
	}

	#renderParticipation() {
		return html`
			<xiome-login-panel>
				${whenOpReady(this.#model.state.accessOp, () => html`
					<div slot=logged-out>
						<p>login to participate in the chat</p>
					</div>
					<div class=participation>
						${this.#model.allowance.participateInAllChats
							? html`
								<p>authorship area</p>
							`
							: html`
								<p class=unprivileged>you do not have privilege to participate in the chat</p>
							`}
					</div>
				`)}
			</xiome-login-panel>
		`
	}

	render() {
		return renderOp(this.#model.state.connectionOp, () => html`
			<div class=chatbox>
				${this.#renderModerationHeader()}
				${this.#renderHistory()}
				${this.#renderParticipation()}
			</div>
		`)
	}
}
