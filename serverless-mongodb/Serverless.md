# Serverless CRUD (MongoDB)

- Platform: AWS Lambda
- Database: MongoDB in AWS Lighsail Server
- Virtual Network: AWS VPC
- Python Script: `./serverless-mongodb/tasks.py`

## Why I am going to a server's database in Serverless backend?
I could absolutely use a cloud MongoDB service like MongoDB Atlas. However, using a cloud database incurs additional costs. To reduce my expenses, I'm trying to connect my Lambda function to a MongoDB database hosted on my own server. For security purposes, I'm using AWS VPC to establish a connection between my server and Lambda function, without exposing port 27017 to external visitors.

## Roads to VPC with AWS Lightsail
1. Create a default VPC (AWS Lightsail can only connect with a default VPC.)
  - IP address `172.31.0.0/16` is normally the CIDR for default VPC.
2. Update your instance with "VPC Peering" in AWS Lightsail Console
3. Create your AWS Lambda function connecting with the AWS Layer
4. Create a test case to test whether the endpoint is functional
5. Connect your AWS Lambda with the VPC
  - On your way you need to configure permissions in IAM for your Lambda Function
      - Find your role connect to this Lambda Function
      - Permissions -> Add permissions -> Create inline policy
      - Choose JSON and add the script below
        ``` json
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface"
              ],
              "Resource": "*"
            }
          ]
        }
        ```
5. Create a security group for your VPC (Not necessary)
  - In default, the Inbound and Outbound Rule have been set up to accept any inbound and outbound.
  - Set up an outbound rule of TCP with port 27017, IP Address = AWS Lightsail Private IP:32
  - Assign this security group to your VPC
6. Configure the Firewall in AWS Lightsail
  - Put in `172.31.0.0/16` for the whole default VPC `172.31.0.0-172.31.255.255`
  - or put in `172.31.0.0/16` for the VPC subnet (Make sure your Lambda function is within that subnet)
7. Configure Environment Variables in your AWS Function
    - `MONGO_HOST=Your AWS Lightsail private address`
    - `MONGO_PORT=27017`
    - `MONGO_USER=username`
    - `MONGO_PASSWORD=password`
    - `MONGO_AUTH_SOURCE=admin`
    - `MONGO_DB_NAME=TaskDB`
    - `MONGO_COLLECTION=Tasks`

## Test Cases
- List
  ```json
  { "action": "list" }
  ```
- Get
  ```json
  { "action": "get", "id": "690c0eb472621a0933bb7d18" }
  ```
- Update
  ```json
  {
    "action": "update",
    "id": "690c0eb472621a0933bb7d18",
    "Title": "Buy milk (updated)",
    "Status": "Done"
  }
  ```
- Delete
  ```json
  { "action": "delete", "id": "690c0eb472621a0933bb7d18" }
  ```
