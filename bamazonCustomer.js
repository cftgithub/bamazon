var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var keys= require('./keys.js');
console.log(keys);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.pass,
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    // insertRecord();
    console.log("Connected as id: " + connection.threadId); // Checks connection
    sales();
    // start();
    // connection.end();
});

// var start = function () {
//     inquirer.prompt([
//         {
//             message: "Please enter your username.",
//             name: "username",
//             type: "input"
//         }        
//     ])
//         .then(function () {
//             console.log("Hello, here's a list of products available for purchase.");
//             console.log("----------------------------------------");
//             listProducts();
//         })
// }

var sales = function () {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            inquirer.prompt({
                name: "choice",
                type: "list",
                choices: function () {
                    var itemsArray = [];
                    for (var i = 0; i < res.length; i++) {
                        // itemsArray.push("Item ID: " + res[i].item_id + " " + res[i].product_name + " " + res[i].price + res[i].stock_quantity);
                        itemsArray.push(res[i].product_name);
                    }
                    return itemsArray;
                },
                message: "What item would you like to purchase?"
            }).then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        var itemChosen = res[i];
                        inquirer.prompt({
                            name: "quantity",
                            type: "input",
                            message: "How many items would you like to purchase?",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }).then(function (answer) {
                            if (itemChosen.stock_quantity > parseInt(answer.quantity)) {
                                console.log("Your order is being processed!");
                                console.log(itemChosen.stock_quantity);
                                console.log(answer.quantity);
                                var newQuantity = itemChosen.stock_quantity - answer.quantity;
                                console.log(newQuantity);
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [
                                        {
                                            stock_quantity: newQuantity
                                        },
                                        {
                                            item_id: itemChosen.id
                                        }
                                    ],
                                    );
                            } else {
                                console.log("The quantity you requested is not available...please specify a different amount");
                                // sales();
                            }
                        })
                    }
                }
            })
        })
}
// function updateQuantity() {
//     console.log("Updating...");
//     connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [
//             {
//                 stock_quantity: 70
//             },
//             {
//                 item_id: 1
//             }
//         ],
//         function (err, res) {
//             if (err) throw err;
//             console.log(res);
//         }
//     );
// }
// updateQuantity();