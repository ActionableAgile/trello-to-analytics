export interface Board {
  name: string;
  id: string;
  url: string;
};

export interface Card {
  id: string;
  due: string;
  closed: boolean;
  name: string;
  labels: Array<any>;
  url: string;
  actions: Array<Action>;
};

export interface Action {
  id: string;
  idMemberCreator: string;
  data: any;
  type: string;
  date: string;
  memberCreator: any;
  list?: {
    id: string;
    name: string;
  }
};

export interface Workflow {
  [category: string]: Array<string>;
};

export interface TypesConfig {
  default: string;
  labels: Array<string>;
};

export interface ActionsByWorkflow {
  [workflowCategory: string]: Array<Action>;
};

export interface TrelloConfig {
  startDate: string;
  workflow: Workflow;
  key: string;
  token: string;
  types: TypesConfig;
};

export interface BoardHistory { 
  id: string;
  idMemberCreator: string;
  data: {};
  type: string;
  date: string;
  memberCreator: any;
};