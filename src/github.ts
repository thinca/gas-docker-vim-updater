import Fetch = GoogleAppsScript.URL_Fetch;

const methodType: Fetch.URLFetchRequestOptions = {};
type HTTPMethod = typeof methodType.method;
interface HTTPHeaders {
  [key: string]: string;
}
interface PayloadObject {
  [key: string]: Payload;
}
type Payload = string | number | boolean | PayloadObject;

class Client {
  constructor(private token: string) {
  }

  public sendAPIRequest(url: string, method: HTTPMethod = "get", payload?: Payload) {
    const options: Fetch.URLFetchRequestOptions = {
      contentType: "application/json",
      headers: {
        Authorization: "token " + this.token,
        Accept: "application/vnd.github.v3+json",
      },
      method,
    };
    if (payload) {
      options.payload = JSON.stringify(payload);
    }

    Logger.log("%s %s\n\n%s", method.toUpperCase(), url, options.payload || "");

    const response = UrlFetchApp.fetch(url, options);

    const content = response.getContentText();
    const headers = response.getHeaders() as HTTPHeaders;
    const headerKeys = Object.keys(headers);
    const lines: string[] = [];
    for (const key of headerKeys) {
      lines.push(`${key}: ${headers[key]}`);
    }
    Logger.log("%s\n%s\n\n%s\n", response.getResponseCode(), lines.join("\n"), content);
    const contentType = headers["Content-Type"];
    if (contentType && /^application\/json(?:;.*)?$/.test(contentType.toLowerCase())) {
      return JSON.parse(content);
    }
    return content;
  }
}

export class ReposClient extends Client {
  constructor(token: string, public readonly repoName: string) {
    super(token);
  }

  public dispatchWorkflow(workflowId: string, inputs: {[key: string]: string}) {
    const url = `https://api.github.com/repos/${this.repoName}/actions/workflows/${workflowId}/dispatches`;
    const ref = `refs/heads/master`;
    const payload = {ref, inputs};
    this.sendAPIRequest(url, "post", payload);
  }
}
