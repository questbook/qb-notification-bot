
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://the-graph.questbook.app/subgraphs/name/qb-subgraph-optimism-mainnet",
  documents: ["./graphql/*.graphql"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-document-nodes"]
    },
  }
};

export default config;
