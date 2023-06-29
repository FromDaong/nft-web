import {IMagazineProps, request} from "@lib/datocms";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Image from "next/image";

const Gallery = ({magazines}: {magazines: Array<IMagazineProps>}) => {
	return (
		<Container className="gap-8 md:gap-12 pink-bg w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{magazines.map((totm) => (
				<Container
					key={totm.href}
					className="relative aspect-[2/3] overflow-auto"
				>
					<a
						href={totm.href}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							layout={"fill"}
							alt={totm.description}
							className="p-2 object-cover rounded-xl shadow-xl"
							src={totm.cover.responsiveImage.src}
						/>
					</a>
				</Container>
			))}
		</Container>
	);
};

const Totm = (props: {allMagazines: Array<IMagazineProps>}) => {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead
					title={"Treat Magazine"}
					description={
						"A curated publication by Treat DAO featuring one creator each month"
					}
				/>
				<Container className="max-w-4xl p-4 mx-auto lg:p-0">
					<Container className="flex items-center text-center flex-col max-w-xl gap-4 py-16 md:py-24 xl:py-32 mx-auto ">
						<Heading className="text-5xl font-medium text-slate-900">
							Treat Magazines
						</Heading>
						<p>
							A curated publication by Treat DAO featuring one creator each
							month
						</p>
						<a
							href="https://opensea.io/collection/treatofthemonth"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button className="bg-primary text-white">
								<b>{"Visit the Ethereum Collection"}</b>
							</Button>
						</a>
					</Container>
				</Container>

				<Container className="p-4 xl:p-0">
					<Gallery magazines={props.allMagazines} />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
};

const MAGAZINES_QUERY = `{
  allMagazines {
    id
    title
    publishDate
    href
    cover {
      responsiveImage {
        srcSet
        webpSrcSet
        sizes
        src
        width
        height
        aspectRatio
        alt
        title
      }
    }
  }
}`;

export async function getServerSideProps() {
	const data = await request({
		query: MAGAZINES_QUERY,
	});
	return {
		props: {allMagazines: data.allMagazines},
	};
}

export default Totm;
