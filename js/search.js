/**
 * The script invoked when making search requests to the server.
 *
 */
const search_script = "../php/search.php";

/**
 * Returns a list of items matching the given `query`, possibly modified by some `options`.
 *
 * @param {string} query - The query string, matched against titles and descriptions.
 * @param {object} [options] - A table of options.
 * @param {string} [options.start_date] - The beginning of the date range for matching items.
 * @param {string} [options.end_date] - The end of the date range for matching items.
 * @param {number} [options.min_rating] - The minimum rating for matching items.
 * @param {number} [options.max_rating] - The maximum rating for matching items.
 * @param {number} [options.min_price] - The minimum price for matching items.
 * @param {number} [options.max_price] - The maximum price for matching items.
 * @param {string[]} [options.categories] - The set of categories to include.
 * @returns {object[]}
 */
const search_items = async (query, options = {}) => {
  // fill in default values, relying on the fact that null is falsey
  let query_context = {
    query: query || "",
    start_date: new Date(options.start_date || 0),
    end_date: new Date(options.end_date || Number.MAX_SAFE_INTEGER),
    min_rating: options.min_rating || 0,
    max_rating: options.max_rating || 100,
    min_price: options.min_price || 0,
    max_price: options.max_price || Number.MAX_SAFE_INTEGER,
  };

  // construct a POST request with the attached context
  return fetch(search_script, {
    body: JSON.stringify(query_context),
    method: "POST",
  }).then(async (response) => {
    // if the server returns an error, then throw an error
    if (!response.ok) {
      throw new Error(`Server responded ${response.status}`);
    }

    // otherwise extract the content of the response (as a promise)
    return response.text().then(JSON.parse);
  });
};

/**
 * Converts the given `item` into an HTML element.
 *
 * @param {object} item - The item to be rendered.
 * @param {string} item.title - The title of the item.
 * @param {string[]} item.categories - The categories that the item is in.
 * @param {string} item.description - The longform description of the item.
 * @param {number} item.price - The price of the item.
 * @param {number} item.postage - The postage fee for the item.
 * @param {string} item.start - A datestring corresponding to the start of the auction period for the item.
 * @param {string} item.finish - A datestring corresponding to the end of the auction period for the item.
 * @returns {HTMLElement}
 */
const render_item = (item) => {
  let item_root = document.createElement("div");
  item_root.appendChild(document.createTextNode(item.title));
  return item_root;
};
