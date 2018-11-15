var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "suzazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

function startPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Suzazon! Would you like to view my store inventory?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Visit us again Soon!");
        }
    });
}

function inventory() {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    function listInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

              table.push(
                  [itemId, productName, departmentName, price, stockQuantity]
            );
          }
            console.log("");
            console.log("====================================================== Current Suzazon Inventory ======================================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            continuePrompt();
        });
    }
}

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("*****************Come back again Soon!***********************");
        }
    });
}

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many would you like to purchase?",

        }
    ]).then(function(userPurchase) {

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("================================================================");
                    console.log("Item out of stock. You will have to pay double for this on eBay.");
                    console.log("================================================================");
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("========================================================");
                    console.log("It's your lucky day! We are able to complete your order.");
                    console.log("========================================================");
                    console.log("You have selected:");
                    console.log("--------------------------------------------------------");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: $" + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("--------------------------------------------------------");
                    console.log("Total: $" + res[i].price * userPurchase.inputNumber);
                    console.log("========================================================");

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("=============================================================");
            console.log("Transaction completed. Isn't it fun to shop in a console app?");
            console.log("=============================================================");
            startPrompt();
        } else {
            console.log("=============================================================");
            console.log("*****************Come back again Soon!***********************");
            console.log("=============================================================");
            startPrompt();
        }
    });
}