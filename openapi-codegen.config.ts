import { defineConfig } from '@openapi-codegen/cli';
import { generateReactQueryComponents, generateSchemaTypes } from '@openapi-codegen/typescript';

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
                useEnums: true,
            });
            await generateReactQueryComponents(context, {
                filenamePrefix,
                schemasFiles,
                useEnums: true,
            });
        },
    },
});
