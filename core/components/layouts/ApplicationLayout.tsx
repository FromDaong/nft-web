import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";

export default function ApplicationLayout({children}: ComponentBasicProps) {
	return <Container className="flex flex-col flex-1">{children}</Container>;
}
