import { DocumentNode } from 'graphql'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Query = {
  __typename?: 'Query'
  hello: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createBlog: Blog
  updateBlog: Blog
  createPost: Post
  updatePost: Post
  likePost: LikePostResult
}

export type MutationCreateBlogArgs = {
  name: Scalars['String']
  slug: Scalars['String']
}

export type MutationUpdateBlogArgs = {
  id: Scalars['Int']
  slug: Scalars['String']
  name: Scalars['String']
  introduction: Scalars['String']
}

export type MutationCreatePostArgs = {
  title: Scalars['String']
  content: Scalars['String']
  blogSlug: Scalars['String']
  slug: Scalars['String']
  tags: Scalars['String']
}

export type MutationUpdatePostArgs = {
  id: Scalars['Int']
  title: Scalars['String']
  content: Scalars['String']
  tags: Scalars['String']
  slug: Scalars['String']
}

export type MutationLikePostArgs = {
  postId: Scalars['Int']
}

export type Blog = {
  __typename?: 'Blog'
  id: Scalars['ID']
  name: Scalars['String']
  introduction: Scalars['String']
  slug: Scalars['String']
}

export type Post = {
  __typename?: 'Post'
  id: Scalars['ID']
  slug: Scalars['String']
  readableSlug: Scalars['String']
  content: Scalars['String']
  title: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type LikePostResult = {
  __typename?: 'LikePostResult'
  likesCount: Scalars['Int']
  isLiked: Scalars['Boolean']
}

export type CreateBlogMutationVariables = Exact<{
  name: Scalars['String']
  slug: Scalars['String']
}>

export type CreateBlogMutation = { __typename?: 'Mutation' } & {
  createBlog: { __typename?: 'Blog' } & Pick<Blog, 'id' | 'slug'>
}

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String']
  content: Scalars['String']
  slug: Scalars['String']
  tags: Scalars['String']
  blogSlug: Scalars['String']
}>

export type CreatePostMutation = { __typename?: 'Mutation' } & {
  createPost: { __typename?: 'Post' } & Pick<Post, 'id' | 'slug'>
}

export type LikePostMutationVariables = Exact<{
  postId: Scalars['Int']
}>

export type LikePostMutation = { __typename?: 'Mutation' } & {
  likePost: { __typename?: 'LikePostResult' } & Pick<
    LikePostResult,
    'likesCount' | 'isLiked'
  >
}

export type UpdateBlogMutationVariables = Exact<{
  id: Scalars['Int']
  name: Scalars['String']
  slug: Scalars['String']
  introduction: Scalars['String']
}>

export type UpdateBlogMutation = { __typename?: 'Mutation' } & {
  updateBlog: { __typename?: 'Blog' } & Pick<Blog, 'id'>
}

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int']
  title: Scalars['String']
  content: Scalars['String']
  slug: Scalars['String']
  tags: Scalars['String']
}>

export type UpdatePostMutation = { __typename?: 'Mutation' } & {
  updatePost: { __typename?: 'Post' } & Pick<Post, 'id' | 'slug'>
}

export const CreateBlogDocument: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createBlog' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createBlog' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
}

export function useCreateBlogMutation() {
  return Urql.useMutation<CreateBlogMutation, CreateBlogMutationVariables>(
    CreateBlogDocument,
  )
}
export const CreatePostDocument: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createPost' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'title' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'content' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tags' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'blogSlug' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createPost' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'title' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'title' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'content' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'content' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tags' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'tags' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'blogSlug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'blogSlug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
}

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
  )
}
export const LikePostDocument: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'likePost' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'postId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'likePost' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'postId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'postId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isLiked' } },
              ],
            },
          },
        ],
      },
    },
  ],
}

export function useLikePostMutation() {
  return Urql.useMutation<LikePostMutation, LikePostMutationVariables>(
    LikePostDocument,
  )
}
export const UpdateBlogDocument: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateBlog' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'introduction' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateBlog' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'introduction' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'introduction' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
}

export function useUpdateBlogMutation() {
  return Urql.useMutation<UpdateBlogMutation, UpdateBlogMutationVariables>(
    UpdateBlogDocument,
  )
}
export const UpdatePostDocument: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updatePost' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'title' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'content' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tags' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePost' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'title' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'title' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'content' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'content' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tags' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'tags' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
}

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(
    UpdatePostDocument,
  )
}
