import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import documentReady from "@awaitbox/document-ready";
import { loadCards } from "./cards";
import Card from "./components/Card";
import Tooltip from "./components/Tooltip";
import { CardsByDbfId } from "./cards";

let cards: CardsByDbfId | null = null;

function findElements(hrefRegExp: RegExp): HTMLAnchorElement[] {
	const links = document.querySelectorAll(
		'a[href*="hsreplay.net/cards/"]'
	) as NodeListOf<HTMLAnchorElement>;

	return Array.from(links).filter((link: HTMLAnchorElement) => {
		// reject nodes containing images or other markup
		const childNodes = Array.from(link.childNodes);
		if (
			!childNodes.every(
				node =>
					node.nodeType === Node.TEXT_NODE ||
					// fix <a href="..."><strong>Text</strong></a>
					(node.nodeType === Node.ELEMENT_NODE &&
						["STRONG", "EM", "I"].indexOf(node.nodeName) !== -1 &&
						Array.from(node.childNodes).every(
							childNode => childNode.nodeType === Node.TEXT_NODE
						))
			)
		) {
			return false;
		}

		// reject nodes without href
		const url = link.getAttribute("href");
		if (url === null) {
			return false;
		}

		// reject nodes with non-matching regular expression
		const result = hrefRegExp.exec(url);
		if (result === null) {
			return false;
		}

		// pick nodes if they have a numeric dbfId
		const dbfId = +result[1];
		return !isNaN(dbfId);
	});
}

function getDbfIdFromUrl(url: string): number {
	const regexp = /^https?:\/\/hsreplay.net\/cards\/(\d+)\/?/;
	const results = regexp.exec(url);
	if (results === null) {
		throw new Error("Invalid url");
	}
	return +results[1];
}

function attachEvents(element: HTMLElement, container: HTMLElement): void {
	let cancelImmediate = false;

	const show = async (
		touched: boolean,
		position?: { clientX: number; clientY: number }
	): Promise<void> => {
		cancelImmediate = false;
		const url = element.getAttribute("href");
		if (url === null) {
			return;
		}
		const dbfId = getDbfIdFromUrl(url);
		if (cards === null) {
			cards = await loadCards();
			if (cancelImmediate) {
				return;
			}
		}
		render(
			<Tooltip
				attachTo={element}
				touched={touched}
				initialPosition={position}
			>
				<Card key={dbfId} dbfId={dbfId} cards={cards} />
			</Tooltip>,
			container
		);
	};

	const hide = () => {
		cancelImmediate = true;
		unmountComponentAtNode(container);
	};

	element.addEventListener("mouseenter", event => {
		event.preventDefault();
		show(false, { clientX: event.clientX, clientY: event.clientY });
	});
	element.addEventListener("mouseleave", event => {
		event.preventDefault();
		hide();
	});
	element.addEventListener("touchstart", event => {
		event.preventDefault();
		const touches = event.touches;
		let initialPosition:
			| { clientX: number; clientY: number }
			| undefined = undefined;
		if (touches.length > 0) {
			initialPosition = {
				clientX: touches[0].clientX,
				clientY: touches[0].clientY,
			};
		}
		show(true, initialPosition);
	});
	element.addEventListener("touchend", event => {
		if (event.cancelable) {
			event.preventDefault();
		}
		hide();
	});
	window.addEventListener("scroll", () => hide());
}

export function getTooltipContainer(): HTMLElement {
	const existing = document.getElementById(
		"hsreplaynet-embed-tooltip-container"
	);
	if (existing) {
		return existing;
	}
	const container = document.createElement("div");
	container.id = "hsreplaynet-embed-tooltip-container";
	document.body.appendChild(container);
	return container;
}

documentReady().then(() => {
	const container = getTooltipContainer();
	const regexp = /^https?:\/\/hsreplay.net\/cards\/(\d+)\/?/;
	const elements = findElements(regexp);
	elements.forEach(element => attachEvents(element, container));

	// preload placeholders
	for (let url of [
		"https://static.hsreplay.net/static/images/loading_minion.png",
		"https://static.hsreplay.net/static/images/loading_spell.png",
		"https://static.hsreplay.net/static/images/loading_weapon.png",
		"https://static.hsreplay.net/static/images/loading_hero.png",
	]) {
		const prefetch = document.createElement("link");
		prefetch.setAttribute("rel", "prefetch");
		prefetch.setAttribute("href", url);
		document.head.appendChild(prefetch);
	}
});
