-- this script creates 3 tables in the current database, which roughly correspond to the tables given in the coursework outline

-- refer to https://dev.mysql.com/doc/refman/8.3/en/create-table.html#create-table-options for
-- more details, but broadly speaking: MyISAM is the "almost always read" table setting, and
-- has been used as the engine for this reason

-- NOTE:
-- 1. all tables have `id` as their first field and primary key
-- 2. arbitrary text fields are either short (varchar(20)), long (varchar(40)), or unbounded (longtext)
-- 3. foreign keys are explicitly defined with the foreign key directive
-- 4. where possible (e.g. in users.rating) types are strictly constrained

create table users (
  id int not null auto_increment,
  email varchar(20) not null,
  name varchar(20) not null,
  -- passwords are stored in plaintext
  password varchar(20) not null,
  address varchar(40) not null,
  postcode varchar(20) not null,
  -- ratings are bounded from 0 to 100
  -- NOTE: the version of mysql on the servers does not support CHECK constraints
  rating tinyint unsigned not null default 0 check (rating <= 100),
  primary key (id)
) engine = MyISAM;

create table items (
  id int not null auto_increment,
  -- a foreign key referencing the owner's user-id
  owner int not null,
  title varchar(40) not null,
  -- categories are packed into a bitset
  categories set(
    'art',
    'books', 
    'clothes',
    'electronics', 
    'media',
    'music',
    'toys'
  ) not null,
  description text not null,
  price decimal(6, 2) not null,
  postage decimal(6, 2) not null,
  start timestamp not null default current_timestamp on update current_timestamp,
  finish timestamp not null,
  primary key (id),
  foreign key (owner) references users(id)
) engine = MyISAM;

create table images (
  id int not null auto_increment,
  item int not null,
  -- an image is stored as a raw bytestring with at most 2^24 bytes (~16.7 MB)
  data mediumblob not null,
  -- the image format (i.e. mime type) is given as a string
  media_type varchar(40) not null,
  -- the dimensions of the image are given in pixels
  width int unsigned not null,
  height int unsigned not null,
  primary key (id),
  -- images are always associated with an owning item
  foreign key (item) references items(id)
) engine = MyISAM;
