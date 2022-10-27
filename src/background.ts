import {
    handleAdd,
    handleClear,
    handleExport,
    handleGet,
    handleImport,
    handleSize
} from "~db/utils/handlers"

export {}

chrome.runtime.onMessage.addListener(handleImport)

chrome.runtime.onMessage.addListener(handleExport)

chrome.runtime.onMessage.addListener(handleAdd)

chrome.runtime.onMessage.addListener(handleGet)

chrome.runtime.onMessage.addListener(handleSize)

chrome.runtime.onMessage.addListener(handleClear)
