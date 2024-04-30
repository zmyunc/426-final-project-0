This is a simple supermarket management system
1. On the very first page there is a login to authenticate your information.
Once the user is logged in it will be in persistent-session state. Refreshing the page and closing the page does not cause the current page to be lost, nor does it cause the information to be lost.
If the user is not logged in, the user cannot access other pages of the site by typing the url.
For example, if we want to go to localhost3000:/ without logging in,
the user will be forced to go back to localhost3000:/login.

2. Basic Management System Menu
1) View current store page
2) Goods management
3）Employee Management
4) Logout

*Except for viewing the current store page, users will see a current weather information of Chapel Hill at the bottom of the page.

Extension 1) View current store page
There are basic shopping functions here
Guests can add items to their shopping cart by clicking the add/remove button

About the shopping cart:
All items added to the cart are displayed to the guest
The price and quantity of the items are displayed to the customer.
Guests can add, delete, and completely remove items from their shopping cart.

The shopping cart calculates the price of all items.
At the end of the cart there is a check out button to finalize the customer's order.
Once the order is confirmed, the cart will be emptied.

Extension 2) For more information about goods management:
Includes the following three functions
-Add item
The user must enter the name, price, and picture of the item.
Price must be greater than 0 or an error will be reported
-Update item
The user must enter the ID, name, and price of the item.
ID must be greater than 0 and an existing ID or an error will be reported.
Price must be greater than 0 or an error will be reported
-Delete item
The user only needs to enter the ID to delete the item.
ID must be an existing ID or an error will be reported.

Extension 3) More information about employee management:
-Add Employee
User has to enter the first and last name of the employee
-Update Employee
The user must enter the employee's ID, first name, and last name.
ID must be greater than 0 and ID must be an already existing ID Otherwise an error will be reported.
-Delete Employee
The user only needs to enter the ID to delete the employee.
The ID must be an existing ID or an error will be reported.
