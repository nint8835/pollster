/** @type {import("prettier").Config} */
export default {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    importOrder: ['^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
