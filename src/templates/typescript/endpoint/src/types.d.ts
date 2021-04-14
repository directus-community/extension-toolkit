import { Accountability, Query, SchemaOverview } from 'directus/dist/types';
import { EndpointRegisterFunction } from 'directus/dist/types/extensions';

declare global {
	namespace Express {
		export interface Request {
			token: string | null;
			collection: string;
			sanitizedQuery: Query;
			schema: SchemaOverview;

			accountability?: Accountability;
			singleton?: boolean;
		}
	}
}

export { EndpointRegisterFunction };
