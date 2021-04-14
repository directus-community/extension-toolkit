import { HookRegisterFunction, ExtensionContext } from 'directus/dist/types/extensions';
import { Accountability } from 'directus/dist/types/accountability';
import { SchemaOverview } from 'directus/dist/types/schema';

declare type Action = 'create' | 'update' | 'delete';

declare type EventHandlerArguments = {
	event: string;
	accountability: Accountability;
	collection: string;
	item: string;
	action: Action;
	payload: unknown;
	schema: SchemaOverview;
	database: ExtensionContext['database'];
};

export { HookRegisterFunction, EventHandlerArguments };
