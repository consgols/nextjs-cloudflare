export const isSingleBlankArray = (arr: WorkExperience[]) => {
  return Array.isArray(arr) && arr.length === 1 && Object.values(arr[0]).every(value => value === '');
};
