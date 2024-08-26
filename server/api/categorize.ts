// server/api/categorize.ts
import { categorizeSearch } from '~/composables/openai';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Read the request body
  const searchInput = body.input; // Extract the user's input

  if (!searchInput) {
    return { error: 'No input provided' };
  }

  try {
    const category = await categorizeSearch(searchInput);
    return { category };
  } catch (error) {
    return { error: 'Failed to categorize search' };
  }
});
