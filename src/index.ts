import {FeedReader, SpreadsheetStore} from "gas-feed";
import {ReposClient} from "./github";

const props = PropertiesService.getScriptProperties();
const WATCH_TARGET = props.getProperty("WATCH_TARGET");
const GITHUB_REPO_NAME = props.getProperty("GITHUB_REPO_NAME");
const GITHUB_TOKEN = props.getProperty("GITHUB_TOKEN");
const SPREADSHEET_ID = props.getProperty("SPREADSHEET_ID");
const SHEET_NAME = props.getProperty("SHEET_NAME");
const BUILD_BRANCH = "master";

function checkNewCommit() {
  if (GITHUB_TOKEN == null || GITHUB_REPO_NAME == null ||
      SPREADSHEET_ID == null || SHEET_NAME == null || WATCH_TARGET == null) {
    return;
  }
  const store = new SpreadsheetStore(SPREADSHEET_ID, SHEET_NAME);
  const reader = new FeedReader(WATCH_TARGET, store);
  const firstTime = store.isEmpty();
  const newlyFeeds = reader.fetch();;

  if (firstTime) {
    return;
  }
  const client = new ReposClient(GITHUB_TOKEN, GITHUB_REPO_NAME);
  let sha;
  for (const feed of newlyFeeds) {
    const title = feed.title;
    const matchResult = /^patch ([\d.]+):/.exec(title);
    if (matchResult == null) {
      continue;
    }
    const version = `v${matchResult[1]}`;
    sha = sha || client.getSHAFromBranch(BUILD_BRANCH);
    client.createTag(version, sha);
  }
  reader.save();
}

declare var global: any;
global.checkNewCommit = checkNewCommit;
