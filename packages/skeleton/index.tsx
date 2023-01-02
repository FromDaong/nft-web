import {Container} from "@packages/shared/components/Container";
import {SkeletonRow} from "./types";

const recursiveRender = (row) => {
	return (
		<Container
			key={row}
			css={{
				height: `${row.height ? `${row.height * 21}px` : "auto"}`,
				display: "grid",
				gridTemplateColumns: `repeat(${row.repeat ?? 4}, minmax(0, 1fr))`,
				padding: "4px 0",
			}}
		>
			{row.columns.map((col, i) => (
				<Container
					key={i}
					css={{
						height: "calc(100% -8px)px",
						gridColumn: `${col.start} / span ${col.length}`,
						backgroundColor:
							col.type === "circle" ||
							col.type === "square" ||
							col.type === "gutter" ||
							col.rows
								? "transparent"
								: "$elementOnSurface",
						borderRadius: `${col.radius}px`,
						gap: "6px",
					}}
				>
					{col.rows && col.rows.map(recursiveRender)}
					{(col.type === "circle" || col.type === "square") && (
						<Container
							css={{
								height: `${
									row.height ? `${row.height * 21}px` : `${col.size}px`
								}`,
								width: `${
									row.height ? `${row.height * 21}px` : `${col.size}px`
								}`,
								backgroundColor: "$elementOnSurface",
								borderRadius: `${col.radius}px`,
							}}
						/>
					)}
				</Container>
			))}
		</Container>
	);
};

export default function DynamicSkeleton(props: {config: Array<SkeletonRow>}) {
	return (
		<Container
			style={{
				display: "flex",
				gap: "8px",
				flexDirection: "column",
				width: "100%",
			}}
		>
			{props.config.map((row) => recursiveRender(row))}
		</Container>
	);
}
