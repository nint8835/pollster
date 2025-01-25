import { defineConfig } from '@openapi-codegen/cli';
import {
    generateReactQueryComponents,
    generateReactQueryFunctions,
    generateSchemaTypes,
} from '@openapi-codegen/typescript';

export default defineConfig({
    pollster: {
        from: {
            source: 'url',
            url: 'http://localhost:8000/openapi.json',
        },
        outputDir: 'frontend/src/queries/api',
        to: async (context) => {
            const filenamePrefix = 'pollster';
            const { schemasFiles } = await generateSchemaTypes(context, {
                filenamePrefix,
            });
            await generateReactQueryComponents(context, {
                filenamePrefix,
                schemasFiles,
                generateSuspenseQueries: true,
            });
            await generateReactQueryFunctions(context, {
                filenamePrefix,
                schemasFiles,
            });
        },
    },
});
