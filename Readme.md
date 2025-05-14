# Project Wellness

This is a showcase of my abilities to write different Azure functions. At the current moment I am working on Azure functions implementations and gaining more expertise in cloud native app development and cloud operations in general. This will be used as a use sample for my next Tech Talk in Halifax, NS.

## Installation
Refer to the azure documentation
Also you may need to make use of local settings

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "{top secret}",
    "AzureWebJobsSecretStorageType": "files",
    "FUNCTIONS_EXTENSION_VERSION": "~4",
    "WEBSITE_NODE_DEFAULT_VERSION": "~22",
    "WEBSITE_RUN_FROM_PACKAGE": "1",
    "CosmosDbConnectionString": "{top secret}",
    "ACS_CONNECTION_STRING": "{top secret}"
  }
}
```

**More details TBD**

