import HearthstoneJSON, { CardData } from "hearthstonejson-client";

let promise: null | Promise<CardsByDbfId> = null;

export type CardsByDbfId = { [dbfId: string]: CardData };

export function loadCards(): Promise<CardsByDbfId> {
	if (promise !== null) {
		return promise;
	}
	promise = doLoadCards();
	return promise;
}

async function doLoadCards(): Promise<CardsByDbfId> {
	const hsjon = new HearthstoneJSON();
	const listOfCards = await hsjon.get("latest");
	const result: CardsByDbfId = {};
	for (let card of listOfCards) {
		const dbfId = card.dbfId;
		if (!dbfId) {
			continue;
		}
		result["" + dbfId] = card;
	}
	return result;
}
