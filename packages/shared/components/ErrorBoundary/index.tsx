import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {ReactNode} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "../Button";
import {Container} from "../Container";

const ErrorBoundaryWithRetry = (props: {children: ReactNode}) => {
	return (
		<QueryErrorResetBoundary>
			{({reset}) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({resetErrorBoundary}) => (
						<Container>
							There was an error!
							<Button onClick={() => resetErrorBoundary()}>Try again</Button>
						</Container>
					)}
				>
					{props.children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};

export default ErrorBoundaryWithRetry;
