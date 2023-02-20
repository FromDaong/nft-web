import {GraphQLClient} from "graphql-request";
import {ResponsiveImageType} from "react-datocms";

export function request({query, variables, preview}: any) {
	const endpoint = preview
		? `https://graphql.datocms.com/preview`
		: `https://graphql.datocms.com/`;
	const client = new GraphQLClient(endpoint, {
		headers: {
			authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
		},
	});
	return client.request(query, variables);
}

export interface IMagazineProps {
    cover: {
        responsiveImage: ResponsiveImageType;
    };
    title: string;
    publishDate: string | number | Date;
    description: any;
    href: string;
}

export interface IFeatureProps {
	id: string;
	cover: {
		responsiveImage: ResponsiveImageType;
	};
	displayName: string;
	href: string;
	caption?: string;
}
