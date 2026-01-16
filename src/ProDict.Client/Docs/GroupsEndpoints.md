# Endpoints, Request and Response
this is documentation for group endpoints

## GET
Endpoints: `/groups`
Response:
```json
[
  {
    "id": 1,
    "name": "Default"
  },
  {
    "id": 2,
    "name": "C#"
  }
]
```

Endpoints: `/groups/{id}`
Response:
```json
{
  "id": 2,
  "name": "C#"
}
```

## POST
Endpoints: `/groups`
Request:
```json
{
  "name": "string"
}
```
Response:
```json
{
  "id": 4,
  "name": "string"
}
```

## PUT
Endpoints: `/groups/{id}`
Request: same with POST request
Response: same with POST response

## DELETE
Endpoints: `/groups/{id}`
Response: if groupId not found it throws empty json 404 Not Found.
if success: throw 200 Ok without json 