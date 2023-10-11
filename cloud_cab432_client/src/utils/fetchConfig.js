export async function fetchConfig() {
  const response = await fetch(process.env.PUBLIC_URL + "/config.json");
  const config = await response.json();
  return config["backendAPI"];
}
