/*
    Takes an array and a Component to in a grid defined by tailwind classes
    grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4

    Uses react-virtualized to render the grid
*/

import {Container} from "@packages/shared/components/Container";
import {Grid, InfiniteLoader, AutoSizer} from "react-window";
import {useEffect, useState} from "react";

export const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleResize = () => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			};

			window.addEventListener("resize", handleResize);

			handleResize();

			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	return windowSize;
};

export const VirtualizedGrid = ({
	data,
	Component,
	fetchMore,
}: {
	data: any[];
	Component: any;
	fetchMore: () => void;
}) => {
	const [columns, setColumns] = useState(1);
	const {width} = useWindowSize();

	const loadMoredata = (startIndex, stopIndex) => {
		// Load more data here and append them to the existing list
	};

	const isRowLoaded = ({index}) => {
		return !!data[index];
	};

	const rowRenderer = ({index, key, style}) => {
		const item = data[index];
		return (
			<Container
				key={key}
				style={style}
				className="p-2"
			>
				{item && <Component {...item} />}
			</Container>
		);
	};

	useEffect(() => {
		if (width < 640) {
			setColumns(1);
		} else if (width < 768) {
			setColumns(2);
		} else if (width < 1024) {
			setColumns(3);
		} else {
			setColumns(4);
		}
	}, [width]);

	return (
		<AutoSizer className="px-auto">
			{({height, width}) => (
				<InfiniteLoader
					isRowLoaded={isRowLoaded}
					loadMoreRows={loadMoredata}
					rowCount={data.length + 1}
				>
					{({onRowsRendered, registerChild}) => (
						<Grid
							ref={registerChild}
							className="mx-auto"
							width={width}
							height={height}
							rowHeight={420}
							rowCount={data.length}
							columnCount={columns} // Set the number of columns based on screen size
							columnWidth={width / 4}
							onSectionRendered={onRowsRendered}
							cellRenderer={rowRenderer}
						/>
					)}
				</InfiniteLoader>
			)}
		</AutoSizer>
	);
};
