
import {css} from "../../../framework/component.js"
export default css`

button {
	font: inherit;
	color: inherit;
	background: transparent;
}

.container {
	position: relative;
	display: flex;
	flex-direction: var(--_flex-direction);
	user-select: none;
	cursor: pointer;
	border: none;
	letter-spacing: 0.1em;
	align-items: var(--_flex-align-items);
}

:host {
	display: inline-block;
	position: relative;
	/*Variables for element customization below*/
	--_div-id-width: initial;
	--_div-id-text-overflow: ellipsis;
	--_flex-direction: row;
	--_flex-align-items: center;
}

:host::before {
	opacity: 0;
	content: "copied!";
	display: block;
	position: absolute;
	top: -0.5em;
	right: -0.5em;
	background: #0a0c;
	padding: 0 0.5em;
	border-radius: 1em;
	pointer-events: none;
	z-index: 1;
}

:host(:not([copied]))::before {
	transition: opacity 500ms ease;
}

:host([copied])::before {
	opacity: 1;
}

.content {
	display: flex;
	justify-content: row;
}

.label::after {
	content: ":";
	margin-right: 0.2em;
}

.id {
	opacity: 0.75;
	max-width: var(--id-max-width, 6em);
	overflow: hidden;
	text-overflow: var(--_div-id-text-overflow);
	white-space: nowrap;
	width: var(--_div-id-width);
}

.copy svg {
	width: 1em;
	height: 1em;
}

.copy {
	opacity: 0.4;
	transition: opacity 100ms linear;
}

.container:hover .copy {
	opacity: 0.9;
}

.container:active .copy {
	opacity: 1;
}

`
