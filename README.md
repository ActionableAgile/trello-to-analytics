# README #
 
# ActionableAgile Trello Import Tool

## Overview ##
The purpose of this software is to extract flow data from Trello and put that data into a proper format for use with the ActionableAgile&trade; Analytics tool (for more information on the ActionableAgile&trade; Analytics tool, please visit [https://www.actionableagile.com](https://www.actionableagile.com) or sign up for a free trial of the tool at [https://www.actionableagile.com/cms/analytics-free-trial-signup.html](https://www.actionableagile.com/cms/analytics-free-trial-signup.html).)  


## Install

### Getting your key and token

First you will need to acquire a key and a token.

* [Generate your developer key][devkey].
* Generate the token by going to `https://trello.com/1/authorize?expiration=never&scope=read&response_type=token&name=ActionableAgile%20Trello%20Analytics%20Extractor&key=KEYHERE` replacing, of course, &lt;KEYHERE&gt; with the developer key obtained in the first step. Follow the prompt to authorize the application, then you will be given the token.

[devkey]: https://trello.com/1/appKey/generate

Next, fill out the Key and Token in the *config.yaml* configuration file.  You can use the `example_config.yaml` to get the basic structure of the configuration file.

## Running the Tool


### Select Board 
Pick the board you would like to run the tool on, and put the board id into the config.yaml configuration file. Your board id can be found in the url to your board. 

E.g: `https://trello.com/b/jHJRcShw/name-of-my-board` is the url to my board. 
Then **jHJRcShw** is the board id.
 
### Run the import tool

Simply run or click the `trello-to-analytics.exe` file and it will generate the analytics file `output.csv` to be used with the ActionableAgile Analytics tool. 

The tool will notify you of any errors encountered. 

### Run the tool from source (Node 6 and TypeScript required)
```
npm install
tsc
node dist/cli.js
```
