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
 * @param {string} [options.category] - The specified category of items to search in.
 * @param {string} [options.start_date] - The beginning of the date range for matching items.
 * @param {string} [options.end_date] - The end of the date range for matching items.
 * @param {number} [options.min_rating] - The minimum user rating for matching items.
 * @param {number} [options.min_price] - The minimum price for matching items.
 * @param {number} [options.max_price] - The maximum price for matching items.
 * @returns {Item[]}
 */
const search_items = async (query, options = {}) => {
  // fill in default values, relying on the fact that null is falsey
  let query_context = {
    query: query || "",
    category: options.category || "",
    start_date: new Date(options.start_date || 0),
    // the integer literal corresponds to 9999-31-12, the max date in MySQL
    end_date: new Date(options.end_date || 253_402_214_440_000),
    min_rating: options.min_rating || 0,
    min_price: options.min_price || 0,
    max_price: options.max_price || Number.MAX_VALUE,
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
  // root node
  let result = document.createElement("div");
  result.setAttribute("class", "search-result-item");

  // thumbnail node
  let thumbnail = document.createElement("img");
  thumbnail.setAttribute("class", "search-result-item-thumbnail");
  result.appendChild(thumbnail);

  // title node
  let title = document.createElement("h2");
  title.textContent = item.title;
  title.style.fontSize = "17pt";
  title.style.margin = "inherit";
  result.appendChild(title);

  // text node
  let text_element = document.createElement("div");
  text_element.setAttribute("class", "search-result-item-text");

  // description
  let description = document.createElement("i");
  description.textContent =
    item.description.substring(0, 40) +
    (item.description.length > 40 ? "..." : "");
  description.style.fontSize = "10pt";
  description.style.margin = "inherit";
  text_element.appendChild(description);

  // user block
  let user_block = document.createElement("p");
  user_block.textContent = `Published by ${item.owner.name} (${item.owner.email}, rated ${item.owner.rating}%)`;
  user_block.style.fontSize = "7pt";
  user_block.style.margin = "inherit";
  text_element.appendChild(user_block);

  // date information
  let date_info = document.createElement("p");
  //let start = new Date(item.start);
  let finish = new Date(item.finish);
  // convert from miliseconds to days
  let interim_days = Math.floor((finish - Date.now()) / 86_400_000);
  date_info.textContent = `Auction ends ${finish.toDateString()}! (${interim_days} days remaining)`;
  date_info.style.fontSize = "7pt";
  date_info.style.margin = "inherit";
  text_element.appendChild(date_info);

  result.appendChild(text_element);

  // fee information
  let fees = document.createElement("div");
  fees.setAttribute("class", "search-result-item-fees");

  // price
  let price = document.createElement("p");
  price.textContent = `£${item.price.toFixed(2)}`;
  price.style.margin = "inherit";
  fees.appendChild(price);

  // postage
  let postage = document.createElement("p");
  postage.textContent = `(Postage: £${item.postage.toFixed(2)})`;
  postage.style.margin = "inherit";
  postage.style.fontSize = "9pt";
  fees.appendChild(postage);

  result.appendChild(fees);

  return result;
};

/**
 * Converts a `name` describing a sort order into the corresponding comparator.
 *
 * @param {"title-alpha" | "price-asc" | "price-desc" | "ending-soonest" | "user-rating-desc"} name - The name of the sort order.
 * @return {(Item, Item) => number }
 */
const sort_comparator = (name) => {
  switch (name) {
    case "title-alpha":
      return (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    case "price-asc":
      return (a, b) => a.price - b.price;
    case "price-desc":
      return (a, b) => b.price - a.price;
    case "ending-soonest":
      return (a, b) => a.finish - b.finish;
    case "user-rating-asc":
      return (a, b) => a.owner.rating - b.owner.rating;
    case "user-rating-desc":
      return (a, b) => b.owner.rating - a.owner.rating;
    default:
      console.log(
        "Encountered unknown sort ordering; defaulting to alphabetical...",
      );
      return sort_comparator("title-alpha");
  }
};
