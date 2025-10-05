import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default [
	// Server bundle
	{
		input: 'server/index.ts', // Change to your server entry point
		output: {
			file: 'release/server.js', // Output server bundle to release/
			format: 'esm', // Use 'esm' for ES modules
			sourcemap: true,
		},
		external: [
			// Node.js built-ins and dependencies you want to keep external
			...require('module').builtinModules,
		],
			plugins: [
				resolve({ preferBuiltins: true }),
				commonjs(),
				json(),
				typescript({ tsconfig: 'tsconfig.server.json' }),
				replace({
					preventAssignment: true,
					values: {
						'process.env.PORT': JSON.stringify('443'),
						'process.env.CLIENT_BUNDLE_PATH': JSON.stringify('client'),
					},
				}),
			],
	},
];

// After building the client with Vite, copy dist/ to release/client/
// The server should statically serve files from release/client/
