
import {LitElement} from "lit-element"
import {ConstructorFor} from "../../types.js"

export function mixinFocusable<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return class FocusableComponent extends Constructor {
		constructor(...args: any[]) {
			super(...args)
			this.setAttribute("focusable", "")
		}
	}
}