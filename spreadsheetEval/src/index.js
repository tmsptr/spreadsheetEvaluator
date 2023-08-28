const axios = require("axios");
const hubAddress =
  "http://localhost:3001"
const { processSheets } = require("./sheetProcessor");

const getUrl = `${hubAddress}/sheets`;
const submitUrl = `<>`;

async function fetchData() {
  try {
    const response = await axios.get(getUrl);
    const initialReturn = response.data;
    await processData(initialReturn.sheets);
  } catch (error) {
    console.log(error);
  }
}

async function processData(sheets) {
  try {
    const returnedSheets = processSheets(sheets);
    const newObject = {
      email: "spreval@gmail.com",
      results: returnedSheets,
    };
    await submitData(newObject);
  } catch (error) {
    console.log(error);
  }
}

async function submitData(data) {
  try {
    const jsonData = JSON.stringify(data);
    const response = await axios.post(submitUrl, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.message);
  } catch (error) {
    console.log(error);
  }
}

async function start() {
  await fetchData();
}

start();
