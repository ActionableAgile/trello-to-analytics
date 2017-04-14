import * as fs from 'fs';
import * as ProgressBar from 'progress';
import { safeLoad, safeDump } from 'js-yaml';
import { argv } from 'yargs';
import { TrelloExtractor } from './src/extractor';

const defaultYamlPath = 'config.yaml';
const defaultOutputPath = 'output.csv';

const bar = new ProgressBar('  Extracting: [:bar] :percent | :eta seconds remaining', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100,
});

const getArgs = () => argv;

const log = (main?: any, ...additionalParams: any[]) => console.log(main, ...additionalParams);

const writeFile = (filePath: string, data: any) =>
  new Promise((accept, reject) => fs.writeFile(filePath, data, (err => err ? reject(err) : accept())));

const run = async function(cliArgs: any): Promise<void> {
  log('ActionableAgile Extraction Tool Starting...');

  const trelloConfigPath: string = cliArgs.i ? cliArgs.i : defaultYamlPath;
  const outputPath: string = cliArgs.o ? cliArgs.o : defaultOutputPath;
  const outputType: string = outputPath.split('.')[1].toUpperCase();
  if (outputType !== 'CSV') {
    throw new Error('Only CSV is supported for file output for the Trello beta');
  }
  // Parse YAML settings
  let settings: any  = {};
  try {
    const yamlConfig = safeLoad(fs.readFileSync(trelloConfigPath, 'utf8'));
    settings = yamlConfig;
  } catch (e) {
    log(`Error parsing settings ${e}`);
    throw e;
  }
  log('Beginning extraction process');

  if (!settings.Key) throw new Error('Trello key not set!');
  if (!settings.Token) throw new Error('Trello token not set!');
  if (!settings.BoardId) throw new Error('Trello BoardId not set!');

  const trelloExtractor = new TrelloExtractor({
    startDate: settings.StartDate,
    workflow: settings.Workflow,
    key: settings.Key,
    token: settings.Token,
  });
  
  const output: string = await trelloExtractor.extractToCSV(settings.BoardId);
  try {
    await writeFile(outputPath, output);
  } catch (e) {
    log(`Error writing trello data to ${outputPath}`);
  }
  log(`Done. Results written to ${outputPath}`);  
};

(async function(args: any): Promise<void> {
  try {
    await run(args);
  } catch (e) {
    log(`Error running ActionableAgile Command Line Tool`);
    log(e);
  }
}(getArgs()));
