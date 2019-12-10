import React from "react";

interface Props {
	attachTo: HTMLElement;
	initialPosition?: { clientX: number; clientY: number };
	touched?: boolean;
}

export default class Tooltip extends React.Component<Props> {
	public render(): React.ReactNode {
		const { attachTo, initialPosition, touched } = this.props;

		const childWidth = Math.min(256, window.innerWidth);
		const childHeight = 382 * (childWidth / 256);

		let boundingRect: ClientRect | null = null;

		// If getClientRects is available, attempt using that first:
		// Multiple client rects could exist if the target is a link that breaks
		// across multiple lines. This way we can show the cursor directly next
		// to the line we're actually interacting with.
		if (initialPosition && typeof attachTo.getClientRects === "function") {
			const { clientX: initialX, clientY: initialY } = initialPosition;
			const rects = attachTo.getClientRects();
			for (const i in rects) {
				if (!rects.hasOwnProperty(i)) {
					continue;
				}
				const rect = rects[i];
				const xMatch =
					initialX >= rect.left && initialX <= rect.left + rect.width;
				const yMatch =
					initialY >= rect.top && initialY <= rect.top + rect.height;
				if (xMatch && yMatch) {
					boundingRect = rect;
					break;
				}
			}
		}

		if (boundingRect === null) {
			boundingRect = this.props.attachTo.getBoundingClientRect();
		}

		const { top, left, height, width } = boundingRect;
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
