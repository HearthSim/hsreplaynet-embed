import React from "react";

interface Props {
	attachTo: HTMLElement;
	touched?: boolean;
}

export default class Tooltip extends React.Component<Props> {
	public render(): React.ReactNode {
		const childWidth = Math.min(256, window.innerWidth);
		const childHeight = 382 * (childWidth / 256);

		const {
			top,
			left,
			height,
			width,
		} = this.props.attachTo.getBoundingClientRect();
		const asPx = (s: string | number) => `${s}px`;

		if (this.props.touched) {
			let fromTop = top - childHeight;
			fromTop = Math.max(fromTop, 0);

			let fromLeft = left - childWidth / 2 + width / 2;
			fromLeft = Math.max(fromLeft, 0);
			fromLeft = Math.min(fromLeft, window.innerWidth - childWidth);

			return (
				<div
					style={{
						position: "fixed",
						top: asPx(fromTop),
						left: asPx(fromLeft),
						width: "256px",
						maxWidth: window.innerWidth,
						pointerEvents: "none",
						zIndex: 10000,
					}}
				>
					{this.props.children}
				</div>
			);
		} else {
			let fromTop = top - childHeight / 2 + height / 2;
			fromTop = Math.max(fromTop, 0);
			fromTop = Math.min(fromTop, window.innerHeight - childHeight);

			let fromLeft = left + width;
			fromLeft = Math.max(fromLeft, 0);
			fromLeft = Math.min(fromLeft, window.innerWidth - childWidth);

			return (
				<div
					style={{
						position: "fixed",
						top: asPx(fromTop),
						left: asPx(fromLeft),
						width: "256px",
						pointerEvents: "none",
						zIndex: 10000,
					}}
				>
					{this.props.children}
				</div>
			);
		}
	}
}
