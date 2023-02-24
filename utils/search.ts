const FlexSearch = require("flexsearch");

export class SearchManager {
	items: Array<any>;
	index: typeof FlexSearch;

	constructor(items: Array<any>) {
		this.items = items;
		this.index = FlexSearch.Index({
			preset: "memory",
			tokenize: "forward",
			resolution: 5,
		});
	}

	hydrate() {
		this.items.map((item) => {
			const content = `${item.id} ${item.name} ${item.description} ${
				item.creator ? item.creator.username : item.author.username
			} ${item.display_name}`;
			const key = parseInt(item.id);
			this.index.add(key, content);
		});
	}

	async search(term: string): Promise<Array<number>> {
		if (!term) return this.items.map((item) => item.id);
		const resultIds = await this.index.search({
			query: term,
			suggest: false, // When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.
		});

		return resultIds as Array<number>;
	}
}
