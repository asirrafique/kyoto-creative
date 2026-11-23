import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/lib/sanity/schemaTypes/index.js';

export default defineConfig({
  name: 'kyoto-creative',
  title: 'Kyoto Creative Blog CMS',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});