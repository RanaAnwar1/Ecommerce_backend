# E-commerce Backend API

## Description
A robust backend API built with Node.js/Express.js and MongoDB, following the Model-Controller-Router (MCR) architectural pattern.

## Table of Contents
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Dependencies](#dependencies)
* [API Endpoints](#api-endpoints)
* [Authentication](#authentication)
* [Getting Started](#getting-started)
* [License](#license)

## Features

* **User Authentication**: JWT-based secure authentication system
* **Password Security**: Encryption using bcrypt
* **File Handling**: Image upload capabilities with Multer
* **Cross-Origin Support**: Enabled CORS for seamless frontend integration
* **Modular Architecture**: MCR pattern for maintainable codebase

## Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JSON Web Tokens (JWT)
* **File Upload**: Multer middleware
* **Security**: bcrypt for password hashing

## Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

## API Endpoints

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/getusers` | Retrieve all users | Yes |
| POST | `/createuser` | Create new user | Yes |
| POST | `/login` | User login | No |
| GET | `/getuserdetails` | Get user details | No |
| PUT | `/updateuserprofile` | Update user profile | No |
| DELETE | `/deleteuser` | Delete user | Yes |
| POST | `/registeruser` | Register new user | No |

### User Roles
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/getuserroles` | Get all user roles | Yes |
| POST | `/createuserrole` | Create new role | Yes |
| DELETE | `/deleteuserrole` | Delete role | Yes |
| PUT | `/updateuserrole` | Update role | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/getproducts` | Get all products | No |
| GET | `/getproductdetails` | Get product details | No |
| POST | `/createproduct` | Create product* | Yes |
| PUT | `/updateproduct` | Update product* | Yes |
| DELETE | `/deleteproduct` | Delete product | Yes |

*Supports multiple image upload (max 5 images)

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/viewallorders` | View all orders | Yes |
| GET | `/viewuserorders` | View user orders | Yes |
| POST | `/placeorder` | Place new order | Yes |
| PUT | `/updateorderstatus` | Update order status | Yes |
| DELETE | `/deleteorder` | Delete order | Yes |
| GET | `/vieworderdetails` | Get order details | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/getcategory` | Get categories | No |
| GET | `/getsubcategory` | Get subcategories | No |
| POST | `/createcategory` | Create category* | Yes |
| POST | `/createsubcategory` | Create subcategory | Yes |
| PUT | `/updatecategory` | Update category* | Yes |
| PUT | `/updatesubcategory` | Update subcategory | Yes |
| DELETE | `/deletecategory` | Delete category | Yes |
| DELETE | `/deletesubcategory` | Delete subcategory | Yes |

*Supports single image upload

### Shopping Cart
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/viewcart` | View user cart | Yes |
| GET | `/viewallcarts` | View all carts | Yes |
| DELETE | `/deletecart` | Delete cart | Yes |
| PUT | `/updatecart` | Update cart | Yes |
| DELETE | `/removeproduct` | Remove cart product | Yes |
| GET | `/viewcartdetails` | View cart details | Yes |

### General Content
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/getgeneral` | Get general content | No |
| PUT | `/updategeneral` | Update content | Yes |
| GET | `/getcontact` | Get contact info | Yes |
| POST | `/submitcontact` | Submit contact form | Yes |

## Authentication

### Protected Routes
* Requires valid JWT token in request header
* Format: `Authorization: Bearer <token>`

### Security Features
* Encrypted passwords (bcrypt)
* JWT authentication
* Protected routes
* CORS enabled

## Getting Started

1. **Clone Repository**
   ```bash
   git clone https://github.com/RanaAnwar1/Ecommerce_backend.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Start Development Server**
   ```bash
   npm start
   ```
