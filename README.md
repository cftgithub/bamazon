# bamazon

**Overview**

A CLI App (Command Line Application) which resembles an online storefront.

**MVP**

*Customer View:*
* A product list is displayed with the following information:
    1. item-id
    1. product name
    1. department name
    1. price
    1. quantity available

* The app will prompt the user to:
    1. Select the ID of the product they would like to purchase or an option to "Quit" and exit the app if the user decides not to continue.
    1. If an item was selected, the user will be asked to enter the quantity of the item they would like to purchase.

* The app will validate the request and inform the user whether the purchase was successful or invalid. If the request is valid, user will be informed the the item and quantity requested is being added to their order.

* After each valid request, user will be asked if they would like to "Keep shopping" or "Checkout":
    * Keep shopping: A new product list with updated inventory will be displayed allowing the user to continue with shopping.
    * Checkout: The order placed by the user will be displayed to include product name, quantity requested and a total price for the order.

**How it works:**

1. Enter "node" + file name in the terminal/console.
1. Product list will display as a table if you are successfully connected to the database.
![Image of ](images/display.JPG)
    * A database is utilized to store data for the product table and updated after each valid request.

1. You will be prompted to select an item to purchase or to quit.
1. After an item number is selected, you will be prompted to enter the quantity you would like to purchase. If the request is successful, you will see a message to verify your purchase.
![Image of ](images/order.JPG)
    * Requests are validated based on whether the item requested is a valid ID number and the quantity requested is available.

1. Choosing to "Keep shopping" will display a new product list with updated inventory.
![Image of ](images/newDisplay.JPG)

1. Choosing to "Checkout" will display your order, the total for your order, and exits the app.
![Image of ](images/checkout.JPG)

**Additional Features**

*Quit Option:*

You have the option to quit instead of selecting an item to purchase. The order list will still be displayed.

Image of quitting without placing an order:
![Image of ](images/quit.JPG)

Image of quitting after order was placed:
![Image of ](images/quit2.JPG)

*Validation*

If you type in the name of the item instead of the ID number, or the ID number is not on the product table, you will be informed that your entry is not valid and prompted to re-enter the ID number.
![Image of ](images/entry.JPG)

Quantities need to be entered as a numeric value to proceed. If quantity entered is "0" or higher than the inventory, the user will be notified that the quantity entered is not valid and be returned to make a new selection or to quit.
![Image of ](images/quantity.JPG)

**Link to Github:**

[Bamazon](https:https://github.com/cftgithub/bamazon)

**Technologies Used**

* Javscript
* Node.js
* MySQL Workbench
* Wampserver

**NPM Packages Used**
* Inquirer
* Mysql
* Cli-table

**Future Developments**
* Manager View:

    * Feature includes:
        * Ability to view Product List
        * Ability to view Low Inventory List (inventory count less than 5)
        * Ability to add inventory
        * Ability to add new product

* Supervisor View:
    * Feature includes:
        * Ability to view product sales by department to include overhead costs and total profit
        * Ability to create new department