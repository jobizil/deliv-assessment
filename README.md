# deliv-assessment

This is a simple GraphQL Backend API that simulates a user's order placement and order tracking status.

### Running The App
To run this application, you are required to have installed at least `node 19` for this application to function properly.


#### Connect your database
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/food_delivery?schema=public"
```

#### Installation
 ```
  npm run install
 ```

#### Start Server
```
npm run dev

or

npm run start
```


## Task
- Setup
    -   Use Node.js, Prisma to build the backend.
    - Use PostgreSQL for the database Schema Design
    - Create a Prisma schema to define the above entities and their relationships.
- API
    - Create queries to:
        -   Fetch all vendors with their menus.
        -   Fetch all orders placed by a specific user.
    - Create mutations to:
        -  Add a new user, vendor, or menu item.
        -  Place an order.
        -  Update the status of an order.
   - Validation
      -    Ensure input validation (e.g., price should be positive, email must be valid).
  - Best Practices
    -   Modularize the codebase.
    -   Include meaningful error handling.
    - Write at least one test case for a query and mutation.
