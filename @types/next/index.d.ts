declare global {
	declare module "next" {
		interface NextApiRequest {
			session: any;
		}
	}
}
