import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type CreateChatCompletionV1ChatCompletionsPostBodyParam = FromSchema<typeof schemas.CreateChatCompletionV1ChatCompletionsPost.body>;
export type CreateChatCompletionV1ChatCompletionsPostResponse200 = FromSchema<typeof schemas.CreateChatCompletionV1ChatCompletionsPost.response['200']>;
export type CreateChatCompletionV1ChatCompletionsPostResponse202 = FromSchema<typeof schemas.CreateChatCompletionV1ChatCompletionsPost.response['202']>;
export type CreateChatCompletionV1ChatCompletionsPostResponse422 = FromSchema<typeof schemas.CreateChatCompletionV1ChatCompletionsPost.response['422']>;
export type CreateChatCompletionV1ChatCompletionsPostResponse500 = FromSchema<typeof schemas.CreateChatCompletionV1ChatCompletionsPost.response['500']>;
