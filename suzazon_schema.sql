CREATE database suzazon;

USE suzazon;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Aqua Lily Pad", "Outdoors", 799.00, 40),
("Heated Gloves", "Outdoors", 139.00, 10),
("Electronic Scooter", "Electronics", 599.00, 80),
("Electric Blanket", "Home", 49.00, 15),
("Nordica 2019 Skis", "Downhill Skiing", 925.00, 10),
("Rainbow Ski Suit", "Downhill Skiing", 170.00, 2),
("Women's Ninja Suit", "Outdoors", 109.00, 20),
("Hotronic FootWarmer", "Outdoors", 184.00, 40),
("Cottoncandy Machine", "Kitchen", 655.00, 20),
("Oakley Snowgoggles", "Downhill Skiing", 159.60, 10);

SELECT * FROM products;