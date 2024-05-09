/**
 * @typedef {import('./search.js').Item} Item
 */

/**
 * The path to the `user.php` script relative to `user.html`.
 */
const user_data_script = "php/user.php";

/**
 * Fetches the information required to render the current user's home page.
 */
const get_user_data = async () =>
  fetch(user_data_script)
    .then((res) => res.text())
    .then(JSON.parse)
    .then((body) => {
      // convert values from strings to the appropriate types
      body.items = body.items.map(parse_item);
      // drop the redundant owner field from the items
      body.items.forEach((item) => delete item.owner);
      // return the updated data
      return body;
    });

/**
 * Renders the given `item` as a `HTMLDivElement`, which can then be attached to the DOM.
 *
 * @param {Item} item - The item to be rendered.
 * @returns {HTMLDivElement}
 */
const render_user_item = (item) => {
  const root = document.createElement("div");
  root.setAttribute("class", "user-item");

  // thumbnail
  const thumbnail = document.createElement("img");
  thumbnail.setAttribute("class", "user-item-thumbnail");
  root.appendChild(thumbnail);

  // main body
  const body = document.createElement("div");
  body.setAttribute("class", "user-item-body");
  root.appendChild(body);

  // item title
  const title = document.createElement("span");
  title.setAttribute("class", "user-item-title");
  title.textContent = item.title;
  body.appendChild(title);

  // inner body
  const inner_body = document.createElement("div");
  inner_body.setAttribute("class", "user-item-inner-body");
  body.appendChild(inner_body);

  // left pane
  const left_pane = document.createElement("div");
  left_pane.setAttribute("class", "user-item-pane left");
  inner_body.appendChild(left_pane);

  // category
  const category = document.createElement("span");
  category.setAttribute("class", "user-item-detail category");
  category.textContent = `Category: ${item.categories[0]}`;
  left_pane.appendChild(category);

  // description
  const description = document.createElement("span");
  description.setAttribute("class", "user-item-detail description");
  description.textContent = `Description: ${item.description}`;
  left_pane.appendChild(description);

  // right pane
  const right_pane = document.createElement("div");
  right_pane.setAttribute("class", "user-item-pane right");
  inner_body.appendChild(right_pane);

  // price
  const price = document.createElement("span");
  price.setAttribute("class", "user-item-detail price");
  price.textContent = `Price: £${item.price.toFixed(2)}`;
  right_pane.appendChild(price);

  // postage
  const postage = document.createElement("span");
  postage.setAttribute("class", "user-item-detail postage");
  postage.textContent = `Postage: £${item.postage.toFixed(2)}`;
  right_pane.appendChild(postage);

  // start date
  const start_date = document.createElement("span");
  start_date.setAttribute("class", "user-item-detail start-date");
  start_date.textContent = `Start: ${new Date(item.start).toLocaleDateString()}`;
  right_pane.appendChild(start_date);

  // end date
  const end_date = document.createElement("span");
  end_date.setAttribute("class", "user-item-detail end-date");
  end_date.textContent = `End: ${new Date(item.finish).toLocaleDateString()}`;
  right_pane.appendChild(end_date);

  return root;
};
