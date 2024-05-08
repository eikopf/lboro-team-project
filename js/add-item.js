/**
 * A simple predicate that returns true iff the price is valid.
 * @param {string} price - The candidate price string
 * @returns {boolean}
 */
const validate_price = (price) => {
  let [integral, decimal] = price.split(".").map((x) => Number.parseInt(x, 10));
  return integral >= 0 && decimal >= 0 && decimal < 100;
};

/**
 * Converts the given `file` into a `data:` URL string.
 *
 * @param {File} file - The given file.
 * @returns {string}
 */
const file_to_data_url = (file) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  return reader.result;
};
