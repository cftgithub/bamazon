var mysql = require("mysql");
var inquirer = require('inquirer');
var keys = require('./keys.js');
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.pass,
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId); // Checks connection
    showProducts();
});

var showProducts = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Inventory'],
            colWidths: [10, 30, 30, 20, 20]
        });
        console.log("\n" + "---------- Product List ----------")
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        salesPrompt(res);
    })
}

var itemPurchased = [];
var itemQuantity = [];
var price = 0;

var salesPrompt = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Select the Item ID # you would like to purchase or "Q" to Quit'
    }]).then(function (answer) {
        var correct = false;
        if (answer.choice.toUpperCase() == "Q") {
            process.exit();
        }
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.choice) {
                correct = true;
                // var productSold = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to purchase?',
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            console.log("\n" + "Please enter a numeric value.\n");
                            return false;
                        }
                    }
                }).then(function (answer) {
                    if (res[id].stock_quantity > parseInt(answer.quantity) && parseInt(answer.quantity) > 0) {
                        var newQuantity = res[id].stock_quantity - answer.quantity;
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: res[id].item_id
                                }
                            ],
                        );
                        itemPurchased.push(res[id].product_name);
                        itemQuantity.push(answer.quantity);
                        var total = (res[id].price * answer.quantity);
                        price = price + total;
                        console.log("Adding the following item(s) to your order:\n " + answer.quantity + " " + res[id].product_name + "(s)\n");
                        inquirer.prompt({
                            type: 'list',
                            name: 'next',
                            message: 'What would you like to do next?',
                            choices: ["Keep shopping", "Checkout"]
                        }).then(function (response) {
                            if (response.next == "Keep shopping") {
                                showProducts(res);
                            } else if (response.next == "Checkout") {
                                checkout();
                            }
                        })
                    } else {
                        console.log("The quantity you selected is not valid.\n");
                        salesPrompt(res);
                    }
                })
            }
        }
        if (i == res.length && correct == false) {
            console.log("Entry is not valid!\n");
            salesPrompt(res);
        }
    })
}

var checkout = function () {
    var orderPlaced = new Table({
        head: ['Product Name', 'Quantity'],
        colWidths: [30, 30]
    });
    console.log("\n" + "---------- Your Order ----------")

    for (var i = 0; i < itemPurchased.length; i++) {
        orderPlaced.push([itemPurchased[i], itemQuantity[i]]);
    }
    console.log(orderPlaced.toString());
    console.log("Your order total is: $" + price + "\nThank you for your business!");
    process.exit();
}
