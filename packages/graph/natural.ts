import {TfIdf, PorterStemmer, WordTokenizer} from "natural";
import {cosineSimilarity} from "./cosine-similarity";
const tokenizer = new WordTokenizer();

export async function calculateBioSimilarity(
	user1: any,
	user2: any
): Promise<number> {
	const tfidf = new TfIdf();

	const tBio1 = tokenizer
		.tokenize(user1.bio)
		.map((term) => PorterStemmer.stem(term));

	const tBio2 = tokenizer
		.tokenize(user2.bio)
		.map((term) => PorterStemmer.stem(term));

	// Add the bios to the tf-idf (bug fix: add the bios to the tf-idf)
	tfidf.addDocument(tBio1, "user1");
	tfidf.addDocument(tBio2, "user2");

	// Calculate the cosine similarity between the two bios

	return cosineSimilarity(tfidf.listTerms(0), tfidf.listTerms(1));
}
