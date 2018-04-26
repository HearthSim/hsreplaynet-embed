import React from "react";
import ReactDOM from "react-dom";
import documentReady from "@awaitbox/document-ready";
import { DeckDefinition, decode } from "deckstrings";
import Deck from "./components/Deck";
import { loadCards } from "./cards";

function findElements(): HTMLElement[] {
	const list = document.querySelectorAll(
		"pre.hearthstone-deck"
	) as NodeListOf<HTMLElement>;
	return Array.from(list);
}

function isElementVisible(element: HTMLElement): boolean {
	const { top, bottom } = element.getBoundingClientRect();
	return top >= 0 && bottom <= window.innerHeight;
}

documentReady().then(() => {
	for (const element of findElements()) {
		const parent = element.parentNode;
		if (!parent) {
			continue;
		}
		const container = document.createElement("div");
		const content = element.innerText;
		const lines = content.split("\n");

		let label: string | null = null;
		const labelRegExp = /^###(.*)$/;
		for (const line of lines) {
			const match = labelRegExp.exec(line);
			if (match) {
				label = match[1].trim();
				break;
			}
		}
		const body = lines.filter(line => line.substr(0, 1) !== "#");
		let deck: DeckDefinition | null = null;
		try {
			deck = decode(body.join("\n").trim());
		} catch (e) {
			console.error(e);
			continue;
		}
		if (deck === null) {
			continue;
		}
		parent.replaceChild(container, element);
		ReactDOM.render(<Deck deck={deck} cards={null} />, container);
		const loadIfVisible = () => {
			if (isElementVisible(element)) {
				loadCards().then(cards => {
					if (!deck) {
						return;
					}
					ReactDOM.render(
						<Deck
							label={label !== null ? label : undefined}
							deck={deck}
							cards={cards}
						/>,
						container
					);
					document.removeEventListener("scroll", loadIfVisible);
				});
			}
		};
		document.addEventListener("scroll", loadIfVisible);
		loadIfVisible();
	}
});
