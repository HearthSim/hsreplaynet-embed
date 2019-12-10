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
		if (childNodes.some(node => node.nodeType !== Node.TEXT_NODE)) {
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

	const show = async (touched: boolean): Promise<void> => {
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
			<Tooltip attachTo={element} touched={touched}>
				<Card dbfId={dbfId} cards={cards} />
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
		show(false);
	});
	element.addEventListener("mouseleave", event => {
		event.preventDefault();
		hide();
	});
	element.addEventListener("touchstart", event => {
		event.preventDefault();
		show(true);
	});
	element.addEventListener("touchend", event => {
		event.preventDefault();
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
		"https://hsreplay.net/static/images/loading_minion.png",
		"https://hsreplay.net/static/images/loading_spell.png",
		"https://hsreplay.net/static/images/loading_weapon.png",
		"https://hsreplay.net/static/images/loading_hero.png",
	]) {
		const prefetch = document.createElement("link");
		prefetch.setAttribute("rel", "prefetch");
		prefetch.setAttribute("href", url);
		document.head.appendChild(prefetch);
	}
});
