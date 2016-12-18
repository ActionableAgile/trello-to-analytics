import { WorkItem, createWorkItem, workItemToCSV } from './work-item';
import { addMoreDetailToCardEventLog, addStagingDates } from './helper';
import { getBoardsFromAuthedUserUrl, getBoardHistory, getBoardCards } from './api';
import { Workflow, Card, Board, TrelloConfig } from './types';

class TrelloExtractor {
  private readonly baseUrl: string = 'https://api.trello.com';
  private key: string;
  private token: string;
  private workflow: Workflow;

  constructor(config: TrelloConfig) {
    this.key = config.key;
    this.token = config.token;
    this.workflow = config.workflow;
  }

  public async getAuthedUsersProjects(): Promise<Board[]> {
    return await getBoardsFromAuthedUserUrl(this.baseUrl, { key: this.key, token: this.token });
  }

  public async getBoardHistory(boardId: string) {
    return await getBoardHistory(boardId, this.baseUrl, { key: this.key, token: this.token });
  }

  public async getBoardCards(boardId: string): Promise<Card[]> {
    const cards: Card[] = await getBoardCards(boardId, this.baseUrl, { key: this.key, token: this.token });
    if (cards.length >= 1000) {
      console.warn(`Warning, api fetching cards is capped at 1000, and we detect you may have more than that`);
    }
    return cards;
  }

  public async extractToCSV(boardId: string) {
    const workflow: Workflow = this.workflow;
    const boardCards: Card[] = await getBoardCards(boardId, this.baseUrl, { key: this.key, token: this.token });
    const workItems: WorkItem[] = boardCards
                                    .map(addMoreDetailToCardEventLog)
                                    .map(card => addStagingDates(card, workflow))
                                    .map(card => convertCardToWorkItem(card, this.baseUrl));

    const csvHeader: string = `ID,Link,Name,${Object.keys(workflow).join(',')},Type`;
    const csvBody: string = workItems
                      .map(workItemToCSV)
                      .join('\n');
    const csv: string = `${csvHeader}\n${csvBody}`;
    return csv;
  }
};

const convertCardToWorkItem = (c: Card, domainUrl: string): WorkItem => {
  return createWorkItem({
    id: c.id,
    name: c.name,
    stageDates: c['stagingDates'],
    domainUrl,
    type: '',
  });
};

export {
  TrelloExtractor,
};