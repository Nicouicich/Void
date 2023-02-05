<h1 style="text-align: center">Void API<h1>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Have npm installed in your computer
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at https://developer.riotgames.com/apis
2. Clone the repo
   ```sh
   git clone https://github.com/Nicouicich/Void
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create an .env file at the level of the src folder with the following variables:
   ```js
    PORT=number
    NODE_ENV=string
    LOL_API_KEY=string
    DB_TYPE=string
    DB_HOST=localhost
    DB_PORT=string
    DB_USERNAME=string
    DB_PASSWORD=string
    DB_NAME=string
    DB_TEST_NAME=string
    DB_TEST_USERNAME=string
    DB_TEST_PASSWORD=string
    DB_TEST_PORT=number
   ```
5. Install Docker in the computer.

6. Go to the program base folder and run docker-compose up

7. Go to the src folder and execute npm run start:prod

### Information
```
  For more information about the endpoints, once the application is running, go to /api
```

