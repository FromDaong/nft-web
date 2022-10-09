export interface SearchManager {
  search_endpoints: {
    autocomplete: string;
    fulltext: string;
    quick_search: string;
  };
  quick_search?(text: string): Array<any>;
  autocomplete?(text: string, context: string): Array<any>;
  fulltext_search?(text: string): Array<any>;
}

export class CommandbarSearch implements SearchManager {
  search_endpoints: {
    autocomplete: string;
    fulltext: string;
    quick_search: string;
  };

  constructor(autocomplete: string, fulltext: string, quick_search: string) {
    this.search_endpoints.autocomplete = autocomplete;
    this.search_endpoints.fulltext = fulltext;
    this.search_endpoints.quick_search = quick_search;
  }
  quick_search(text: string): any[] {
    throw new Error("Method not implemented.");
  }
}
