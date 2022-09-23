import { handleAdd, handleClear, handleExport, handleGet, handleImport, handleSize } from "~utils/handlers";
import { loadDatabaseAsset } from "~utils/storage";

export {}

loadDatabaseAsset("./assets/database.json");

chrome.runtime.onMessage.addListener(handleImport);

chrome.runtime.onMessage.addListener(handleExport);

chrome.runtime.onMessage.addListener(handleAdd);

chrome.runtime.onMessage.addListener(handleGet);

chrome.runtime.onMessage.addListener(handleSize);

chrome.runtime.onMessage.addListener(handleClear);
