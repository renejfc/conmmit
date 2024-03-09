export type TextOptions = {
  message: string
  placeholder?: string
  defaultValue?: string
  initialValue?: string
  validate?: (value: string) => string | void
}

export type PasswordOptions = {
	message: string;
	mask?: string;
	validate?: (value: string) => string | void;
}

export type ConfirmOptions = {
	message: string;
	active?: string;
	inactive?: string;
	initialValue?: boolean;
}