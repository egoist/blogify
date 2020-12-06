declare namespace NodeJS {
  interface ProcessEnv {
    // Additional environment variables
    HASH_KEY: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_APP_URL: string
  }

  interface Global {
    prisma: any
  }
}

type $TsFixMe = any

declare module 'codemirror/mode/markdown/markdown'
