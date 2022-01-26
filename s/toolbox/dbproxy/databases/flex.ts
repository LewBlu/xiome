
import {obtain} from "../../obtain.js"
import {objectMap} from "../../object-map.js"
import {RowStorage} from "./flex/row-storage.js"
import {sequencer} from "../../sequencer/sequencer.js"
import {memoryTransaction} from "./flex/memory-transaction.js"
import {pathToStorageKey} from "./utils/path-to-storage-key.js"
import {Database, Schema, SchemaToShape, Shape} from "../types.js"
import {FlexStorage} from "../../flex-storage/types/flex-storage.js"

export function flex<xSchema extends Schema>(
		flexStorage: FlexStorage,
		shape: SchemaToShape<xSchema>,
	): Database<xSchema> {

	const storage = new RowStorage(flexStorage)
	const safeMemoryTransaction = sequencer(memoryTransaction)

	return {

		tables: (() => {
			function recurse(innerShape: Shape, path: string[]) {
				return objectMap(innerShape, (value, key) => {
					const currentPath = [...path, key]
					return typeof value === "boolean"
						// TODO consider replacing proxy with regular object,
						// because the proxy behaves strangely when returned
						// from an async function
						? new Proxy({}, {
							get(target, prop) {
								if (!target[prop]) {
									target[prop] = async(...args: any[]) => safeMemoryTransaction({
										shape,
										storage,
										async action({tables}) {
											return obtain(tables, currentPath)[prop](...args)
										},
									})
								}
								return target[prop]
							},
							set() {
								throw new Error(
									`table "${pathToStorageKey(currentPath)}" is readonly`
								)
							},
						})
						: recurse(value, currentPath)
				})
			}
			return recurse(shape, [])
		})(),

		async transaction(action) {
			return safeMemoryTransaction({
				shape,
				storage,
				action,
			})
		},
	}
}
