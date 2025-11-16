# Serverless CRUD

- Platform: AWS Lambda
- Database: MySQL
- Road to Serverless
  - Copy the Python script into different Notepad in AWS Lambda
  - Build a Lambda Layer for pymysql (exact path and zip):
    ``` powershell
    # build layer to: serverless-mysql\build\layer\python
    # output zip:     serverless-mysql\pymysql-layer.zip
    mkdir serverless-mysql\build\layer\python
    python -m pip install --target .\serverless-mysql\build\layer\python pymysql
    Compress-Archive -Path .\serverless-mysql\build\layer\python\* -DestinationPath .\serverless-mysql\pymysql-layer.zip -Force
    ```
  - Option A: Package each function code only (use the Layer for dependencies)
    ``` bash
    # Windows PowerShell (examples)
    # Create
    mkdir serverless-mysql\build\create
    Copy-Item .\serverless-mysql\create.py .\serverless-mysql\build\create\
    
    # Get
    mkdir serverless-mysql\build\get
    Copy-Item .\serverless-mysql\get.py .\serverless-mysql\build\get\
    
    # List
    mkdir serverless-mysql\build\list
    Copy-Item .\serverless-mysql\list.py .\serverless-mysql\build\list\
    
    # Update
    mkdir serverless-mysql\build\update
    Copy-Item .\serverless-mysql\update.py .\serverless-mysql\build\update\
    
    # Delete
    mkdir serverless-mysql\build\delete
    Copy-Item .\serverless-mysql\delete.py .\serverless-mysql\build\delete\

    # zip
    Compress-Archive -Path .\serverless-mysql\build\create\* -DestinationPath .\serverless-mysql\create.zip -Force
    Compress-Archive -Path .\serverless-mysql\build\get\*    -DestinationPath .\serverless-mysql\get.zip -Force
    Compress-Archive -Path .\serverless-mysql\build\list\*   -DestinationPath .\serverless-mysql\list.zip -Force
    Compress-Archive -Path .\serverless-mysql\build\update\* -DestinationPath .\serverless-mysql\update.zip -Force
    Compress-Archive -Path .\serverless-mysql\build\delete\* -DestinationPath .\serverless-mysql\delete.zip -Force
    ```
  - Option B: Vendor dependencies into each function zip (no Layer). Replace Copy-Item step with:
    ``` powershell
    mkdir serverless-mysql\build\create
    python -m pip install --target .\serverless-mysql\build\create pymysql
    Copy-Item .\serverless-mysql\create.py .\serverless-mysql\build\create\
    Compress-Archive -Path .\serverless-mysql\build\create\* -DestinationPath .\serverless-mysql\create.zip -Force
    ```
  - Add a layer for the python package. (In this case is `pymysql` - `serverless-mysql\pymysql-layer.zip`)
  - Remember to add Environment Variables into the functions
  - Remember to click on "Deploy" in AWS Lambda to deploy the code
  - Setting up the trigger for the API Gateway
  - Setting up the custom domain names for API as well

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
    "Title": "Buy milk",
    "Description": "2L whole milk from store",
    "Status": "In Progress"
  }
  ```

- Update Test Event
  ```json
  {
    "id": "1",
    "Title": "Task 1",
    "Description": "Save the world",
    "Status": "Done"
  }
  ```

- Get/Delete Test Event
  ``` json
  {
    "id": "1"
  }
  ```