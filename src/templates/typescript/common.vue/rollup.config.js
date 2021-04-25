import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';

export default {
	input: 'src/index.ts',
	output: {
		format: 'es',
		file: 'dist/index.js',
	},
	plugins: [vue(), nodeResolve(), commonjs(), terser()],
};
