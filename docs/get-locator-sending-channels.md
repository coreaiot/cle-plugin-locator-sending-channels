<!-- lang zh-CN begin -->
# 获取基站下行信道

> GET `API_ADDRESS`/`PREFIX`/locator-sending-channels

## HTTP 状态码

| 状态码 | 简介 | Body |
|---|---|---|
| 200 | 成功 | JSON Result |
| 400 | 失败 | Error Message |


## JSON Result 结构
```ts
export interface IResult {
  mac: string; // 基站 MAC
  ip: string; // 基站 IP
  port: number; // 基站端口
  modelName: string; // 基站型号
  channel: number | 'default'; // 下行信道
  whitening?: boolean; // 白化
}
```

## 示例
<!-- lang zh-CN end -->

<!-- lang en-US begin -->
# Get message sending channel

> GET `API_ADDRESS`/`PREFIX`/locator-sending-channels

## HTTP status code

| Code | Description | Body |
|---|---|---|
| 200 | OK | JSON Result |
| 400 | Failed | Error Message |

## JSON Result structure
```ts
export interface IResult {
  mac: string; // Locator MAC
  ip: string; // Locator IP
  port: number; // Locator port
  modelName: string; // Locator model name
  channel: number | 'default'; // Message sending channel
  whitening?: boolean; // Whether it is whitening
}
```

## Example
<!-- lang en-US end -->

> GET http://localhost:44444/locator-sending-channels

> 200
```json
[
  {
    "mac": "3c:fa:d3:b0:9f:ff",
    "ip": "192.168.1.106",
    "port": 8256,
    "modelName": "CL-GA25-P2",
    "channel": 2402,
    "whitening": true
  },
  ...
]
```
