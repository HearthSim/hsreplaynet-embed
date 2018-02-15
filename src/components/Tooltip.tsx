import React from "react";

interface Props extends React.ClassAttributes<Tooltip> {
	attachTo: HTMLElement;
}

export default class Tooltip extends React.Component<Props> {
	public render(): React.ReactNode {
		const { top, left, height, width } = this.props.attachTo.getBoundingClientRect();

		const childWidth = 256;
		const childHeight = 382;

		const asPx = (s: string | number) => `${s}px`;

		let blocking = false;

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
