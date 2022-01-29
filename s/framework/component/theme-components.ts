
import {LitElement} from "lit"

import {CSS} from "./types/component-types.js"
import {mixinStyles} from "./mixins/mixin-styles.js"
import {objectMap} from "../../toolbox/object-map.js"
import {ConstructorFor} from "../../types/constructor-for.js"

export const themeComponents = <
		xComponents extends {[key: string]: ConstructorFor<LitElement>}
	>(
		theme: CSS,
		components: xComponents
	): xComponents => {

	return objectMap(
		components,
		Component => mixinStyles(theme)(Component),
	)
}
