# Serverless CRUD (MongoDB)

- Platform: AWS Lambda
- Database: MongoDB

## Road to Serverless
- Create five Lambda functions with the Python scripts in this folder:
  - `List` -> `list.py`
  - `Get` -> `get.py`
  - `Create` -> `create.py`
  - `Update` -> `update.py`
  - `Delete` -> `delete.py`
- Build a Lambda Layer for pymongo (exact path and zip):
  ```powershell
  # build layer to: serverless-mongodb\build\layer\python
  # output zip:     serverless-mongodb\pymongo-layer.zip
  mkdir serverless-mongodb\build\layer\python
  python -m pip install --target .\serverless-mongodb\build\layer\python pymongo
  Compress-Archive -Path .\serverless-mongodb\build\layer\python\* -DestinationPath .\serverless-mongodb\pymongo-layer.zip -Force
  ```
- Option A: Package each function code only (use the Layer for dependencies)
  ```powershell
  # List
  mkdir serverless-mongodb\build\list
  Copy-Item .\serverless-mongodb\list.py .\serverless-mongodb\build\list\
  Compress-Archive -Path .\serverless-mongodb\build\list\* -DestinationPath .\serverless-mongodb\list.zip -Force

  # Get
  mkdir serverless-mongodb\build\get
  Copy-Item .\serverless-mongodb\get.py .\serverless-mongodb\build\get\
  Compress-Archive -Path .\serverless-mongodb\build\get\* -DestinationPath .\serverless-mongodb\get.zip -Force

  # Create
  mkdir serverless-mongodb\build\create
  Copy-Item .\serverless-mongodb\create.py .\serverless-mongodb\build\create\
  Compress-Archive -Path .\serverless-mongodb\build\create\* -DestinationPath .\serverless-mongodb\create.zip -Force

  # Update
  mkdir serverless-mongodb\build\update
  Copy-Item .\serverless-mongodb\update.py .\serverless-mongodb\build\update\
  Compress-Archive -Path .\serverless-mongodb\build\update\* -DestinationPath .\serverless-mongodb\update.zip -Force

  # Delete
  mkdir serverless-mongodb\build\delete
  Copy-Item .\serverless-mongodb\delete.py .\serverless-mongodb\build\delete\
  Compress-Archive -Path .\serverless-mongodb\build\delete\* -DestinationPath .\serverless-mongodb\delete.zip -Force
  ```
- Option B: Vendor dependencies into each function zip (no Layer)
  ```powershell
  mkdir serverless-mongodb\build\create
  python -m pip install --target .\serverless-mongodb\build\create pymongo
  Copy-Item .\serverless-mongodb\create.py .\serverless-mongodb\build\create\
  Compress-Archive -Path .\serverless-mongodb\build\create\* -DestinationPath .\serverless-mongodb\create.zip -Force
  ```
- Enable Lambda proxy integration in API Gateway for each route.
- Remember to set Environment Variables and click “Deploy” in each Lambda.

## Environment Variables
```bash
MONGO_URL: mongodb://<host>:27017    # or SRV: mongodb+srv://user:pass@cluster/...
MONGO_DB_NAME: CRUD                   # default to DB_NAME or 'test' if not set
```

## API Notes
- All handlers return API Gateway proxy responses: `{ statusCode, headers, body }`.
- The `Id` field is a stringified MongoDB `ObjectId`.
- For `Get/Update/Delete`, pass `id` via query/path or JSON body, e.g. `?id=677f8d5c9f3d5a3c2b1e0abc`.

## Create Test Event
```json
{
  "Title": "Buy milk",
  "Description": "2L whole milk from store",
  "Status": "In Progress"
}
```

## Update Test Event
```json
{
  "id": "677f8d5c9f3d5a3c2b1e0abc",
  "Title": "Task 1",
  "Description": "Save the world",
  "Status": "Done"
}
```

## Get/Delete Test Event
```json
{
  "id": "677f8d5c9f3d5a3c2b1e0abc"
}
```

## Troubleshooting
- 502 Malformed Lambda proxy response:
  - Ensure your function returns `{ statusCode, headers, body }` and `body` is a JSON string.
- Import errors for `pymongo`:
  - Ensure `pymongo` is included under the corresponding `serverless-mongodb\build\<function>\` before zipping.
  - If deploying via layers instead, keep paths consistent and attach the layer to the function.


