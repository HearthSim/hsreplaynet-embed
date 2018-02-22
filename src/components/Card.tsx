import React from "react";
import { Card as ComponentCard } from "react-hs-components";
import { CardsByDbfId } from "../tooltips";

interface Props {
	dbfId: number | null;
	cards: CardsByDbfId | null;
}

interface State {
	cards: null;
}

export default class Card extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			cards: null,
		};
	}

	public render(): React.ReactNode {
		if (!this.props.dbfId) {
			return null;
		}

		if (!this.props.cards) {
			return (
				<img
					src="https://hsreplay.net/static/images/loading_minion.png"
					style={{ width: "100%" }}
				/>
			);
		}

		const card = this.props.cards["" + this.props.dbfId];
		if (!card || !card.id) {
			return;
		}
		const cardId = card.id;

		let placeholder = null;
		if (card.type) {
			switch (card.type.toLowerCase()) {
				case "minion":
					placeholder =
						"https://hsreplay.net/static/images/loading_minion.png";
					break;
				case "spell":
					placeholder =
						"https://hsreplay.net/static/images/loading_spell.png";
					break;
				case "weapon":
					placeholder =
						"https://hsreplay.net/static/images/loading_weapon.png";
					break;
				case "hero":
					placeholder =
						"https://hsreplay.net/static/images/loading_hero.png";
					break;
			}
		}

		return (
			<ComponentCard
				id={cardId}
				resolution={256}
				placeholder={placeholder ? placeholder : undefined}
				style={{ width: "100%" }}
			/>
		);
	}
}
