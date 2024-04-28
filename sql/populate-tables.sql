-- INFO: a simple script to add some testing data to the database tables

insert into
users (email, name, password, address, postcode, rating) 
values
("alice@example.com", "Alice", "alpha1", "Loughborough University", "LE11 3TU", 80),
("bob@example.com", "Bob", "beta2", "Loughborough University", "LE11 3TU", 75),
("charlie@example.com", "Charlie", "gamma3", "Loughborough University", "LE11 3TU", 46),
("daniel@example.com", "Daniel", "delta4", "Loughborough University", "LE11 3TU", 63);

insert into
items (owner, title, categories, description, price, postage, start, finish)
values
(
  1, 
  "Crafting Interpreters", 
  'books', 
  "A book about interpreters.", 
  30.4, 
  4.0, 
  "2023-02-17 12:00:00", 
  "2024-10-01 12:00:00"
), 
(
  2,
  "The Shining",
  'media',
  "Probably a film.",
  12.6,
  2.1,
  "2024-03-03 12:30:00",
  "2025-01-01 12:30:00"
);
