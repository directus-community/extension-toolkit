module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:prettier-vue/recommended', 'plugin:vue/essential'],
	plugins: ['prettier'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'prettier/prettier': ['error', { singleQuote: true }],
		'vue/valid-v-slot': 0,
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
				imports: 'always-multiline',
				objects: 'always-multiline',
			},
		],
	},
};
