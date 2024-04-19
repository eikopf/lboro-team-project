-- this script creates 3 tables in the current database, which roughly
-- correspond to the tables given in the coursework outline

-- refer to https://dev.mysql.com/doc/refman/8.3/en/create-table.html#create-table-options for
-- more details, but broadly speaking MyISAM is the "almost always read" table setting, and
-- has been used for this reason

create table users (
  id int not null auto_increment,
  email varchar(20) not null,
  name varchar(20) not null,

  -- !!!!! THIS IS A TERRIBLE IDEA IN REAL CODE !!!!!
  password varchar(20) not null,
  -- !!!!! SERIOUSLY, DON'T EVER STORE PASSWORDS IN PLAINTEXT !!!!!

  address varchar(20) not null,
  postcode varchar(20) not null,
  -- a rating is a number from 0 to 100 (inclusive)
  rating tinyint(1) unsigned not null default 0 check (rating <= 100),
  primary key (id)
) engine = MyISAM;

create table items (
  id int not null auto_increment,
  owner int(20) not null,
  title varchar(40) not null,
  category varchar(40) not null,
  description longtext not null,
  price decimal(6, 2) not null,
  postage varchar(40) not null,
  start timestamp not null default current_timestamp on update current_timestamp,
  finish timestamp not null default 0,
  primary key (id),
  -- an item must always be owned by a user
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
