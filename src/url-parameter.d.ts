declare namespace GoogleAppsScript {
  export interface URLParameter {
    queryString: string;
    parameter: { [key: string]: string };
    parameters: { [key: string]: string[] };
    contextPath: "";
  }

  export interface GetURLParameter extends URLParameter {
    contentLength: -1;
  }

  export interface PostURLParameter extends URLParameter {
    contentLength: number;
    postData: {
      length: number;
      type: string;
      contents: string;
      name: "postData";
    }
  }

}
