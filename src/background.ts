import { AccessValidator } from "~core/utils/access-validator";
import { handleAdd, handleClear, handleExport, handleGet, handleImport, handleNotification, handleSize } from "~db/utils/handlers";

export {};

chrome.runtime.onMessage.addListener(handleImport);

chrome.runtime.onMessage.addListener(handleExport);

chrome.runtime.onMessage.addListener(handleAdd);

chrome.runtime.onMessage.addListener(handleGet);

chrome.runtime.onMessage.addListener(handleSize);

chrome.runtime.onMessage.addListener(handleClear);

chrome.runtime.onMessage.addListener(handleNotification);

// @ts-ignore - IDE can't find setAccessLevel
chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });
AccessValidator.syncServer().then();
