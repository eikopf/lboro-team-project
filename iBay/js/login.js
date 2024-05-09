/**
 * The path to the login script relative to `login.html`.
 *
 */
const login_script = "php/login.php";

/**
 * Checks the given user credentials against the database, and logs the
 * user in if they are correct.
 *
 * @param {string} email - The given user email
 * @param {string} password - The given user password
 * @returns {Promise<boolean>}
 */
const try_login = (email, password) =>
  fetch(login_script, {
    body: JSON.stringify({ email: email, password: password }),
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        // error if response was bad
        throw new Error(`Server responded ${response.status}`);
      } else {
        // otherwise extract response body
        return response.text();
      }
    })
    .then(JSON.parse);
