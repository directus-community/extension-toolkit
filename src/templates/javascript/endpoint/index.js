module.exports = function registerEndpoint(router, { services, exceptions }) {
	const { ItemsService } = services;
	const { ServiceUnavailableException } = exceptions;

	router.get('/', (req, res, next) => {
		const recipeService = new ItemsService('recipes', {
			schema: req.schema,
			accountability: req.accountability,
		});

		recipeService
			.readByQuery({ sort: 'name', fields: ['*'] })
			.then((results) => res.json(results))
			.catch((error) => {
				return next(new ServiceUnavailableException(error.message));
			});
	});
};
