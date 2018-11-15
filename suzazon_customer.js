var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var emojis = require('emojis');
var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });


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
        message: "Welcome to Suzazon! Feel free to buy me any of these items for ".green + emojis.unicode(' :santa: ') +
        " Christmas!".green + emojis.unicode(' :christmas_tree: ') +  "                 Would you like to view my store inventory?".red,
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log(emojis.unicode(':blush:   Visit us again soon! :blush: '));
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
            console.log("======================================================".rainbow + "Current Suzazon Inventory".cyan + "======================================================".rainbow);
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
        message: "Would you like to purchase an item? ".green + emojis.unicode("  :money_with_wings:  ") + emojis.unicode("  :money_with_wings:  ") + emojis.unicode("  :money_with_wings:  "),
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log(emojis.unicode(':blush:   Visit us again soon! :blush: '));
        }
    });
}

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase: ".cyan + emojis.unicode(" :gift: "),
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many would you like to purchase?".magenta + emojis.unicode(" :package: "),

        }
    ]).then(function(userPurchase) {

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("================================================================".rainbow);
                    console.log(emojis.unicode(" :sob: ") + "Item out of stock. You will have to pay double for this on eBay".cyan + emojis.unicode(" :sob: "));
                    console.log("================================================================".rainbow);
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("================================================================".rainbow);
                    console.log("");
                    console.log(emojis.unicode(" :grinning: ") + " It's your lucky day! We are able to complete your order!".cyan + emojis.unicode(" :grinning: "));
                    console.log("");
                    console.log("=================================================================".rainbow);
                    console.log("");
                    console.log("You have selected: ".green);
                    console.log("");
                    console.log("-----------------------------------------------------------------".rainbow);
                    console.log("");
                    console.log("Item: ".warn + emojis.unicode(" :gift: ") + res[i].product_name);
                    console.log("");
                    console.log("Department: ".debug +emojis.unicode(" :convenience_store: ")+ " " + res[i].department_name);
                    console.log("");
                    console.log(emojis.unicode(" :dollar: ") + " Price:".magenta + "$" + res[i].price);
                    console.log("");
                    console.log(emojis.unicode(" :1234: ") + " Quantity: ".cyan + userPurchase.inputNumber);
                    console.log("");
                    console.log("-----------------------------------------------------------------".rainbow);
                    console.log("");
                    console.log(emojis.unicode(" :astonished: ") + " Total:".yellow + "$" + res[i].price * userPurchase.inputNumber);
                    console.log("");
                    console.log("=================================================================".rainbow);

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
        message: "Are you sure you would like to purchase this item and quantity?".teal,
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("=================================================================".rainbow);
            console.log("");
            console.log(emojis.unicode(" :see_no_evil: ") + " Transaction completed. ".cyan + emojis.unicode(" :see_no_evil: "));
            console.log("");
            console.log("=================================================================".rainbow);
            startPrompt();
        } else {
            console.log("=================================================================".rainbow);
            console.log("");
            console.log(emojis.unicode(" :computer: ") + emojis.unicode(" :laughing:  ")+ "Isn't it fun to shop in the console?!".cyan + emojis.unicode(" :laughing: ") + emojis.unicode(" :computer: "));
            console.log("");
            console.log("=================================================================".rainbow);
            startPrompt();
        }
    });
}