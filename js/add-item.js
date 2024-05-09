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
 * @returns {Promise<string>}
 */
const file_to_data_url = (file) =>
  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Converts the given `files` into a list of `data:` URLs.
 *
 * @param {FileList} files - The given list of files.
 */
const file_list_to_data_urls = (files) => {
  let urls = [];

  for (const file of files) {
    urls.push(file_to_data_url(file));
  }

  return Promise.all(urls);
};
