export interface WorkItem {
  id: string;
  stageDates: Array<string>;
  name: string;
  type: string;
  domainUrl: string;
  attributes?: any;
};

// Doesn't do a whole lot at the moment, might consider getting rid of it.
const createWorkItem = ({id, stageDates, name, type, domainUrl}): WorkItem => {
  return ({
    id,
    stageDates,
    name,
    type,
    domainUrl,
  });
};

const workItemToCSV = (workItem: WorkItem) => {
  let s = '';
  s += `${workItem.id},`;
  s += `${workItem.domainUrl}/${workItem.id},`;
  s += `${(cleanString(workItem.name))}`;
  workItem.stageDates.forEach(stageDate => s += `,${stageDate}`);
  s += `,${workItem.type}`;
  // No attributes right now.
  // const attributeKeys = Object.keys(this.Attributes);
  // if (attributeKeys.length === 0) {
  //   s += ',';
  // } else {
  //   attributeKeys.forEach(attributeKey => {
  //     s += `,${WorkItem.cleanString(this.Attributes[attributeKey])}`;
  //   });
  // }
  return s;
};

const cleanString = (s: string = ''): string => 
  s.replace(/"/g, '')
   .replace(/'/g, '')
   .replace(/,/g, '')
   .replace(/\\/g, '')
   .trim();

export {
  createWorkItem,
  workItemToCSV,
};