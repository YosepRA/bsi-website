# BSI Website Documentation

_Note: Specification may change over time._

---

## Dream Concert

### **Orders**

**Data Structure**

```js
{
  _id: String,
  uid: String,
  email: String,
  payeeCode: String,
  ticketAmount: Number,
  bsiPrice: Float,
  totalBSI: Float,
  status: String, // One of ["active", "finished", "closed"]
  statusMessage: String, // The latest feedback of order status.
  timestamp: Date, // In miliseconds.
}
```

Example:

```js
{
  _id: "0",
  uid: "1261623875",
  email: "your_name@mail.com",
  payeeCode: "123",
  ticketAmount: 1,
  bsiPrice: 0.5,
  totalBSI: 10, // Assume price is $5 per ticket.
  status: "active",
  statusMessage: "Confirming order",
  timestamp: 1679286855832
}
```

---

### **Get All Orders**

Get a list of all orders.

**Endpoint**

```
GET /api/v1/dream-concert-event/orders
```

**Request Parameters**

- `page` **Required**  
  Type: `Number`  
  Default: 1  
  Current page incrementation.

**Returns**

A list of orders. Each query will return 25 pieces of data and use pagination feature to access more data.

**Success Response**

```js
{
  status: "ok",
  page: 1,
  length: 25,
  totalDocs: 100,
  data: [
    {
      _id: "0",
      uid: "1261623875",
      email: "your_name@mail.com",
      payeeCode: "123",
      ticketAmount: 1,
      bsiPrice: 0.5,
      totalBSI: 10,
      status: "active",
      statusMessage: "Confirming order",
      timestamp: 1679286855832
    }
    // And more data ...
  ]
}
```

### **Get Order Details**

Get the details of a specific order.

**Endpoint**

```
GET /api/v1/dream-concert-event/orders/:id
```

**Request Parameters**

_No parameter._

**Returns**

The details of a specific order.

**Success Response**

```js
{
  status: "ok",
  message: null,
  data: {
    _id: "0",
    uid: "1261623875",
    email: "your_name@mail.com",
    payeeCode: "123",
    ticketAmount: 1,
    bsiPrice: 0.5,
    totalBSI: 10,
    status: "active",
    statusMessage: "Confirming order",
    timestamp: 1679286855832
  },
}
```

**Error Response**

- Invalid ID.

```js

{
  status: "error",
  message: "Invalid ID."
  data: null,
}
```

### **Create New Order**

Create a new ticket order.

**Endpoint**

```
POST /api/v1/dream-concert-event/orders
```

**Request Parameters**

_No parameter._

**Request Body**

Type: JSON

- `uid` **Required**  
  Type: `String`  
  Default: ""  
  Customer's Digifinex account UID.
- `email` **Required**  
  Type: `String`  
  Default: ""  
  Customer's designated email to send ticket to.
- `ticketAmount` **Required**  
  Type: `Number`  
  Default: null  
  Ticket order amount.
- `bsiPrice` **Required**  
  Type: `Float`  
  Default: null  
  BSI latest price at the time of ordering.
- `totalBSI` **Required**  
  Type: `Float`  
  Default: null  
  Total BSI charge according to ticket amount and BSI price.
- `payeeCode` _Optional_  
  Type: `String`  
  Default: ""  
  Transaction payee code.

**Returns**

Ticket order ID.

**Success Response**

```js
{
  status: "ok",
  data: {
    _id: "123",
  }
}
```
