const FlexSearch = require("flexsearch");

interface SearchManager {
	items: Array<any>;
	index: typeof FlexSearch;

	hydrate(): void;
	search(term: string): Promise<Array<any>>;
}

export class NFTSearchManager implements SearchManager {
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

export class PeopleSearchManager implements SearchManager {
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
			const content = `${item._id} ${item.display_name} ${item.address} ${item.bio} ${item.username}`;
			const key = item._id;
			this.index.add(key, content);
		});
	}

	async search(term: string): Promise<Array<string>> {
		if (!term) return this.items.map((item) => item.id);
		const resultIds = await this.index.search({
			query: term,
			suggest: false, // When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.
		});

		return resultIds as Array<string>;
	}
}

export class CollectionSearchManager implements SearchManager {
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
			if (!item.creator) return console.log("no creator");
			const content = `${item._id} ${item.name} ${item.creator.username} ${item.creator.display_name}`;
			const key = item._id;
			this.index.add(key, content);
		});
	}

	async search(term: string): Promise<Array<string>> {
		if (!term) return this.items.map((item) => item.id);
		const resultIds = await this.index.search({
			query: term,
			suggest: false, // When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.
		});

		return resultIds as Array<string>;
	}
}
