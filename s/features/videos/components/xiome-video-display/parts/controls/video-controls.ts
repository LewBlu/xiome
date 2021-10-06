
import {renderView} from "./render-view.js"
import {renderViewCreator} from "./render-view-creator.js"
import {html} from "../../../../../../framework/component/component.js"
import {madstate} from "../../../../../../toolbox/madstate/madstate.js"
import {makeContentModel} from "../../../../models/parts/content-model.js"

export function videoControls({
		queryAll,
		contentModel: model,
		requestUpdate,
	}: {
		contentModel: ReturnType<typeof makeContentModel>
		requestUpdate: () => void
		queryAll: <E extends HTMLElement>(selector: string) => E[]
	}) {

	const {readable, writable, subscribe} = madstate({
		open: false,
		selectedContent: undefined as number | undefined,
		selectedPrivileges: [] as string[],
	})

	const toggleControls = () => {
		writable.open = !writable.open
	}

	function render(label: string) {
		const currentView = model.getView(label)
		const otherViews = model.views
			.filter(view => view.label !== label)

		return html`
			<h2>
				<span>video display controls</span>
				<xio-button @press=${toggleControls}>
					${readable.open ? "close" : "open"}
				</xio-button>
			</h2>
			${readable.open ? html`
				<p>this view <em>"${label}"</em></p>
				${currentView
					? renderView({
						view: currentView,
						onDeleteClick: () => model.deleteView(label),
						getPrivilegeDisplay: id => model.getPrivilege(id),
					})
					: renderViewCreator({
						queryAll,
						catalogOp: model.state.catalogOp,
						privilegesOp: model.state.privilegesOp,
						isContentSelected: readable.selectedContent !== undefined,
						isCreateButtonDisabled:
							readable.selectedContent === undefined
							|| readable.selectedPrivileges.length === 0,
						onCatalogSelect: index => {
							writable.selectedContent = index
						},
						onPrivilegesSelect: privileges => {
							writable.selectedPrivileges = privileges
						},
						onCreateClick: () => {
							const content = model.catalog[readable.selectedContent]
							writable.selectedContent = undefined
							writable.selectedPrivileges = []
							model.setView({
								label,
								privileges: readable.selectedPrivileges,
								reference: {
									id: content.id,
									type: content.type,
									provider: content.provider,
								},
							})
						}
					})}
				${otherViews.length
					? html`
						<p>all other views</p>
						<div class="otherviews">
							${otherViews.map(
								view => renderView({
									view,
									onDeleteClick: () => model.deleteView(view.label),
									getPrivilegeDisplay: id => model.getPrivilege(id),
								})
							)}
						</div>
					`
					: null}
			` : null}
		`
	}

	return {
		render,
		subscribe: () => subscribe(requestUpdate),
	}
}