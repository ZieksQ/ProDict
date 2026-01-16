# ENDPOINTS, REQUEST AND RESPONSE
this is documentation for term endpoints
## GET 
Endpoint: `/terms`
Endpoint: `/terms?search=`
Response:
```json
[
  {
    "id": 2,
    "name": "string",
    "group": "Default",
    "description": "string",
    "referenceLinks": null
  },
  {
    "id": 4,
    "name": "testing",
    "group": "Default",
    "description": "testing description 2",
    "referenceLinks": "https://testingminimalapi.com"
  }
]
```

## POST
Endpoint: `/terms`
Rules: 
- `description` and `referenceLinks` can be nullable 
- `description` min length `0` max length `500`
- `referenceLinks` in backend it checks if its valid Url
- This will have a metadata of link of where you can get the created terms
Request:
```json
{
  "name": "string",
  "groupId": 0,
  "description": "string",
  "referenceLinks": "string"
}
```
Response:
```json
{
  "id": 8,
  "name": "string",
  "group": "Default",
  "groupId": 1,
  "description": "string",
  "referenceLinks": "http://localhost:5007.com"
}
```

## PUT
Endpoint: `/terms/{id}`
Request: Same request with POST endpoint
Response: if `id` not found throws Error 404 no json response
Response: 
```json
{
  "id": 2,
  "name": "string",
  "group": "Default",
  "description": "string",
  "referenceLinks": null
}
```

## DELETE
Endpoint: `/terms/{id}`
Response: if success it throws `204` No Content.

## Error and Other Response

- DTOs Validation Errors
```json
{
  "title": "One or more validation errors occurred.",
  "errors": {
    "ReferenceLinks": [
      "The ReferenceLinks field is not a valid fully-qualified http, https, or ftp URL."
    ]
  }
}
```

- Group Id does not exist
```json
{
  "error": "GroupNotFound",
  "message": "Group with ID 0 does not exist.",
  "ok": false
}
```

- Not Found
- some endpoints doesn't have this error just throws empty json 404 Not Found
```json
{
  "error": "TermsNotFound",
  "message": "Terms does not exist.",
  "ok": false
}
```