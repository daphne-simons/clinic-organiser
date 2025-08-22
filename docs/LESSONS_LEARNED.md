# Lessons Learned

A place to document problems we've encountered, and lessons learned. 

## Preventing SQL Injection 

A parameterized UPDATE statement in PostgreSQL enhances security by preventing SQL injection and improves readability by separating the SQL query from its values.
Here is an example of a PostgreSQL UPDATE statement with SET and WHERE clauses, using parameterized values:

```sql
UPDATE employees
SET
    first_name = $1,
    last_name = $2,
    email = $3
WHERE
    employee_id = $4;
``` 

In this example:
employees is the table being updated.
first_name, last_name, and email are the columns being modified in the SET clause.
$1, $2, $3, and $4 are placeholders for the parameterized values. The specific values for these placeholders would be provided when executing the query through a programming language's database driver (e.g., Psycopg2 in Python, pg-promise in Node.js).

employee_id = $4 is the WHERE clause, which specifies that only the row where the employee_id matches the value provided for $4 will be updated.


## Testing auth protected routes: 

- we are using jwks from auth0 to validate the access token
- A JSON Web Key Set (JWKS) is a set of keys containing the public keys used to verify any JSON Web Token (JWT) issued by an authorization server and signed using RS256 signing algorithm. These keys are represented in a JSON format.
- For more info about JSON Web Key sets: https://stytch.com/blog/understanding-jwks/

- We use `jwks-rsa` from Auth0 in out `./server/auth.ts` file to retrieve signing keys from a JWKS endpoint, which we can then use to validate the access token.

- We then want to create a mockToken for writing automated tests for our auth protected routes. For more information about mocking tokens
// https://carterbancroft.com/mocking-json-web-tokens-and-auth0/





