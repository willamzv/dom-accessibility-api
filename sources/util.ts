import getRole from "./getRole";

export function isElement(node: Node | null): node is Element {
	return (
		// @ts-ignore
		node !== null && node instanceof node.ownerDocument.defaultView.Element
	);
}

export function isHTMLInputElement(
	node: Node | null
): node is HTMLInputElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLInputElement
	);
}

export function isHTMLSelectElement(
	node: Node | null
): node is HTMLSelectElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLSelectElement
	);
}

export function isHTMLTextAreaElement(
	node: Node | null
): node is HTMLTextAreaElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLTextAreaElement
	);
}

export function safeWindow(node: Node): Window {
	const { defaultView } =
		node.ownerDocument === null ? (node as Document) : node.ownerDocument;

	if (defaultView === null) {
		throw new TypeError("no window available");
	}
	return defaultView;
}

/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */
export function queryIdRefs(node: Node, attributeName: string): Element[] {
	if (isElement(node) && node.hasAttribute(attributeName)) {
		// safe due to hasAttribute check
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const ids = node.getAttribute(attributeName)!.split(" ");

		return (
			ids
				// safe since it can't be null for an Element
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				.map((id) => node.ownerDocument!.getElementById(id))
				.filter(
					(element: Element | null): element is Element => element !== null
					// TODO: why does this not narrow?
				) as Element[]
		);
	}

	return [];
}

export function hasAnyConcreteRoles(
	node: Node,
	roles: Array<string | null>
): node is Element {
	if (isElement(node)) {
		return roles.indexOf(getRole(node)) !== -1;
	}
	return false;
}
