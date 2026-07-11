export const nextTokenVersion = (current: unknown) => {
  const version = Number(current);
  return Number.isInteger(version) && version >= 0 ? version + 1 : 1;
};
