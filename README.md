git clone d'aquest repositori per descargarte el projecte en local,

cd frontend --> npm install, cd .. , cd backend --> npm install

instalarte el XAMPP: https://www.apachefriends.org/es/download.html

  - obrir el apache i també el mysql --> clicar el boto de admin del mysql --> nou base de dades --> importar --> seleccionar el arxiu sql en la carpeta de db del repositori --> continuar

---------------------------------------------------------------------------

l'organització de les carpetes es molt facil:

  - backend
  - db
  - frontend

---------------------------------------------------------------------------

diagrama E-R:

![image](https://github.com/user-attachments/assets/c191d0e8-263c-40ea-b5ec-de3cb6160991)

---------------------------------------------------------------------------

Procés d'autentificació: l'usuari es registre --> el seu nom (unic, comptant les majuscules i minuscules) i contrasenya (encriptada) es guarda en la taula de users --> quan l'usuari fa login es busca el mateix nom en la taula de users i compara les contrasenyes,
i si es valida et retorna un token i accedeixes en la app.

---------------------------------------------------------------------------

Tots els endpoints:

1. Login/Register Endpoints ( /auth ) --> http://localhost:3000/auth/ ...

  Login
  Ruta (URL): POST /login
  Body Request (JSON) Exemple:
  {
  "username": "exampleUser",
  "password": "examplePassword"
  }
  
  JSON Resposta i Status:
  
  Success (200 OK):
  {
  "id": "user_id_here",
  "token": "jwt_token_here"
  }

  Missing Fields (400 Bad Request):
  {
  "message": "Username and password are required."
  }

  Invalid Credentials (401 Unauthorized):
  {
  "message": "Invalid credentials."
  }

  Database Error (500 Internal Server Error):
  {
  "message": "Database error."
  }
  
  --------------------------------------------------

  Register
  Ruta (URL): POST /register
  Body Request (JSON) Exemple:
  {
  "username": "newUser",
  "password": "newPassword"
  }

  JSON Resposta i Status:

  Success (201 Created):
  {
  "message": "User registered successfully."
  }

  Missing Fields (400 Bad Request):
  {
  "message": "Username and password are required."
  }

  Username Already Exists (409 Conflict):
  {
  "message": "Username already exists."
  }

  Database Error (500 Internal Server Error):
  {
  "message": "Database error."
  }
  
2. Order Endpoints ( /order ) --> http://localhost:3000/order/ ...

  Create a New Order
  Ruta (URL): POST /postOrder
  Body Request (JSON) Exemple:
  {
  "userId": "user_id_here",
  "tradeSide": "buy",
  "tradeType": "market",
  "price": 50000,
  "amount": 100,
  "currency": "usdc"
  }

  JSON Resposta i Status:

  Success (200 OK):
  {
  "message": "Order created successfully",
  "orderId": "order_id_here"
  }

  Missing Required Fields (400 Bad Request):
  {
  "message": "Missing required fields."
  }

  Price Required for Market Orders (400 Bad Request):
  {
  "message": "Price is required for market orders."
  }

  Price Required for Limit Orders (400 Bad Request):
  {
  "message": "Price is required for limit orders."
  }

  Invalid Trade Type (400 Bad Request):
  {
  "message": "Invalid tradeType."
  }

  Database Error (500 Internal Server Error):
  {
  "message": "Database error."
  }

  --------------------------------------------------
  
  Get Active Orders
  Ruta (URL): GET /activeOrders
  Headers: user-id: user_id_here
  Body Request (JSON) Exemple: None (GET request)

  JSON Resposta i Status:

  Success (200 OK):
  [
    {
      "id": "order_id",
      "userId": "user_id",
      "tradeSide": "buy",
      "tradeType": "market",
      "limit_price": null,
      "execution_price": 50000,
      "amount": 100,
      "currency": "usdc",
      "status": "executed"
    }
  ]

  Unauthorized (401 Unauthorized):
  {
  "message": "Unauthorized"
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }
  
  --------------------------------------------------

  Execute a Pending Limit Order
  Ruta (URL): POST /executeOrder
  Body Request (JSON) Exemple:
  {
  "orderId": "order_id_here",
  "currentPrice": 49000
  }
  Headers: user-id: user_id_here
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "message": "Order executed successfully"
  }

  Price Condition Not Met (400 Bad Request):
  {
  "message": "Price condition not met."
  }

  Order Not Found or Not Pending (404 Not Found):
  {
  "message": "Order not found or not pending."
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }

  --------------------------------------------------

  Close an Executed Order
  Ruta (URL): POST /closeOrder
  Body Request (JSON) Exemple:
  {
  "orderId": "order_id_here",
  "currentPrice": 51000
  }
  Headers: user-id: user_id_here
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "message": "Order closed successfully",
  "pnl": 2.0
  }

  Missing Required Fields (400 Bad Request):
  {
  "message": "Missing required fields."
  }

  Executed Order Not Found (404 Not Found):
  {
  "message": "Executed order not found."
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }

  --------------------------------------------------

  Get Order History with Pagination
  Ruta (URL): GET /orderHistory?page=1
  Headers: user-id: user_id_here
  Body Request (JSON) Exemple: None (GET request)
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "orders": [
    {
      "id": "order_id",
      "userId": "user_id",
      "tradeSide": "buy",
      "tradeType": "market",
      "price": 50000,
      "amount": 100,
      "currency": "usdc",
      "created_at": "timestamp_here",
      "closed_at": "timestamp_here",
      "pnl": 2.0
    }
  ],
  "totalPages": 5
  }

  Unauthorized (401 Unauthorized):
  {
  "message": "Unauthorized"
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }

3. Fund Endpoints ( /fund ) --> http://localhost:3000/fund/ ...

  Get User's Balance
  Ruta (URL): GET /balance
  Headers: user-id: user_id_here
  Body Request (JSON) Exemple: None (GET request)
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "balance": 1000.00
  }
  
  Unauthorized (401 Unauthorized):
  {
  "message": "Unauthorized"
  }

  User Funds Not Found (404 Not Found):
  {
  "message": "User funds not found"
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }

  --------------------------------------------------

  Recharge Funds
  Ruta (URL): POST /recharge
  Body Request (JSON) Exemple:
  {
  "amount": 500
  }
  Headers: user-id: user_id_here
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "message": "Funds recharged successfully",
  "newBalance": 1500.00
  }

  Unauthorized (401 Unauthorized):
  {
  "message": "Unauthorized"
  }

  Invalid Amount (400 Bad Request):
  {
  "message": "Invalid amount"
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }
  
  --------------------------------------------------

  Subtract from Funds
  Ruta (URL): POST /subtract
  Body Request (JSON) Exemple:
  {
  "amount": 200
  }
  Headers: user-id: user_id_here
  
  JSON Resposta i Status:

  Success (200 OK):
  {
  "message": "Funds subtracted successfully",
  "newBalance": 1300.00
  }

  Unauthorized (401 Unauthorized):
  {
  "message": "Unauthorized"
  }

  Invalid Amount (400 Bad Request):
  {
  "message": "Invalid amount"
  }

  Insufficient Balance (400 Bad Request):
  {
  "message": "Insufficient balance"
  }

  User Funds Not Found (404 Not Found):
  {
  "message": "User funds not found"
  }

  Server Error (500 Internal Server Error):
  {
  "message": "Server error"
  }
