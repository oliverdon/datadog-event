const core = require("@actions/core");
const http = require("@actions/http-client");

(async () => {
  try {
    const time = new Date().toTimeString();
    core.setOutput("time", time);
    const ddApiKey = core.getInput("apikey", { required: true });

    let payload = {
      title: core.getInput("title", { required: true }),
      text: core.getInput("text", { required: true }),
      priority: core.getInput("priority") || "normal",
      alert_type: core.getInput("alert-type") || "info",
    };

    const tags = core.getInput("tags");
    if (tags) payload.tags = tags;

    const httpClient = new http.HttpClient();
    let url = "https://api.datadoghq.com/api/v1/events";
    const euApi = core.getInput("datacenter") === "EU";
    if (euApi) {
      url = "https://api.datadoghq.eu/api/v1/events";
    }

    httpClient.requestOptions = {
      headers: {
        "DD-API-KEY": ddApiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return await httpClient.postJson(url, payload);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
