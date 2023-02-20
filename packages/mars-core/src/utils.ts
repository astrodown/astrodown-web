export const showError = (error: unknown): string => {
	return error instanceof Error ? error.message : String(error);
};

export const classNames = (...classes: string[]) => {
	return classes.filter(Boolean).join(" ");
};
