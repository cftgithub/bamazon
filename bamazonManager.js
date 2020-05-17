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
    console.log("Connected as Manager id: " + connection.threadId + "\n"); // Checks connection
    managerPrompt();
});

var managerPrompt = function () {
    inquirer.prompt({
        type: 'list',
        name: 'toDo',
        message: 'What would you like to do?',
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Log-Off"]
    }).then(function (response) {
        if (response.toDo == "View Products for Sale") {
            viewProducts();
        } else if (response.toDo == "View Low Inventory") {
            viewInventory();
        } else if (response.toDo == "Add to Inventory") {
            addInventory();
        } else if (response.toDo == "Add New Product") {
            addNewProduct();
        } else if (response.toDo == "Log-Off") {
            console.log("Good bye!");
            process.exit();
        }

    })
}

var viewProducts = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Inventory'],
            colWidths: [10, 30, 30, 20, 20]
        });
        console.log("---------- Products Available For Sale ----------")
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log();
        managerPrompt();
    })
}

var viewInventory = function () {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Inventory'],
            colWidths: [10, 30, 30, 20, 20]
        });
        console.log("---------- Products with Inventory Count Less Than 5 ----------")
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log();
        managerPrompt();
    })
}

var addInventory = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Inventory'],
            colWidths: [10, 30, 30, 20, 20]
        });
        console.log("---------- Products Available For Sale ----------")
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log();
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'Select the Item ID # you would like to add'
        }]).then(function (answer) {
            var correct = false;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.choice) {
                    correct = true;
                    var id = i;
                    inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'Enter the quantity you are adding',
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                console.log("\n" + "Please enter a numeric value.\n");
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        if (parseInt(answer.quantity) > 0) {
                            var newQuantity = res[id].stock_quantity + parseInt(answer.quantity);
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
                            console.log("\nThe following item has been added to the inventory:\n " + answer.quantity + " " + res[id].product_name + "(s)\n");
                            console.log("New inventory count is: " + newQuantity + "\n");
                            managerPrompt();
                        } else {
                            console.log("The quantity you selected is not valid.\n");
                            managerPrompt();
                        }
                    })
                }
            }
            if (i == res.length && correct == false) {
                console.log("Entry is not valid!\n");
                managerPrompt();
            }
        })
    })
}

var addNewProduct = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product',
            message: 'Enter name of product'
        }, {
            type: 'input',
            name: 'department',
            message: 'Enter department name'
        }, {
            type: 'input',
            name: 'price',
            message: "Enter sales price",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    console.log("\n" + "Please enter a numeric value.\n");
                    return false;
                }
            }
        }, {
            type: 'input',
            name: 'quantity',
            message: 'Enter quantity available',
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    console.log("\n" + "Please enter a numeric value.\n");
                    return false;
                }
            }
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO products SET ?",
            [
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log("You have successfully added a new product.\n")
                managerPrompt();
            }
        );
    })
}