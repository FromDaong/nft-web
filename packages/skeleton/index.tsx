import {SkeletonRow} from "./types";

const recursiveRender = (row) => {
	return (
		<div
			key={row}
			style={{
				height: `${row.height ? `${row.height * 21}px` : "auto"}`,
				display: "grid",
				gridTemplateColumns: `repeat(${row.repeat ?? 4}, minmax(0, 1fr))`,
				padding: "4px 0",
			}}
		>
			{row.columns.map((col, i) => (
				<div
					key={i}
					style={{
						height: "calc(100% -8px)px",
						gridColumn: `${col.start} / span ${col.length}`,
						backgroundColor:
							col.type === "circle" ||
							col.type === "square" ||
							col.type === "gutter" ||
							col.rows
								? "transparent"
								: "#f1f1f1",
						borderRadius: `${col.radius}px`,
						gap: "6px",
					}}
				>
					{col.rows && col.rows.map(recursiveRender)}
					{(col.type === "circle" || col.type === "square") && (
						<div
							style={{
								height: `${
									row.height ? `${row.height * 21}px` : `${col.size}px`
								}`,
								width: `${
									row.height ? `${row.height * 21}px` : `${col.size}px`
								}`,
								backgroundColor: "#f1f1f1",
								borderRadius: `${col.radius}px`,
							}}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default function DynamicSkeleton(props: {config: Array<SkeletonRow>}) {
	return (
		<div
			style={{
				display: "flex",
				gap: "8px",
				flexDirection: "column",
				width: "100%",
			}}
		>
			{props.config.map((row) => recursiveRender(row))}
		</div>
	);
}
