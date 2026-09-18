export const isRequired = (value: string) => value.trim().length > 0;

export const hasMinLength = (value: string, min: number) => value.trim().length >= min;

export const hasMaxLength = (value: string, max: number) => value.trim().length <= max;

export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

export const isPhone = (value: string) => {
  if (!value.trim()) return true;
  return /^[+0-9][0-9\s\-()]{7,19}$/.test(value.trim());
};

export const isPositiveNumber = (value: string) => {
  const num = Number(value);
  return value.trim() !== '' && Number.isFinite(num) && num > 0;
};
