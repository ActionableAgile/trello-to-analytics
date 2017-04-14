import 'isomorphic-fetch';
import { Board, Card, BoardHistory } from './types';

interface IOptions {
  key: string;
  token: string;
  since?: string;
  [option: string]: any;
};

const API_VERSION = '1';

const getJsonFromTrelloApi = async (url: string): Promise<any> => {
  const response: Response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return await response.json();
};

const getBoardsFromAuthedUserUrl = async (baseUrl: string, options: IOptions): Promise<Board[]> => {
  const resourceUrl = `${baseUrl}/${API_VERSION}/member/me/boards`;
  const { key, token } = options;
  if (!key || !token) {
    console.log('No key and token found, no other auth is supported');
    throw new Error('Key and Token not found on options');
  }
  const url = addQueryParamsToUrl(resourceUrl, {key, token});
  const boards: Board[] = await getJsonFromTrelloApi(url);
  return boards;
};

const getBoardCards = async (boardId: string, baseUrl: string, options: IOptions): Promise<Card[]> => {
  const resourceUrl = `${baseUrl}/${API_VERSION}/boards/${boardId}/cards`;
  const queryParams = Object.assign({}, options, { actions: 'createCard,updateCard:idList,updateCard:closed', filter: 'all', limit: '1000' });
  const url = addQueryParamsToUrl(resourceUrl, queryParams);
  const cards: Card[] = await getJsonFromTrelloApi(url);
  return cards;
};

const getBoardHistory = async (boardId: string, baseUrl: string, options: IOptions): Promise<BoardHistory[]> => {
  const resourceUrl = `${baseUrl}/${API_VERSION}/boards/${boardId}/actions`;
  const queryParams = Object.assign({}, options, { filter: 'createCard,updateCard:idList,updateCard:closed', limit: '1000' });
  const url = addQueryParamsToUrl(resourceUrl, queryParams);
  const boardHistory: BoardHistory[] = await getJsonFromTrelloApi(url);
  return boardHistory;
};

// theres also /1/boards/[board_id]/lists
// https://developers.trello.com/advanced-reference/board#get-1-boards-board-id-cards
// see which one is better... thhis fn is not currently in use...
// const getBoardInformation = async (boardId: string, baseUrl: string, options: IOptions) => {
//   const resourceUrl = `${baseUrl}/${API_VERSION}/boards/${boardId}`;
//   const queryParams = Object.assign({}, options, { lists: 'all' });
//   const url = addQueryParamsToUrl(resourceUrl, queryParams);
//   const boardInfo: any = await getJson(url);
//   return boardInfo;
// };

const convertKeyValToQueryString = (params: { [param: string]: string; }): string => {
  const esc = encodeURIComponent;
  const query: string = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  return query;
};

const addQueryParamsToUrl = (url: string, queryParamsObject: any): string => 
  `${url}?${convertKeyValToQueryString(queryParamsObject)}`;

export {
  getBoardsFromAuthedUserUrl,
  getBoardHistory,
  getBoardCards,
};
