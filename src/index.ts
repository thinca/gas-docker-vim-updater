import {FeedReader, SpreadsheetStore} from "gas-feed";
import {ReposClient} from "./github";

const props = PropertiesService.getScriptProperties();
const WATCH_TARGET = props.getProperty("WATCH_TARGET");
const DOCKER_REPO_NAME = props.getProperty("DOCKER_REPO_NAME");
const GITHUB_REPO_NAME = props.getProperty("GITHUB_REPO_NAME");
const GITHUB_TOKEN = props.getProperty("GITHUB_TOKEN");
const SPREADSHEET_ID = props.getProperty("SPREADSHEET_ID");
const SHEET_NAME = props.getProperty("SHEET_NAME");
const BUILD_BRANCH = "master";

interface DockerWebHookPayload {
  callback_url: string;
  push_data: {
    images: string[];
    pushed_at: number;
    pusher: string;
    tag: string;
  };
  repository: {
    comment_count: string;
    date_created: number;
    description: string;
    dockerfile: string;
    full_description: string;
    is_official: boolean;
    is_private: boolean;
    is_trusted: boolean;
    name: string;
    namespace: string;
    owner: string;
    repo_name: string;
    repo_url: string;
    star_count: number;
    status: string;
  };
}

function doPost(e: GoogleAppsScript.PostURLParameter) {
  if (GITHUB_TOKEN == null || GITHUB_REPO_NAME == null) {
    return;
  }
  Logger.log(e.postData.type);
  Logger.log(e.postData.contents);
  if (e.postData.type.toLocaleLowerCase() !== "application/json") {
    return ContentService.createTextOutput("Content-Type is wrong");
  }
  const payload: DockerWebHookPayload = JSON.parse(e.postData.contents);
  const repo_name = payload.repository.repo_name;
  if (repo_name !== DOCKER_REPO_NAME) {
    return ContentService.createTextOutput("Repository is not a target.");
  }
  const tag = payload.push_data.tag;
  if (!/^v[\d.]+$/.test(tag)) {
    return ContentService.createTextOutput("Ignoring the tag");
  }
  const client = new ReposClient(GITHUB_TOKEN, GITHUB_REPO_NAME);
  client.deleteTag(tag);
  return ContentService.createTextOutput("OK");
}

function checkNewCommit() {
  if (GITHUB_TOKEN == null || GITHUB_REPO_NAME == null ||
      SPREADSHEET_ID == null || SHEET_NAME == null || WATCH_TARGET == null) {
    return;
  }
  const store = new SpreadsheetStore(SPREADSHEET_ID, SHEET_NAME);
  const f = new FeedReader(WATCH_TARGET, store);
  const firstTime = store.isEmpty();
  f.fetch();
  const newlyFeeds = f.getNewlyEntries();

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
}

declare var global: any;
global.doPost = doPost;
global.checkNewCommit = checkNewCommit;
