<!-- lang zh-CN begin -->
# 设置基站下行信道

> POST `API_ADDRESS`/`PREFIX`/locator-sending-channels

## 参数

| 名称 | In | 可选 | 简介 |
|---|---|---|---|
| json | body | NO | JSON Body |

## HTTP 状态码

| 状态码 | 简介 | Body |
|---|---|---|
| 200 | 成功 | JSON Result |
| 400 | 失败 | Error Message |

## JSON Body 结构
```ts
export interface IBody {
  channel: number; // 下行信道
  whitening: boolean; // 白化
  enabled: boolean; // 启用自定义。不启用基站会使用扫描信道
}
```

## JSON Result 结构
```ts
export interface IResult {
  mac: string; // 基站 MAC
  ip: string; // 基站 IP
  port: number; // 基站端口
  modelName: string; // 基站型号
  errMsg?: string; // 错误信息
}
```

## 示例
<!-- lang zh-CN end -->

<!-- lang en-US begin -->
# Set message sending channel

> POST `API_ADDRESS`/`PREFIX`/locator-sending-channels

## Params

| Name | In | Optional | Description |
|---|---|---|---|
| json | body | NO | JSON Body |

## HTTP status code

| Code | Description | Body |
|---|---|---|
| 200 | OK | JSON Result |
| 400 | Failed | Error Message |

## JSON Body structure
```ts
export interface IBody {
  channel: number; // Message sending channel
  whitening: boolean; // Whether it is whitening
  enabled: boolean; // If not enabled, it uses scanning channels.
}
```

## JSON Result structure
```ts
export interface IResult {
  mac: string; // Locator MAC
  ip: string; // Locator IP
  port: number; // Locator port
  modelName: string; // Locator model name
  errMsg?: string; // Error message
}
```

## Example
<!-- lang en-US end -->

> POST http://localhost:44444/locator-sending-channels
```json
{
  "channel": 2402,
  "whitening": true,
  "enabled": true
}
```

> 200
```json
[
  {
    "mac": "3c:fa:d3:b0:9f:ff",
    "ip": "192.168.1.106",
    "port": 8256,
    "modelName": "CL-GA25-P2"
  },
  ...
]
```
