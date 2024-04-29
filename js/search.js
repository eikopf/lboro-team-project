/**
 * An item retrieved from the database
 * @typedef {object} Item
 * @prop {int} id - The item's database id.
 * @prop {string} title - The item's title.
 * @prop {string[]} categories - The set of categories that the item is in.
 * @prop {string} description - The item's longform description.
 * @prop {float} price - The item's price.
 * @prop {float} postage - The postage fee for the item.
 * @prop {Date} start - The start date for the item's auctioning period.
 * @prop {Date} finish - The end date for the item's auctioning period.
 * @prop {object} owner - The item's owner.
 * @prop {int} owner.id - The owner's id.
 * @prop {string} owner.name - The owner's name.
 * @prop {string} owner.email - The owner's email.
 * @prop {int} owner.rating - The owner's rating.
 */

/**
 * The script invoked when making search requests to the server.
 *
 */
const search_script = "../php/search.php";

/**
 * Converts the given table of strings into a properly-typed item.
 *
 * @param {object} raw_item - A string tables.
 * @param {string} raw_item.id - The id of the item.
 * @param {string} raw_item.title - The title of the item.
 * @param {string[] | string} raw_item.categories - The set of categories for the item.
 * @param {string} raw_item.description - The longform description of the item.
 * @param {string} raw_item.price - The price of the item.
 * @param {string} raw_item.postage - The postage fee of the item.
 * @param {string} raw_item.start - The start date for the auctioning period of the item.
 * @param {string} raw_item.end - The end date for the the auctioning period of the item.
 * @param {string} raw_item.owner_id - The id of the item's owner.
 * @param {string} raw_item.owner - The name of the item's owner.
 * @param {string} raw_item.owner_email - The item's owner's email.
 * @param {string} raw_item.owner_rating - The owner's rating on a scale of 0 to 100.
 * @returns {Item}
 */
const parse_item = (raw_item) => {
  return {
    id: Number.parseInt(raw_item.id),
    title: raw_item.title,
    categories: [raw_item.categories].flat(),
    description: raw_item.description,
    price: Number.parseFloat(raw_item.price),
    postage: Number.parseFloat(raw_item.postage),
    start: Date.parse(raw_item.start),
    finish: Date.parse(raw_item.finish),
    owner: {
      id: Number.parseInt(raw_item.owner_id),
      name: raw_item.owner,
      email: raw_item.owner_email,
      rating: Number.parseInt(raw_item.owner_rating),
    },
  };
};

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
 * @returns {Item[]}
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
    return response
      .text()
      .then(JSON.parse)
      .then((items) => items.map(parse_item));
  });
};

/**
 * Converts the given `item` into an HTML element.
 *
 * @param {Item} item - The item to be rendered.
 * @returns {HTMLElement}
 */
const render_item = (item) => {
  console.log(item);
  let item_root = document.createElement("div");
  item_root.appendChild(document.createTextNode(item.title));
  return item_root;
};
