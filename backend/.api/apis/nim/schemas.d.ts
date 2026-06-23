declare const CreateChatCompletionV1ChatCompletionsPost: {
    readonly body: {
        readonly additionalProperties: false;
        readonly properties: {
            readonly model: {
                readonly type: "string";
                readonly title: "Model";
                readonly default: "qwen/qwen3-coder-480b-a35b-instruct";
            };
            readonly messages: {
                readonly description: "A list of messages comprising the conversation so far. The roles of the messages must be alternating between `user` and `assistant`. The last input message should have role `user`. A message with the the `system` role is optional, and must be the very first message if it is present; `context` is also optional, but must come before a user question.";
                readonly items: {
                    readonly additionalProperties: false;
                    readonly properties: {
                        readonly role: {
                            readonly description: "The role of the message author.";
                            readonly enum: readonly ["system", "context", "user", "assistant", "tool"];
                            readonly title: "Role";
                            readonly type: "string";
                        };
                        readonly content: {
                            readonly description: "The contents of the message.";
                            readonly title: "Content";
                            readonly anyOf: readonly [{
                                readonly type: "string";
                            }, {
                                readonly type: "null";
                            }];
                        };
                        readonly tool_call_id: {
                            readonly anyOf: readonly [{
                                readonly type: "string";
                            }, {
                                readonly type: "null";
                            }];
                            readonly title: "Tool Call Id";
                            readonly description: "The id of the tool call.";
                        };
                        readonly tool_calls: {
                            readonly anyOf: readonly [{
                                readonly items: {
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly title: "Id";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["function"];
                                            readonly const: "function";
                                            readonly title: "Type";
                                            readonly default: "function";
                                        };
                                        readonly function: {
                                            readonly properties: {
                                                readonly name: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "null";
                                                    }];
                                                    readonly title: "Name";
                                                };
                                                readonly arguments: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "null";
                                                    }];
                                                    readonly title: "Arguments";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                            readonly type: "object";
                                            readonly required: readonly ["name", "arguments"];
                                            readonly title: "FunctionCall";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                    readonly type: "object";
                                    readonly required: readonly ["function"];
                                    readonly title: "ToolCall";
                                };
                                readonly type: "array";
                            }, {
                                readonly type: "null";
                            }];
                            readonly title: "Tool Calls";
                            readonly description: "The tool(s) called by the model.";
                        };
                    };
                    readonly required: readonly ["role", "content"];
                    readonly title: "Message";
                    readonly type: "object";
                };
                readonly title: "Messages";
                readonly type: "array";
            };
            readonly temperature: {
                readonly default: 0.7;
                readonly description: "The sampling temperature to use for text generation. The higher the temperature value is, the less deterministic the output text will be. It is not recommended to modify both temperature and top_p in the same call.";
                readonly maximum: 1;
                readonly minimum: 0;
                readonly title: "Temperature";
                readonly type: "number";
            };
            readonly top_p: {
                readonly default: 0.8;
                readonly description: "The top-p sampling mass used for text generation. The top-p value determines the probability mass that is sampled at sampling time. For example, if top_p = 0.2, only the most likely tokens (summing to 0.2 cumulative probability) will be sampled. It is not recommended to modify both temperature and top_p in the same call.";
                readonly maximum: 1;
                readonly exclusiveMinimum: 0;
                readonly title: "Top P";
                readonly type: "number";
            };
            readonly tools: {
                readonly anyOf: readonly [{
                    readonly items: {
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["function"];
                                readonly const: "function";
                                readonly title: "Type";
                                readonly default: "function";
                            };
                            readonly function: {
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly title: "Name";
                                    };
                                    readonly description: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "null";
                                        }];
                                        readonly title: "Description";
                                    };
                                    readonly parameters: {
                                        readonly anyOf: readonly [{
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        }, {
                                            readonly type: "null";
                                        }];
                                        readonly title: "Parameters";
                                    };
                                };
                                readonly additionalProperties: false;
                                readonly type: "object";
                                readonly required: readonly ["name"];
                                readonly title: "FunctionDefinition";
                            };
                        };
                        readonly additionalProperties: false;
                        readonly type: "object";
                        readonly required: readonly ["function"];
                        readonly title: "ChatCompletionToolsParam";
                    };
                    readonly type: "array";
                }, {
                    readonly type: "null";
                }];
                readonly title: "Tools";
            };
            readonly frequency_penalty: {
                readonly type: "number";
                readonly maximum: 2;
                readonly minimum: -2;
                readonly default: 0;
                readonly title: "Frequency Penalty";
                readonly description: "Indicates how much to penalize new tokens based on their existing frequency in the text so far, decreasing model likelihood to repeat the same line verbatim.";
            };
            readonly presence_penalty: {
                readonly type: "number";
                readonly maximum: 2;
                readonly minimum: -2;
                readonly default: 0;
                readonly title: "Presence Penalty";
                readonly description: "Positive values penalize new tokens based on whether they appear in the text so far, increasing model likelihood to talk about new topics.";
            };
            readonly max_tokens: {
                readonly default: 4096;
                readonly description: "The maximum number of tokens to generate in any given call. Note that the model is not aware of this value, and generation will simply stop at the number of tokens specified.";
                readonly maximum: 16384;
                readonly minimum: 1;
                readonly title: "Max Tokens";
                readonly type: "integer";
            };
            readonly stream: {
                readonly default: false;
                readonly description: "If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events (SSE) as they become available (JSON responses are prefixed by `data: `), with the stream terminated by a `data: [DONE]` message.";
                readonly title: "Stream";
                readonly type: "boolean";
            };
            readonly stop: {
                readonly anyOf: readonly [{
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly type: "array";
                }, {
                    readonly type: "string";
                }, {
                    readonly type: "null";
                }];
                readonly title: "Stop";
                readonly description: "A string or a list of strings where the API will stop generating further tokens. The returned text will not contain the stop sequence.";
            };
        };
        readonly required: readonly ["messages"];
        readonly title: "ChatRequest";
        readonly type: "object";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly id: {
                    readonly description: "A unique identifier for the completion.";
                    readonly format: "uuid";
                    readonly title: "Id";
                    readonly type: "string";
                };
                readonly choices: {
                    readonly description: "The list of completion choices the model generated for the input prompt.";
                    readonly items: {
                        readonly properties: {
                            readonly index: {
                                readonly description: "The index of the choice in the list of choices (always 0).";
                                readonly title: "Index";
                                readonly type: "integer";
                            };
                            readonly message: {
                                readonly description: "A chat completion message generated by the model.";
                                readonly required: readonly ["role", "content"];
                                readonly title: "Message";
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly properties: {
                                    readonly role: {
                                        readonly description: "The role of the message author.\n\n`system` `context` `user` `assistant` `tool`";
                                        readonly enum: readonly ["system", "context", "user", "assistant", "tool"];
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly description: "The contents of the message.";
                                        readonly title: "Content";
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "null";
                                        }];
                                    };
                                    readonly tool_call_id: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "null";
                                        }];
                                        readonly title: "Tool Call Id";
                                        readonly description: "The id of the tool call.";
                                    };
                                    readonly tool_calls: {
                                        readonly anyOf: readonly [{
                                            readonly items: {
                                                readonly type: "object";
                                                readonly required: readonly ["function"];
                                                readonly title: "ToolCall";
                                                readonly additionalProperties: false;
                                                readonly properties: {
                                                    readonly id: {
                                                        readonly type: "string";
                                                        readonly title: "Id";
                                                    };
                                                    readonly type: {
                                                        readonly type: "string";
                                                        readonly enum: readonly ["function"];
                                                        readonly const: "function";
                                                        readonly title: "Type";
                                                        readonly default: "function";
                                                        readonly description: "`function`";
                                                    };
                                                    readonly function: {
                                                        readonly type: "object";
                                                        readonly required: readonly ["name", "arguments"];
                                                        readonly title: "FunctionCall";
                                                        readonly additionalProperties: false;
                                                        readonly properties: {
                                                            readonly name: {
                                                                readonly anyOf: readonly [{
                                                                    readonly type: "string";
                                                                }, {
                                                                    readonly type: "null";
                                                                }];
                                                                readonly title: "Name";
                                                            };
                                                            readonly arguments: {
                                                                readonly anyOf: readonly [{
                                                                    readonly type: "string";
                                                                }, {
                                                                    readonly type: "null";
                                                                }];
                                                                readonly title: "Arguments";
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                            readonly type: "array";
                                        }, {
                                            readonly type: "null";
                                        }];
                                        readonly title: "Tool Calls";
                                        readonly description: "The tool(s) called by the model.";
                                    };
                                };
                            };
                            readonly finish_reason: {
                                readonly anyOf: readonly [{
                                    readonly enum: readonly ["stop", "length", "tool_calls"];
                                    readonly type: "string";
                                    readonly description: "`stop` `length` `tool_calls`";
                                }, {
                                    readonly type: "null";
                                }];
                                readonly default: any;
                                readonly description: "The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence, or `length` if the maximum number of tokens specified in the request was reached.";
                                readonly examples: readonly ["stop"];
                                readonly title: "Finish Reason";
                            };
                        };
                        readonly required: readonly ["index", "message"];
                        readonly title: "Choice";
                        readonly type: "object";
                    };
                    readonly title: "Choices";
                    readonly type: "array";
                };
                readonly usage: {
                    readonly description: "Usage statistics for the completion request.";
                    readonly required: readonly ["completion_tokens", "prompt_tokens", "total_tokens"];
                    readonly title: "Usage";
                    readonly type: "object";
                    readonly properties: {
                        readonly completion_tokens: {
                            readonly description: "Number of tokens in the generated completion.";
                            readonly examples: readonly [25];
                            readonly title: "Completion Tokens";
                            readonly type: "integer";
                        };
                        readonly prompt_tokens: {
                            readonly description: "Number of tokens in the prompt.";
                            readonly examples: readonly [9];
                            readonly title: "Prompt Tokens";
                            readonly type: "integer";
                        };
                        readonly total_tokens: {
                            readonly description: "Total number of tokens used in the request (prompt + completion).";
                            readonly examples: readonly [34];
                            readonly title: "Total Tokens";
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly required: readonly ["id", "choices", "usage"];
            readonly title: "ChatCompletion";
            readonly type: "object";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "202": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly description: "Error type";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Error title";
                };
                readonly status: {
                    readonly type: "integer";
                    readonly description: "Error status code";
                };
                readonly detail: {
                    readonly type: "string";
                    readonly description: "Detailed information about the error";
                };
                readonly instance: {
                    readonly type: "string";
                    readonly description: "Function instance used to invoke the request";
                };
                readonly requestId: {
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly description: "UUID of the request";
                };
            };
            readonly type: "object";
            readonly required: readonly ["type", "title", "status", "detail", "instance", "requestId"];
            readonly title: "InvokeError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly description: "Error type";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Error title";
                };
                readonly status: {
                    readonly type: "integer";
                    readonly description: "Error status code";
                };
                readonly detail: {
                    readonly type: "string";
                    readonly description: "Detailed information about the error";
                };
                readonly instance: {
                    readonly type: "string";
                    readonly description: "Function instance used to invoke the request";
                };
                readonly requestId: {
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly description: "UUID of the request";
                };
            };
            readonly type: "object";
            readonly required: readonly ["type", "title", "status", "detail", "instance", "requestId"];
            readonly title: "InvokeError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { CreateChatCompletionV1ChatCompletionsPost };
