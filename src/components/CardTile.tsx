import React from "react";
import { createPortal } from "react-dom";
import { CardTile as ComponentCardTile } from "react-hs-components";
import { CardsByDbfId } from "../cards";
import Tooltip from "./Tooltip";
import Card from "./Card";
import { getTooltipContainer } from "../tooltips";

interface Props {
	dbfId: number;
	count: number;
	cards: CardsByDbfId | null;
}

interface State {
	showTooltip: boolean;
}

export default class CardTile extends React.Component<Props, State> {
	private ref: any = null;
	private linkRef: HTMLElement | null = null;

	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			showTooltip: false,
		};
	}

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
			<>
				{this.state.showTooltip && this.linkRef !== null
					? createPortal(
							<Tooltip attachTo={this.linkRef}>
								<Card
									dbfId={this.props.dbfId}
									cards={this.props.cards}
								/>
							</Tooltip>,
							getTooltipContainer()
						)
					: null}
				<a
					href={`https://hsreplay.net/cards/${
						this.props.dbfId
					}/${urlCardName}/`}
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
					ref={ref => (this.linkRef = ref)}
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
			</>
		);
	}

	private mouseEnter = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		this.setState({ showTooltip: true });
	};

	private mouseLeave = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		this.setState({ showTooltip: false });
	};
}
