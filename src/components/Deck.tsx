import React from "react";
import CardTile from "./CardTile";
import { CardsByDbfId } from "../cards";
import { DeckDefinition } from "deckstrings";
import { CardData } from "hearthstonejson-client";
import styled from "styled-components";
import { encode } from "deckstrings";

interface Props {
	label?: string;
	deck: DeckDefinition;
	cards: CardsByDbfId | null;
	noCopy?: boolean;
}

const DeckDiv = styled.div`
	width: 260px;
	font-size: 1.75rem;
	margin: 1em 0 2em 0;
`;

const DeckLabel = styled.span`
	font-weight: bold;
	font-size: 1.75rem;
`;

const CardList = styled.ul`
	padding: 0;
	margin: 0.3em 0;

	li {
		list-style-type: none;
		padding-left: 0;
		margin: 0;
	}
`;

const DeckStringInput = styled.input`
	width: 100%;
`;

export default class Deck extends React.Component<Props> {
	private input: HTMLInputElement | null = null;

	public render(): React.ReactNode {
		const sorted = this.props.deck.cards.slice();
		sorted.sort(this.sortCards.bind(this));
		return (
			<DeckDiv>
				{this.props.label ? (
					<DeckLabel>{this.props.label}</DeckLabel>
				) : null}
				<CardList>
					{sorted.map(([dbfId, count], index) => {
						return (
							<li key={index}>
								<CardTile
									dbfId={dbfId}
									count={count}
									cards={this.props.cards}
								/>
							</li>
						);
					})}
				</CardList>
				{!this.props.noCopy ? (
					<DeckStringInput
						type="text"
						value={encode(this.props.deck)}
						spellCheck={false}
						innerRef={(ref: HTMLInputElement) => (this.input = ref)}
						onClick={() => {
							if (!this.input) {
								return null;
							}
							this.input.setSelectionRange(
								0,
								this.input.value.length
							);
						}}
						readOnly
					/>
				) : null}
			</DeckDiv>
		);
	}

	sortCards(a: [number, number], b: [number, number]): number {
		if (!this.props.cards) {
			return 0;
		}
		const [aDbfId, aCount] = a;
		const [bDbfId, bCount] = b;
		const aCard = this.props.cards[aDbfId];
		const bCard = this.props.cards[bDbfId];
		if (typeof aCard === "undefined" || typeof bCard === "undefined") {
			return typeof aCard === "undefined" ? 1 : -1;
		}
		if (aCard.cost === bCard.cost) {
			if (aCard.name === bCard.name) {
				return 0;
			}
			return (aCard.name || "") > (bCard.name || "") ? 1 : -1;
		}
		return +(aCard.cost || 0) > +(bCard.cost || 0) ? 1 : -1;
	}
}
