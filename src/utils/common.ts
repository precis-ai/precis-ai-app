export const validateEmail = (email: string) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

export const validatePhone = (phone: string) =>
  phone && phone?.match(/\d/g)?.length === 10;

export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const isValidUrl = (url: string) => {
  let isValid = false;

  try {
    new URL(url); // eslint-disable-line
    isValid = true;
  } catch (_) {
    return false;
  }

  return isValid;
};

export const wrapFullName = (firstName: string, lastName?: string) =>
  `${firstName}${lastName ? ` ${lastName}` : ""}`;

export const wrapNameTwoLetters = (firstName: string, lastName?: string) =>
  firstName
    ? `${Array.from(firstName)[0]}${lastName ? Array.from(lastName)[0] : ""}`
    : "";

export const scrollToTop = () => {
  // eslint-disable-next-line
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

export const openInNewTab = (url: string) => window.open(url, "_blank");
