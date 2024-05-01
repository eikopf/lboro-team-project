/**
 * The path to the credential-verifying script relative to `login.html`.
 *
 */
const credential_script = "../php/check-credentials.php";

/**
 * Checks the given user credentials against the database.
 *
 * @param {string} email - The given user email
 * @param {string} password - The given user password
 * @returns {Promise<boolean>}
 */
const check_credentials = (email, password) =>
  fetch(credential_script, {
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
