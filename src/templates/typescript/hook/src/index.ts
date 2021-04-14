import { HookRegisterFunction, EventHandlerArguments } from './types';
import axios from 'axios';

const registerHook: HookRegisterFunction = ({ services, exceptions }) => {
	const { ServiceUnavailableException, ForbiddenException } = exceptions;

	return {
		// Force everything to be admin-only at all times
		'items.*': async function ({ item, accountability }: EventHandlerArguments) {
			if (accountability.admin !== true) throw new ForbiddenException();
		},
		// Sync with external recipes service, cancel creation on failure
		'items.create.before': async function (input, { collection }) {
			if (collection !== 'recipes') return input;

			try {
				await axios.post('https://example.com/recipes', input);
			} catch (error) {
				throw new ServiceUnavailableException(error, {
					service: 'my-custom-extension',
				});
			}

			input[0].syncedWithExample = true;

			return input;
		},
	};
};

export default registerHook;
