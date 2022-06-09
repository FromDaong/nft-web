export default async function navigateToPage(previous: any, numPages: number) {
  console.log({ previous });
  // Define results for the remaining pages
  const result = previous.result || [];

  // Always keep the latest response around
  let response = previous;

  // Loop through the remaining pages
  for (let i = 0; i < numPages; i++) {
    // Get the next page
    response = await response.next(); //Best Practice: Always use next() to get the next page

    // Exit if we are on the last page already
    if (response.result.length == 0) break;

    // Add the results to the previous results
    result.push(...response.result);
  }

  // Apply the results to the last page
  response.result = result;

  // Return the response
  return response;
}
