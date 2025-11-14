# Serverless CRUD

- Platform: AWS Lambda
- Steps to Serverless
  - Copy the Python script into different Notepad in AWS Lambda
  - Run the script below to create a zip for layer
    ``` bash
    # pip install pymysql package
    mkdir serverless\build\create
    python -m pip install --target .\serverless\build\create pymysql
    Copy-Item .\serverless\create.py .\serverless\build\create\

    # zip
    Compress-Archive -Path .\serverless\build\create\* -DestinationPath .\serverless\create.zip -Force
    ```
  - Add a layer for the python package. (In this case is `pymysql` - `severless/pymysql-layer.zip`)
  - Remember to add Environment Variables into the functions
  - Remember to click on "Deploy" in AWS Lambda to deploy the code

- Environment Variables
  ``` bash
  DB_HOST: HOST_ADDRESS
  DB_NAME: CRUD
  DB_USER: admin
  DB_PASSWORD: PASSWORD
  ```

- Create Test Event
  ``` json
  {
    "body": "{\"Title\":\"Buy milk2\",\"Description\":\"2L whole milk from store\",\"Status\":\"Done\"}"
  }
  ```

- Get Test Event
  ``` json
  {
    "pathParameters": { "id": "1" }
  }
  ```