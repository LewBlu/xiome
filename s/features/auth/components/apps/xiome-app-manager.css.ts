
import {css} from "../../../../framework/component.js"
export default css`

code {
	display: inline-block;
	font-size: 0.8em;
	padding: 0.2em;
	border-radius: 0.3em;
	background: #0002;
	overflow-wrap: anywhere;
	word-break: break-all;
}

code.id {
	opacity: 0.7;
	font-size: 0.5em;
}

.codeblock {
	display: block;
}

.htmlcode { color: #fff6; }
.htmlcode [data-syntax=tag] { color: deepskyblue; }
.htmlcode [data-syntax=attr] { color: skyblue; }
.htmlcode [data-syntax=data] { color: #aaffa0; }
.htmlcode [data-syntax=indent] {
	display: block;
	margin-left: 1em;
}

.app-list {
	margin-bottom: 2em;
}

.app {
	padding: 0.4em 1rem;
	margin: var(--app-margin, 0);
	margin-top: 0.5em;
}

.app > * + * {
	margin-top: 0.3em;
}

.app + .app {
	margin-top: 1.5em;
}

.app-code {
	margin: 1em 0 !important;
}

.app-code code {
	padding: 1em 2em;
}

.app-creator {
	margin-bottom: 2em;
}

.app-creator xio-text-input {
	display: block;
	width: 100%;
}

.app-creator > * + * {
	margin-top: 0.3em;
}

.app {
	border: 1px solid #fff1;
	border-radius: 0.2em;
}

.delete-app-button {
	display: block;
	text-align: right;
	color: red;
	--xio-button-hover-background: red;
}

`
