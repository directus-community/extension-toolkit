import { HookRegisterFunction } from 'directus/dist/types/extensions';
import { Accountability } from 'directus/dist/types/accountability';
import { SchemaOverview } from 'directus/dist/types/schema';
import { Knex } from 'knex';

declare type Action = 'create' | 'update' | 'delete';

declare type EventHandlerArguments = {
	event: string;
	accountability: Accountability;
	collection: string;
	item: string;
	action: Action;
	payload: unknown;
	schema: SchemaOverview;
	database: Knex;
};

export { HookRegisterFunction, EventHandlerArguments };
