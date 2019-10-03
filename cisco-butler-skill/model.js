{
    "interactionModel": {
        "languageModel": {
            "invocationName": "cisco butler",
            "intents": [
                {
                    "name": "AMAZON.CancelIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.HelpIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.StopIntent",
                    "samples": []
                },
                {
                    "name": "TenantInfoIntent",
                    "slots": [],
                    "samples": [
                        "give me all tenants",
                        "List all my tenants",
                        "how many tenants I have"
                    ]
                },
                {
                    "name": "CloudInfoIntent",
                    "slots": [],
                    "samples": [
                        "tell me how many clouds I have",
                        "list all clouds",
                        "how may clouds are configured"
                    ]
                },
                {
                    "name": "AMAZON.NavigateHomeIntent",
                    "samples": []
                },
                {
                    "name": "ActionsIntent",
                    "slots": [],
                    "samples": [
                        "list all my actions",
                        "how many actions I have"
                    ]
                },
                {
                    "name": "CostReportIntent",
                    "slots": [],
                    "samples": [
                        "tell me how much I spent",
                        "how much I spent "
                    ]
                },
                {
                    "name": "DeployDBIntent",
                    "slots": [
                        {
                            "name": "cloud",
                            "type": "cloudType"
                        },
                        {
                            "name": "dbType",
                            "type": "databaseType",
                            "samples": [
                                "use {dbType}",
                                "Deploy {dbType} ",
                                "I want {dbType}",
                                "{dbType}"
                            ]
                        }
                    ],
                    "samples": [
                        "deploy a {dbType} to {cloud}",
                        "deploy {dbType} to {cloud}",
                        "deploy a database"
                    ]
                }
            ],
            "types": [
                {
                    "name": "cloudType",
                    "values": [
                        {
                            "id": "aws",
                            "name": {
                                "value": "aws"
                            }
                        },
                        {
                            "id": "gcp",
                            "name": {
                                "value": "gcp",
                                "synonyms": [
                                    "google"
                                ]
                            }
                        }
                    ]
                },
                {
                    "name": "databaseType",
                    "values": [
                        {
                            "id": "psql",
                            "name": {
                                "value": "psql",
                                "synonyms": [
                                    "postgresql"
                                ]
                            }
                        },
                        {
                            "id": "mysql",
                            "name": {
                                "value": "mysql"
                            }
                        }
                    ]
                }
            ]
        },
        "dialog": {
            "intents": [
                {
                    "name": "DeployDBIntent",
                    "confirmationRequired": false,
                    "prompts": {},
                    "slots": [
                        {
                            "name": "cloud",
                            "type": "cloudType",
                            "confirmationRequired": false,
                            "elicitationRequired": true,
                            "prompts": {
                                "elicitation": "Elicit.Slot.1285093208821.1007062359561"
                            }
                        },
                        {
                            "name": "dbType",
                            "type": "databaseType",
                            "confirmationRequired": false,
                            "elicitationRequired": true,
                            "prompts": {
                                "elicitation": "Elicit.Slot.1285093208821.560721080849"
                            }
                        }
                    ]
                }
            ],
            "delegationStrategy": "ALWAYS"
        },
        "prompts": [
            {
                "id": "Elicit.Slot.1285093208821.1007062359561",
                "variations": [
                    {
                        "type": "PlainText",
                        "value": "Where do you want to deploy?"
                    },
                    {
                        "type": "PlainText",
                        "value": "On which cloud?"
                    }
                ]
            },
            {
                "id": "Elicit.Slot.1285093208821.560721080849",
                "variations": [
                    {
                        "type": "PlainText",
                        "value": "Do you want My SQL or Postgres?"
                    },
                    {
                        "type": "PlainText",
                        "value": "mySQL of PSQL?"
                    },
                    {
                        "type": "PlainText",
                        "value": "I can deploy My SQL or P SQL. Which one do you want?"
                    }
                ]
            }
        ]
    }
}