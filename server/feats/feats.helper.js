class FeatsHelper {

	applyAuthRules(rawRoutes, authDefault) {
		const routes = {};

		Object.keys(rawRoutes).forEach(routeKey => {
			const route = rawRoutes[routeKey];

			routes[routeKey] = {
				...route,
				auth: (route.auth !== undefined) ? route.auth : authDefault
			};
		});

		return routes;
	}
}

module.exports = new FeatsHelper();
