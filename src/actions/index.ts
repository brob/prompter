import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { htmlToSlateAST } from '@graphcms/html-to-slate-ast';

import { GraphQLClient } from 'graphql-request';
export const server = {
    storySubmit: defineAction({
      accept: 'form',
      input: z.object({
        name: z.string().optional(),
        story: z.string(),
        promptId: z.string(),
      }),
      handler: async ({name, story, promptId}, ctx) => {
        const {id, firstName, lastName} = await ctx.locals.currentUser()
        const fullName = firstName + " " + lastName
        if (!id) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged to submit a story.",
          });
        }
        const ast = await htmlToSlateAST(story);

        console.log({fullName})
        const data = {prompts: {connect: {id: promptId}}, userName: fullName ? fullName : '', userId: id, storyRte: { children: ast}, story}
        console.log({data: JSON.stringify(data)})
        const client = new GraphQLClient(import.meta.env.HYGRAPH_ENDPOINT)
        client.setHeader('Authorization', `Bearer ${import.meta.env.STORY_WRITE_TOKEN}`)
        const result = await client.request(`mutation MyMutation($data: UserStoryCreateInput!) {
          createUserStory(data: $data) {
          id
          }
        }`, {data})

        console.log( result.createUserStory.id)
        const publishResponse = client.request(`mutation PublishStory($id: ID!) {
          publishUserStory(where: {id: $id}) {
            id
            }
            }`, {id: result.createUserStory.id})
        return publishResponse
      }
    }),
    getGreeting: defineAction({
        input: z.object({
          name: z.string(),
        }),
        handler: async (input) => {
          return `Hello, ${input.name}!`
        }
      })}