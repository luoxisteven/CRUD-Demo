- 用哪条网段：你的默认 VPC 是 172.31.0.0/16；Lightsail 私网是 172.26.0.0/16（你的实例私网 IP 172.26.14.205 在其中）。Lambda 在 VPC 里访问 Lightsail 时应走 172.26.0.0/16。

- Lambda VPC 配置（函数 → 网络）
  - VPC：选择 `vpc-0a3bc8e16e47d04f6`
  - 子网：选 2-3 个子网（例如 `subnet-04b4907fd197b2f30`、`subnet-01ecd102af1dd0b6b`、`subnet-067eaf57dffe00dde`）
  - 安全组（新建一个，示例命名 `sg-lambda-mongo`）：
    - 出站规则：允许 TCP 27017 到 `172.26.14.205/32`（更宽松可用 `172.26.0.0/16`）
    - 入站规则：可留空（Lambda 作为客户端发起连接）

- Lightsail 实例防火墙（实例 → Networking）
  - 新增规则：Custom TCP，端口 `27017`
  - 源：填 `172.31.0.0/16`（或更严格地填你 Lambda 所在子网 CIDR 段，如 172.31.0.0/20 等）
  - 说明：Lightsail 防火墙不支持引用安全组，只能填 CIDR，所以用 VPC/子网 CIDR 来限制来源

- 路由/对等
  - 确认 Lightsail VPC peering 已启用（Lightsail 控制台 → Account → Advanced → Enable VPC peering）
  - 在默认 VPC 的主路由表应有到 172.26.0.0/16 的对等路由（启用 peering 后会自动加）

- mongod 监听
  - `mongod.conf` 的 `net.bindIp` 包含 `172.26.14.205`（或 `0.0.0.0`），端口 `27017` 开放

- Lambda 环境变量（与代码匹配，优先使用私网 IP）
  - 使用完整 URI：
    - `MONGO_URL=mongodb://luoxisteven:<URL 编码后的密码>@172.26.14.205:27017/?authSource=admin`
  - 或分散变量（代码会自动拼接并 URL 编码）：
    - `MONGO_HOST=172.26.14.205`
    - `MONGO_PORT=27017`
    - `MONGO_USER=luoxisteven`
    - `MONGO_PASSWORD=<你的密码（原文即可，代码会编码）>`
    - `MONGO_AUTH_SOURCE=admin`
    - 可选 `MONGO_DB_NAME=<库名>`

- 连接测试失败时检查
  - Lightsail 防火墙是否放通 27017 且源 CIDR 覆盖 Lambda 子网
  - Lambda 安全组出站是否允许到 172.26.14.205:27017
  - VPC peering 是否启用、路由是否存在
  - mongod 是否在 172.26.14.205:27017 监听并允许认证用户登录