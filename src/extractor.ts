import { WorkItem, createWorkItem, workItemToCSV } from './work-item';
import { addMoreDetailToCardEventLog, addStagingDates } from './helper';
import { getBoardsFromAuthedUserUrl, getBoardHistory, getBoardCards } from './api';
import { Workflow, TypesConfig, Card, Label, Board, TrelloConfig } from './types';

class TrelloExtractor {
  private readonly baseUrl: string = 'https://api.trello.com';
  private key: string;
  private token: string;
  private workflow: Workflow;
  private startDate: string;
  private typesConfig: TypesConfig;

  constructor(config: TrelloConfig) {
    this.startDate = config.startDate;
    this.key = config.key;
    this.token = config.token;
    this.workflow = config.workflow;
    this.typesConfig = config.types;
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
    const options = { key: this.key, token: this.token }
    if (this.startDate) {
      options['since'] = this.startDate;
    }
    
    const boardCards: Card[] = await getBoardCards(boardId, this.baseUrl, options);
    const workItems: WorkItem[] = boardCards
                                    .map(addMoreDetailToCardEventLog)
                                    .map(card => addStagingDates(card, workflow))
                                    .map(card => this.convertCardToWorkItem(card));

    const csvHeader: string = `ID,Link,Name,${Object.keys(workflow).join(',')},Type`;
    const csvBody: string = workItems
                      .map(workItemToCSV)
                      .join('\n');
    const csv: string = `${csvHeader}\n${csvBody}`;
    return csv;
  }

  mapLabelsToType(labels: Array<Label>) {
    for(let label of labels) {
      if(this.typesConfig.labels.indexOf(label.name) >= 0) {
        return label.name;
      } 
    }
    return this.typesConfig.default;
  }

  convertCardToWorkItem(c: Card) {
    return createWorkItem({
      id: c.id,
      name: c.name,
      stageDates: c['stagingDates'],
      domainUrl: this.baseUrl,
      type: this.mapLabelsToType(c.labels),
    });
  };
};


export {
  TrelloExtractor,
};
