import { computeAccessibleName } from "../accessible-name";
import { renderIntoDocument } from "./helpers/test-utils";
import { prettyDOM } from "@testing-library/dom";
import diff from "jest-diff";

expect.extend({
	toHaveAccessibleName(received, expected) {
		if (received == null) {
			return {
				message: () => "",
				pass: false
			};
		}

		const actual = computeAccessibleName(received);
		if (actual !== expected) {
			return {
				message: () =>
					`expected ${prettyDOM(
						received
					)} to have accessible name '${expected}' but got '${actual}'\n${diff(
						expected,
						actual
					)}`,
				pass: false
			};
		}

		return {
			message: () =>
				`expected ${prettyDOM(
					received
				)} not to have accessible name '${expected}'\n${diff(
					expected,
					actual
				)}`,
			pass: true
		};
	}
});

test.each([
	[
		`
<div data-test aria-labelledby="label">I reference my name</div>
<div id="label" role="presentation">I'm prohibited a name</div>
`,
		"I'm prohibited a name"
	],
	[
		`
<element1 data-test id="el1" aria-labelledby="el3" />
<element2 id="el2" aria-labelledby="el1" />
<element3 id="el3"> hello </element3>
`,
		"hello"
	]
])(`&#`, (markup, accessibleName) => {
	const container = renderIntoDocument(markup);

	const testNode = container.querySelector("[data-test]");
	expect(testNode).toHaveAccessibleName(accessibleName);
});
