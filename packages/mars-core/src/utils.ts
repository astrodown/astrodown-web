export const showError = (error: unknown): string => {
	return error instanceof Error ? error.message : String(error);
};

export const classNames = (...classes: string[]) => {
	return classes.filter(Boolean).join(" ");
};

export const replaceAngleBrackets = (str: string) => {
	return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}