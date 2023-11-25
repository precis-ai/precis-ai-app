export const truncate = (input: string, maxAllowedLength: number) =>
  input?.length > maxAllowedLength
    ? `${input?.substring(0, maxAllowedLength)}...`
    : input;

export const humanize = (value: string) =>
  value.replace(/^[\s_]+|[\s_]+$/g, "").replace(/[_\s]+/g, " ");

export const validateEmail = (email: string) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

export const titleCase = (value: string) => {
  return value.substring(0, 1).toUpperCase() + value.substring(1);
};

export const wrapHTMLContent = (content = "") => {
  let wrappedContent = content;

  wrappedContent = wrappedContent.replace(/<\/?ul>/g, "");

  return wrappedContent;
};
