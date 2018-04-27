import React from "react";
import { CardTile as ComponentCardTile } from "react-hs-components";
import { CardsByDbfId } from "../cards";
import { CardData } from "hearthstonejson-client";

interface Props {
	dbfId: number;
	count: number;
	cards: CardsByDbfId | null;
}

export default class CardTile extends React.Component<Props> {
	private ref: any;

	public render(): React.ReactNode {
		let cardId = null,
			cardName = null,
			cardCost = null,
			cardRarity = null;
		if (this.props.cards !== null) {
			const card = this.props.cards[this.props.dbfId];
			if (!card) {
				return null;
			}
			cardId = card.id || "";
			cardName = card.name || "";
			cardCost = card.cost || 0;
			cardRarity = card.rarity || "COMMON";
		}
		const urlCardName = (cardName || "")
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-");
		return (
			<a
				href={`https://hsreplay.net/cards/${
					this.props.dbfId
				}/${urlCardName}/`}
				target="_blank"
				rel="noopener"
			>
				<ComponentCardTile
					id={cardId}
					name={cardName}
					cost={cardCost}
					number={
						!!cardId && this.props.count !== 1
							? this.props.count
							: undefined
					}
					rarity={!!cardRarity ? cardRarity : undefined}
					fontFamily="Noto Sans, sans-serif"
					ref={ref => (this.ref = ref)}
				/>
			</a>
		);
	}
}
