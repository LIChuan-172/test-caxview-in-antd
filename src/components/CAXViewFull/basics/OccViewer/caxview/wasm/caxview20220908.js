export default function createCreator() {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename
  return function (createOccViewerModule) {
    createOccViewerModule = createOccViewerModule || {}

    var Module =
      typeof createOccViewerModule !== "undefined" ? createOccViewerModule : {}
    var readyPromiseResolve, readyPromiseReject
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve
      readyPromiseReject = reject
    })
    var moduleOverrides = {}
    var key
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
      }
    }
    var arguments_ = []
    var thisProgram = "./this.program"
    var quit_ = function (status, toThrow) {
      throw toThrow
    }
    var ENVIRONMENT_IS_WEB = false
    var ENVIRONMENT_IS_WORKER = false
    var ENVIRONMENT_IS_NODE = false
    var ENVIRONMENT_IS_SHELL = false
    ENVIRONMENT_IS_WEB = typeof window === "object"
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function"
    ENVIRONMENT_IS_NODE =
      typeof process === "object" &&
      typeof process.versions === "object" &&
      typeof process.versions.node === "string"
    ENVIRONMENT_IS_SHELL =
      !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER
    var scriptDirectory = ""
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
      }
      return scriptDirectory + path
    }
    var read_, readAsync, readBinary, setWindowTitle
    var nodeFS
    var nodePath
    if (ENVIRONMENT_IS_NODE) {
      // if (ENVIRONMENT_IS_WORKER) {
      //   scriptDirectory = require("path").dirname(scriptDirectory) + "/";
      // } else {
      //   scriptDirectory = __dirname + "/";
      // }
      // read_ = function shell_read(filename, binary) {
      //   if (!nodeFS) nodeFS = require("fs");
      //   if (!nodePath) nodePath = require("path");
      //   filename = nodePath["normalize"](filename);
      //   return nodeFS["readFileSync"](filename, binary ? null : "utf8");
      // };
      // readBinary = function readBinary(filename) {
      //   var ret = read_(filename, true);
      //   if (!ret.buffer) {
      //     ret = new Uint8Array(ret);
      //   }
      //   assert(ret.buffer);
      //   return ret;
      // };
      // if (process["argv"].length > 1) {
      //   thisProgram = process["argv"][1].replace(/\\/g, "/");
      // }
      // arguments_ = process["argv"].slice(2);
      // process["on"]("uncaughtException", function (ex) {
      //   if (!(ex instanceof ExitStatus)) {
      //     throw ex;
      //   }
      // });
      // process["on"]("unhandledRejection", abort);
      // quit_ = function (status) {
      //   process["exit"](status);
      // };
      // Module["inspect"] = function () {
      //   return "[Emscripten Module object]";
      // };
    } else if (ENVIRONMENT_IS_SHELL) {
      // if (typeof read != "undefined") {
      //   read_ = function shell_read(f) {
      //     return read(f);
      //   };
      // }
      // readBinary = function readBinary(f) {
      //   var data;
      //   if (typeof readbuffer === "function") {
      //     return new Uint8Array(readbuffer(f));
      //   }
      //   data = read(f, "binary");
      //   assert(typeof data === "object");
      //   return data;
      // };
      // if (typeof scriptArgs != "undefined") {
      //   arguments_ = scriptArgs;
      // } else if (typeof arguments != "undefined") {
      //   arguments_ = arguments;
      // }
      // if (typeof quit === "function") {
      //   quit_ = function (status) {
      //     quit(status);
      //   };
      // }
      // if (typeof print !== "undefined") {
      //   if (typeof console === "undefined") console = {};
      //   console.log = print;
      //   console.warn = console.error =
      //     typeof printErr !== "undefined" ? printErr : print;
      // }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
      } else if (typeof document !== "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.lastIndexOf("/") + 1
        )
      } else {
        scriptDirectory = ""
      }
      {
        read_ = function shell_read(url) {
          var xhr = new XMLHttpRequest()
          xhr.open("GET", url, false)
          xhr.send(null)
          return xhr.responseText
        }
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = function readBinary(url) {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", url, false)
            xhr.responseType = "arraybuffer"
            xhr.send(null)
            return new Uint8Array(xhr.response)
          }
        }
        readAsync = function readAsync(url, onload, onerror) {
          var xhr = new XMLHttpRequest()
          xhr.open("GET", url, true)
          xhr.responseType = "arraybuffer"
          xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response)
              return
            }
            onerror()
          }
          xhr.onerror = onerror
          xhr.send(null)
        }
      }
      setWindowTitle = function (title) {
        document.title = title
      }
    } else {
    }
    var out = Module["print"] || console.log.bind(console)
    var err = Module["printErr"] || console.warn.bind(console)
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
      }
    }
    moduleOverrides = null
    if (Module["arguments"]) arguments_ = Module["arguments"]
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"]
    if (Module["quit"]) quit_ = Module["quit"]
    var STACK_ALIGN = 16
    function alignMemory(size, factor) {
      if (!factor) factor = STACK_ALIGN
      return Math.ceil(size / factor) * factor
    }
    function warnOnce(text) {
      if (!warnOnce.shown) warnOnce.shown = {}
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1
        err(text)
      }
    }
    function convertJsFunctionToWasm(func, sig) {
      if (typeof WebAssembly.Function === "function") {
        var typeNames = { i: "i32", j: "i64", f: "f32", d: "f64" }
        var type = {
          parameters: [],
          results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
        }
        for (var i = 1; i < sig.length; ++i) {
          type.parameters.push(typeNames[sig[i]])
        }
        return new WebAssembly.Function(type, func)
      }
      var typeSection = [1, 0, 1, 96]
      var sigRet = sig.slice(0, 1)
      var sigParam = sig.slice(1)
      var typeCodes = { i: 127, j: 126, f: 125, d: 124 }
      typeSection.push(sigParam.length)
      for (var i = 0; i < sigParam.length; ++i) {
        typeSection.push(typeCodes[sigParam[i]])
      }
      if (sigRet == "v") {
        typeSection.push(0)
      } else {
        typeSection = typeSection.concat([1, typeCodes[sigRet]])
      }
      typeSection[1] = typeSection.length - 2
      var bytes = new Uint8Array(
        [0, 97, 115, 109, 1, 0, 0, 0].concat(
          typeSection,
          [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]
        )
      )
      var wasmModule = new WebAssembly.Module(bytes)
      var instance = new WebAssembly.Instance(wasmModule, { e: { f: func } })
      var wrappedFunc = instance.exports["f"]
      return wrappedFunc
    }
    var freeTableIndexes = []
    var functionsInTableMap
    function getEmptyTableSlot() {
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop()
      }
      try {
        wasmTable.grow(1)
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err
        }
        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
      }
      return wasmTable.length - 1
    }
    function addFunctionWasm(func, sig) {
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap()
        for (var i = 0; i < wasmTable.length; i++) {
          var item = wasmTable.get(i)
          if (item) {
            functionsInTableMap.set(item, i)
          }
        }
      }
      if (functionsInTableMap.has(func)) {
        return functionsInTableMap.get(func)
      }
      var ret = getEmptyTableSlot()
      try {
        wasmTable.set(ret, func)
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err
        }
        var wrapped = convertJsFunctionToWasm(func, sig)
        wasmTable.set(ret, wrapped)
      }
      functionsInTableMap.set(func, ret)
      return ret
    }
    var tempRet0 = 0
    var setTempRet0 = function (value) {
      tempRet0 = value
    }
    var getTempRet0 = function () {
      return tempRet0
    }
    var wasmBinary
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"]
    var noExitRuntime
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"]
    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected")
    }
    var wasmMemory
    var ABORT = false
    var EXITSTATUS
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text)
      }
    }
    function getCFunc(ident) {
      var func = Module["_" + ident]
      assert(
        func,
        "Cannot call unknown function " + ident + ", make sure it is exported"
      )
      return func
    }
    function ccall(ident, returnType, argTypes, args, opts) {
      var toC = {
        string: function (str) {
          var ret = 0
          if (str !== null && str !== undefined && str !== 0) {
            var len = (str.length << 2) + 1
            ret = stackAlloc(len)
            stringToUTF8(str, ret, len)
          }
          return ret
        },
        array: function (arr) {
          var ret = stackAlloc(arr.length)
          writeArrayToMemory(arr, ret)
          return ret
        }
      }
      function convertReturnValue(ret) {
        if (returnType === "string") return UTF8ToString(ret)
        if (returnType === "boolean") return Boolean(ret)
        return ret
      }
      var func = getCFunc(ident)
      var cArgs = []
      var stack = 0
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]]
          if (converter) {
            if (stack === 0) stack = stackSave()
            cArgs[i] = converter(args[i])
          } else {
            cArgs[i] = args[i]
          }
        }
      }
      var ret = func.apply(null, cArgs)
      ret = convertReturnValue(ret)
      if (stack !== 0) stackRestore(stack)
      return ret
    }
    var ALLOC_STACK = 1
    function allocate(slab, allocator) {
      var ret
      if (allocator == ALLOC_STACK) {
        ret = stackAlloc(slab.length)
      } else {
        ret = _malloc(slab.length)
      }
      if (slab.subarray || slab.slice) {
        HEAPU8.set(slab, ret)
      } else {
        HEAPU8.set(new Uint8Array(slab), ret)
      }
      return ret
    }
    var UTF8Decoder =
      typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined
    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead
      var endPtr = idx
      while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr
      if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr))
      } else {
        var str = ""
        while (idx < endPtr) {
          var u0 = heap[idx++]
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0)
            continue
          }
          var u1 = heap[idx++] & 63
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1)
            continue
          }
          var u2 = heap[idx++] & 63
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2
          } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63)
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0)
          } else {
            var ch = u0 - 65536
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
          }
        }
      }
      return str
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0
      var startIdx = outIdx
      var endIdx = outIdx + maxBytesToWrite - 1
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i)
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i)
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023)
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break
          heap[outIdx++] = u
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break
          heap[outIdx++] = 192 | (u >> 6)
          heap[outIdx++] = 128 | (u & 63)
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break
          heap[outIdx++] = 224 | (u >> 12)
          heap[outIdx++] = 128 | ((u >> 6) & 63)
          heap[outIdx++] = 128 | (u & 63)
        } else {
          if (outIdx + 3 >= endIdx) break
          heap[outIdx++] = 240 | (u >> 18)
          heap[outIdx++] = 128 | ((u >> 12) & 63)
          heap[outIdx++] = 128 | ((u >> 6) & 63)
          heap[outIdx++] = 128 | (u & 63)
        }
      }
      heap[outIdx] = 0
      return outIdx - startIdx
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
    }
    function lengthBytesUTF8(str) {
      var len = 0
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i)
        if (u >= 55296 && u <= 57343)
          u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023)
        if (u <= 127) ++len
        else if (u <= 2047) len += 2
        else if (u <= 65535) len += 3
        else len += 4
      }
      return len
    }
    var UTF16Decoder =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-16le")
        : undefined
    function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr
      var idx = endPtr >> 1
      var maxIdx = idx + maxBytesToRead / 2
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx
      endPtr = idx << 1
      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr))
      } else {
        var str = ""
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[(ptr + i * 2) >> 1]
          if (codeUnit == 0) break
          str += String.fromCharCode(codeUnit)
        }
        return str
      }
    }
    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647
      }
      if (maxBytesToWrite < 2) return 0
      maxBytesToWrite -= 2
      var startPtr = outPtr
      var numCharsToWrite =
        maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i)
        HEAP16[outPtr >> 1] = codeUnit
        outPtr += 2
      }
      HEAP16[outPtr >> 1] = 0
      return outPtr - startPtr
    }
    function lengthBytesUTF16(str) {
      return str.length * 2
    }
    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0
      var str = ""
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(ptr + i * 4) >> 2]
        if (utf32 == 0) break
        ++i
        if (utf32 >= 65536) {
          var ch = utf32 - 65536
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
        } else {
          str += String.fromCharCode(utf32)
        }
      }
      return str
    }
    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647
      }
      if (maxBytesToWrite < 4) return 0
      var startPtr = outPtr
      var endPtr = startPtr + maxBytesToWrite - 4
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i)
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i)
          codeUnit =
            (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023)
        }
        HEAP32[outPtr >> 2] = codeUnit
        outPtr += 4
        if (outPtr + 4 > endPtr) break
      }
      HEAP32[outPtr >> 2] = 0
      return outPtr - startPtr
    }
    function lengthBytesUTF32(str) {
      var len = 0
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i)
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i
        len += 4
      }
      return len
    }
    function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1
      var ret = _malloc(size)
      if (ret) stringToUTF8Array(str, HEAP8, ret, size)
      return ret
    }
    function writeArrayToMemory(array, buffer) {
      HEAP8.set(array, buffer)
    }
    function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
      }
      if (!dontAddNull) HEAP8[buffer >> 0] = 0
    }
    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - (x % multiple)
      }
      return x
    }
    var buffer,
      HEAP8,
      HEAPU8,
      HEAP16,
      HEAPU16,
      HEAP32,
      HEAPU32,
      HEAPF32,
      HEAPF64
    function updateGlobalBufferAndViews(buf) {
      buffer = buf
      Module["HEAP8"] = HEAP8 = new Int8Array(buf)
      Module["HEAP16"] = HEAP16 = new Int16Array(buf)
      Module["HEAP32"] = HEAP32 = new Int32Array(buf)
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf)
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf)
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf)
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf)
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216
    var wasmTable
    var __ATPRERUN__ = []
    var __ATINIT__ = []
    var __ATMAIN__ = []
    var __ATEXIT__ = []
    var __ATPOSTRUN__ = []
    var runtimeInitialized = false
    var runtimeExited = false
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]]
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift())
        }
      }
      callRuntimeCallbacks(__ATPRERUN__)
    }
    function initRuntime() {
      runtimeInitialized = true
      if (!Module["noFSInit"] && !FS.init.initialized) FS.init()
      TTY.init()
      callRuntimeCallbacks(__ATINIT__)
    }
    function preMain() {
      FS.ignorePermissions = false
      callRuntimeCallbacks(__ATMAIN__)
    }
    function exitRuntime() {
      runtimeExited = true
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]]
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift())
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__)
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb)
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb)
    }
    var runDependencies = 0
    var runDependencyWatcher = null
    var dependenciesFulfilled = null
    function getUniqueRunDependency(id) {
      return id
    }
    function addRunDependency(id) {
      runDependencies++
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
      }
    }
    function removeRunDependency(id) {
      runDependencies--
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher)
          runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled
          dependenciesFulfilled = null
          callback()
        }
      }
    }
    Module["preloadedImages"] = {}
    Module["preloadedAudios"] = {}
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what)
      }
      what += ""
      err(what)
      ABORT = true
      EXITSTATUS = 1
      what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info."
      var e = new WebAssembly.RuntimeError(what)
      readyPromiseReject(e)
      throw e
    }
    function hasPrefix(str, prefix) {
      return String.prototype.startsWith
        ? str.startsWith(prefix)
        : str.indexOf(prefix) === 0
    }
    var dataURIPrefix = "data:application/octet-stream;base64,"
    function isDataURI(filename) {
      return hasPrefix(filename, dataURIPrefix)
    }
    var fileURIPrefix = "file://"
    function isFileURI(filename) {
      return hasPrefix(filename, fileURIPrefix)
    }
    var wasmBinaryFile = "caxview20220908.wasm"
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile)
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
          return readBinary(file)
        } else {
          throw "both async and sync fetching of the wasm failed"
        }
      } catch (err) {
        abort(err)
      }
    }
    function getBinaryPromise() {
      if (
        !wasmBinary &&
        (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
        typeof fetch === "function" &&
        !isFileURI(wasmBinaryFile)
      ) {
        return fetch(wasmBinaryFile, { credentials: "same-origin" })
          .then(function (response) {
            if (!response["ok"]) {
              throw (
                "failed to load wasm binary file at '" + wasmBinaryFile + "'"
              )
            }
            return response["arrayBuffer"]()
          })
          .catch(function () {
            return getBinary(wasmBinaryFile)
          })
      }
      return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile)
      })
    }
    function createWasm() {
      var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg }
      function receiveInstance(instance, module) {
        var exports = instance.exports
        Module["asm"] = exports
        wasmMemory = Module["asm"]["memory"]
        updateGlobalBufferAndViews(wasmMemory.buffer)
        wasmTable = Module["asm"]["__indirect_function_table"]
        removeRunDependency("wasm-instantiate")
      }
      addRunDependency("wasm-instantiate")
      function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"])
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
          .then(function (binary) {
            return WebAssembly.instantiate(binary, info)
          })
          .then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason)
            abort(reason)
          })
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WebAssembly.instantiateStreaming === "function" &&
          !isDataURI(wasmBinaryFile) &&
          !isFileURI(wasmBinaryFile) &&
          typeof fetch === "function"
        ) {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
            function (response) {
              var result = WebAssembly.instantiateStreaming(response, info)
              return result.then(receiveInstantiatedSource, function (reason) {
                err("wasm streaming compile failed: " + reason)
                err("falling back to ArrayBuffer instantiation")
                return instantiateArrayBuffer(receiveInstantiatedSource)
              })
            }
          )
        } else {
          return instantiateArrayBuffer(receiveInstantiatedSource)
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance)
          return exports
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e)
          return false
        }
      }
      instantiateAsync().catch(readyPromiseReject)
      return {}
    }
    var tempDouble
    var tempI64
    var ASM_CONSTS = {
      5780: function () {
        Module["noExitRuntime"] = true
      },
      1348798: function ($0, $1, $2, $3) {
        Module.ctx.getBufferSubData($0, $1, HEAPU8.subarray($2, $2 + $3))
      }
    }
    function OSD_MemInfo_getModuleHeapLength() {
      return Module.HEAP8.length
    }
    function occJSConsoleDebug(theStr) {
      console.debug(UTF8ToString(theStr))
    }
    function occJSConsoleError(theStr) {
      console.error(UTF8ToString(theStr))
    }
    function occJSConsoleInfo(theStr) {
      console.info(UTF8ToString(theStr))
    }
    function occJSConsoleWarn(theStr) {
      console.warn(UTF8ToString(theStr))
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift()
        if (typeof callback == "function") {
          callback(Module)
          continue
        }
        var func = callback.func
        if (typeof func === "number") {
          if (callback.arg === undefined) {
            wasmTable.get(func)()
          } else {
            wasmTable.get(func)(callback.arg)
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg)
        }
      }
    }
    function demangle(func) {
      return func
    }
    function demangleAll(text) {
      var regex = /\b_Z[\w\d_]+/g
      return text.replace(regex, function (x) {
        var y = demangle(x)
        return x === y ? x : y + " [" + x + "]"
      })
    }
    function jsStackTrace() {
      var error = new Error()
      if (!error.stack) {
        try {
          throw new Error()
        } catch (e) {
          error = e
        }
        if (!error.stack) {
          return "(no stack trace available)"
        }
      }
      return error.stack.toString()
    }
    function ___assert_fail(condition, filename, line, func) {
      abort(
        "Assertion failed: " +
          UTF8ToString(condition) +
          ", at: " +
          [
            filename ? UTF8ToString(filename) : "unknown filename",
            line,
            func ? UTF8ToString(func) : "unknown function"
          ]
      )
    }
    var ExceptionInfoAttrs = {
      DESTRUCTOR_OFFSET: 0,
      REFCOUNT_OFFSET: 4,
      TYPE_OFFSET: 8,
      CAUGHT_OFFSET: 12,
      RETHROWN_OFFSET: 13,
      SIZE: 16
    }
    function ___cxa_allocate_exception(size) {
      return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE
    }
    function _atexit(func, arg) {}
    function ___cxa_atexit(a0, a1) {
      return _atexit(a0, a1)
    }
    function ExceptionInfo(excPtr) {
      this.excPtr = excPtr
      this.ptr = excPtr - ExceptionInfoAttrs.SIZE
      this.set_type = function (type) {
        HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2] = type
      }
      this.get_type = function () {
        return HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2]
      }
      this.set_destructor = function (destructor) {
        HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2] =
          destructor
      }
      this.get_destructor = function () {
        return HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2]
      }
      this.set_refcount = function (refcount) {
        HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = refcount
      }
      this.set_caught = function (caught) {
        caught = caught ? 1 : 0
        HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] = caught
      }
      this.get_caught = function () {
        return HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] != 0
      }
      this.set_rethrown = function (rethrown) {
        rethrown = rethrown ? 1 : 0
        HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] = rethrown
      }
      this.get_rethrown = function () {
        return HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] != 0
      }
      this.init = function (type, destructor) {
        this.set_type(type)
        this.set_destructor(destructor)
        this.set_refcount(0)
        this.set_caught(false)
        this.set_rethrown(false)
      }
      this.add_ref = function () {
        var value = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2]
        HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = value + 1
      }
      this.release_ref = function () {
        var prev = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2]
        HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = prev - 1
        return prev === 1
      }
    }
    function CatchInfo(ptr) {
      this.free = function () {
        _free(this.ptr)
        this.ptr = 0
      }
      this.set_base_ptr = function (basePtr) {
        HEAP32[this.ptr >> 2] = basePtr
      }
      this.get_base_ptr = function () {
        return HEAP32[this.ptr >> 2]
      }
      this.set_adjusted_ptr = function (adjustedPtr) {
        var ptrSize = 4
        HEAP32[(this.ptr + ptrSize) >> 2] = adjustedPtr
      }
      this.get_adjusted_ptr = function () {
        var ptrSize = 4
        return HEAP32[(this.ptr + ptrSize) >> 2]
      }
      this.get_exception_ptr = function () {
        var isPointer = ___cxa_is_pointer_type(
          this.get_exception_info().get_type()
        )
        if (isPointer) {
          return HEAP32[this.get_base_ptr() >> 2]
        }
        var adjusted = this.get_adjusted_ptr()
        if (adjusted !== 0) return adjusted
        return this.get_base_ptr()
      }
      this.get_exception_info = function () {
        return new ExceptionInfo(this.get_base_ptr())
      }
      if (ptr === undefined) {
        this.ptr = _malloc(8)
        this.set_adjusted_ptr(0)
      } else {
        this.ptr = ptr
      }
    }
    var exceptionCaught = []
    function exception_addRef(info) {
      info.add_ref()
    }
    var uncaughtExceptionCount = 0
    function ___cxa_begin_catch(ptr) {
      var catchInfo = new CatchInfo(ptr)
      var info = catchInfo.get_exception_info()
      if (!info.get_caught()) {
        info.set_caught(true)
        uncaughtExceptionCount--
      }
      info.set_rethrown(false)
      exceptionCaught.push(catchInfo)
      exception_addRef(info)
      return catchInfo.get_exception_ptr()
    }
    var exceptionLast = 0
    function ___cxa_free_exception(ptr) {
      return _free(new ExceptionInfo(ptr).ptr)
    }
    function exception_decRef(info) {
      if (info.release_ref() && !info.get_rethrown()) {
        var destructor = info.get_destructor()
        if (destructor) {
          wasmTable.get(destructor)(info.excPtr)
        }
        ___cxa_free_exception(info.excPtr)
      }
    }
    function ___cxa_end_catch() {
      _setThrew(0)
      var catchInfo = exceptionCaught.pop()
      exception_decRef(catchInfo.get_exception_info())
      catchInfo.free()
      exceptionLast = 0
    }
    function ___resumeException(catchInfoPtr) {
      var catchInfo = new CatchInfo(catchInfoPtr)
      var ptr = catchInfo.get_base_ptr()
      if (!exceptionLast) {
        exceptionLast = ptr
      }
      catchInfo.free()
      throw ptr
    }
    function ___cxa_find_matching_catch_2() {
      var thrown = exceptionLast
      if (!thrown) {
        setTempRet0(0 | 0)
        return 0 | 0
      }
      var info = new ExceptionInfo(thrown)
      var thrownType = info.get_type()
      var catchInfo = new CatchInfo()
      catchInfo.set_base_ptr(thrown)
      if (!thrownType) {
        setTempRet0(0 | 0)
        return catchInfo.ptr | 0
      }
      var typeArray = Array.prototype.slice.call(arguments)
      var stackTop = stackSave()
      var exceptionThrowBuf = stackAlloc(4)
      HEAP32[exceptionThrowBuf >> 2] = thrown
      for (var i = 0; i < typeArray.length; i++) {
        var caughtType = typeArray[i]
        if (caughtType === 0 || caughtType === thrownType) {
          break
        }
        if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
          var adjusted = HEAP32[exceptionThrowBuf >> 2]
          if (thrown !== adjusted) {
            catchInfo.set_adjusted_ptr(adjusted)
          }
          setTempRet0(caughtType | 0)
          return catchInfo.ptr | 0
        }
      }
      stackRestore(stackTop)
      setTempRet0(thrownType | 0)
      return catchInfo.ptr | 0
    }
    function ___cxa_find_matching_catch_3() {
      var thrown = exceptionLast
      if (!thrown) {
        setTempRet0(0 | 0)
        return 0 | 0
      }
      var info = new ExceptionInfo(thrown)
      var thrownType = info.get_type()
      var catchInfo = new CatchInfo()
      catchInfo.set_base_ptr(thrown)
      if (!thrownType) {
        setTempRet0(0 | 0)
        return catchInfo.ptr | 0
      }
      var typeArray = Array.prototype.slice.call(arguments)
      var stackTop = stackSave()
      var exceptionThrowBuf = stackAlloc(4)
      HEAP32[exceptionThrowBuf >> 2] = thrown
      for (var i = 0; i < typeArray.length; i++) {
        var caughtType = typeArray[i]
        if (caughtType === 0 || caughtType === thrownType) {
          break
        }
        if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
          var adjusted = HEAP32[exceptionThrowBuf >> 2]
          if (thrown !== adjusted) {
            catchInfo.set_adjusted_ptr(adjusted)
          }
          setTempRet0(caughtType | 0)
          return catchInfo.ptr | 0
        }
      }
      stackRestore(stackTop)
      setTempRet0(thrownType | 0)
      return catchInfo.ptr | 0
    }
    function ___cxa_find_matching_catch_4() {
      var thrown = exceptionLast
      if (!thrown) {
        setTempRet0(0 | 0)
        return 0 | 0
      }
      var info = new ExceptionInfo(thrown)
      var thrownType = info.get_type()
      var catchInfo = new CatchInfo()
      catchInfo.set_base_ptr(thrown)
      if (!thrownType) {
        setTempRet0(0 | 0)
        return catchInfo.ptr | 0
      }
      var typeArray = Array.prototype.slice.call(arguments)
      var stackTop = stackSave()
      var exceptionThrowBuf = stackAlloc(4)
      HEAP32[exceptionThrowBuf >> 2] = thrown
      for (var i = 0; i < typeArray.length; i++) {
        var caughtType = typeArray[i]
        if (caughtType === 0 || caughtType === thrownType) {
          break
        }
        if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
          var adjusted = HEAP32[exceptionThrowBuf >> 2]
          if (thrown !== adjusted) {
            catchInfo.set_adjusted_ptr(adjusted)
          }
          setTempRet0(caughtType | 0)
          return catchInfo.ptr | 0
        }
      }
      stackRestore(stackTop)
      setTempRet0(thrownType | 0)
      return catchInfo.ptr | 0
    }
    function ___cxa_find_matching_catch_5() {
      var thrown = exceptionLast
      if (!thrown) {
        setTempRet0(0 | 0)
        return 0 | 0
      }
      var info = new ExceptionInfo(thrown)
      var thrownType = info.get_type()
      var catchInfo = new CatchInfo()
      catchInfo.set_base_ptr(thrown)
      if (!thrownType) {
        setTempRet0(0 | 0)
        return catchInfo.ptr | 0
      }
      var typeArray = Array.prototype.slice.call(arguments)
      var stackTop = stackSave()
      var exceptionThrowBuf = stackAlloc(4)
      HEAP32[exceptionThrowBuf >> 2] = thrown
      for (var i = 0; i < typeArray.length; i++) {
        var caughtType = typeArray[i]
        if (caughtType === 0 || caughtType === thrownType) {
          break
        }
        if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
          var adjusted = HEAP32[exceptionThrowBuf >> 2]
          if (thrown !== adjusted) {
            catchInfo.set_adjusted_ptr(adjusted)
          }
          setTempRet0(caughtType | 0)
          return catchInfo.ptr | 0
        }
      }
      stackRestore(stackTop)
      setTempRet0(thrownType | 0)
      return catchInfo.ptr | 0
    }
    function ___cxa_rethrow() {
      var catchInfo = exceptionCaught.pop()
      var info = catchInfo.get_exception_info()
      var ptr = catchInfo.get_base_ptr()
      if (!info.get_rethrown()) {
        exceptionCaught.push(catchInfo)
        info.set_rethrown(true)
        info.set_caught(false)
        uncaughtExceptionCount++
      } else {
        catchInfo.free()
      }
      exceptionLast = ptr
      throw ptr
    }
    function ___cxa_throw(ptr, type, destructor) {
      var info = new ExceptionInfo(ptr)
      info.init(type, destructor)
      exceptionLast = ptr
      uncaughtExceptionCount++
      throw ptr
    }
    var PATH = {
      splitPath: function (filename) {
        var splitPathRe =
          /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
        return splitPathRe.exec(filename).slice(1)
      },
      normalizeArray: function (parts, allowAboveRoot) {
        var up = 0
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i]
          if (last === ".") {
            parts.splice(i, 1)
          } else if (last === "..") {
            parts.splice(i, 1)
            up++
          } else if (up) {
            parts.splice(i, 1)
            up--
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..")
          }
        }
        return parts
      },
      normalize: function (path) {
        var isAbsolute = path.charAt(0) === "/",
          trailingSlash = path.substr(-1) === "/"
        path = PATH.normalizeArray(
          path.split("/").filter(function (p) {
            return !!p
          }),
          !isAbsolute
        ).join("/")
        if (!path && !isAbsolute) {
          path = "."
        }
        if (path && trailingSlash) {
          path += "/"
        }
        return (isAbsolute ? "/" : "") + path
      },
      dirname: function (path) {
        var result = PATH.splitPath(path),
          root = result[0],
          dir = result[1]
        if (!root && !dir) {
          return "."
        }
        if (dir) {
          dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
      },
      basename: function (path) {
        if (path === "/") return "/"
        path = PATH.normalize(path)
        path = path.replace(/\/$/, "")
        var lastSlash = path.lastIndexOf("/")
        if (lastSlash === -1) return path
        return path.substr(lastSlash + 1)
      },
      extname: function (path) {
        return PATH.splitPath(path)[3]
      },
      join: function () {
        var paths = Array.prototype.slice.call(arguments, 0)
        return PATH.normalize(paths.join("/"))
      },
      join2: function (l, r) {
        return PATH.normalize(l + "/" + r)
      }
    }
    function getRandomDevice() {
      if (
        typeof crypto === "object" &&
        typeof crypto["getRandomValues"] === "function"
      ) {
        var randomBuffer = new Uint8Array(1)
        return function () {
          crypto.getRandomValues(randomBuffer)
          return randomBuffer[0]
        }
      } else if (ENVIRONMENT_IS_NODE) {
        try {
          var crypto_module = require("crypto")
          return function () {
            return crypto_module["randomBytes"](1)[0]
          }
        } catch (e) {}
      }
      return function () {
        abort("randomDevice")
      }
    }
    var PATH_FS = {
      resolve: function () {
        var resolvedPath = "",
          resolvedAbsolute = false
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : FS.cwd()
          if (typeof path !== "string") {
            throw new TypeError("Arguments to path.resolve must be strings")
          } else if (!path) {
            return ""
          }
          resolvedPath = path + "/" + resolvedPath
          resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(
          resolvedPath.split("/").filter(function (p) {
            return !!p
          }),
          !resolvedAbsolute
        ).join("/")
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
      },
      relative: function (from, to) {
        from = PATH_FS.resolve(from).substr(1)
        to = PATH_FS.resolve(to).substr(1)
        function trim(arr) {
          var start = 0
          for (; start < arr.length; start++) {
            if (arr[start] !== "") break
          }
          var end = arr.length - 1
          for (; end >= 0; end--) {
            if (arr[end] !== "") break
          }
          if (start > end) return []
          return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"))
        var toParts = trim(to.split("/"))
        var length = Math.min(fromParts.length, toParts.length)
        var samePartsLength = length
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i
            break
          }
        }
        var outputParts = []
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength))
        return outputParts.join("/")
      }
    }
    var TTY = {
      ttys: [],
      init: function () {},
      shutdown: function () {},
      register: function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops }
        FS.registerDevice(dev, TTY.stream_ops)
      },
      stream_ops: {
        open: function (stream) {
          var tty = TTY.ttys[stream.node.rdev]
          if (!tty) {
            throw new FS.ErrnoError(43)
          }
          stream.tty = tty
          stream.seekable = false
        },
        close: function (stream) {
          stream.tty.ops.flush(stream.tty)
        },
        flush: function (stream) {
          stream.tty.ops.flush(stream.tty)
        },
        read: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60)
          }
          var bytesRead = 0
          for (var i = 0; i < length; i++) {
            var result
            try {
              result = stream.tty.ops.get_char(stream.tty)
            } catch (e) {
              throw new FS.ErrnoError(29)
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6)
            }
            if (result === null || result === undefined) break
            bytesRead++
            buffer[offset + i] = result
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now()
          }
          return bytesRead
        },
        write: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60)
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i])
            }
          } catch (e) {
            throw new FS.ErrnoError(29)
          }
          if (length) {
            stream.node.timestamp = Date.now()
          }
          return i
        }
      },
      default_tty_ops: {
        get_char: function (tty) {
          if (!tty.input.length) {
            var result = null
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256
              var buf = Buffer.alloc
                ? Buffer.alloc(BUFSIZE)
                : new Buffer(BUFSIZE)
              var bytesRead = 0
              try {
                bytesRead = nodeFS.readSync(
                  process.stdin.fd,
                  buf,
                  0,
                  BUFSIZE,
                  null
                )
              } catch (e) {
                if (e.toString().indexOf("EOF") != -1) bytesRead = 0
                else throw e
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8")
              } else {
                result = null
              }
            } else if (
              typeof window != "undefined" &&
              typeof window.prompt == "function"
            ) {
              result = window.prompt("Input: ")
              if (result !== null) {
                result += "\n"
              }
            } else if (typeof readline == "function") {
              result = readline()
              if (result !== null) {
                result += "\n"
              }
            }
            if (!result) {
              return null
            }
            tty.input = intArrayFromString(result, true)
          }
          return tty.input.shift()
        },
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0))
            tty.output = []
          } else {
            if (val != 0) tty.output.push(val)
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0))
            tty.output = []
          }
        }
      },
      default_tty1_ops: {
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0))
            tty.output = []
          } else {
            if (val != 0) tty.output.push(val)
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0))
            tty.output = []
          }
        }
      }
    }
    function mmapAlloc(size) {
      var alignedSize = alignMemory(size, 16384)
      var ptr = _malloc(alignedSize)
      while (size < alignedSize) HEAP8[ptr + size++] = 0
      return ptr
    }
    var MEMFS = {
      ops_table: null,
      mount: function (mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
      },
      createNode: function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63)
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: { llseek: MEMFS.stream_ops.llseek }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          }
        }
        var node = FS.createNode(parent, name, mode, dev)
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node
          node.stream_ops = MEMFS.ops_table.dir.stream
          node.contents = {}
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node
          node.stream_ops = MEMFS.ops_table.file.stream
          node.usedBytes = 0
          node.contents = null
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node
          node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node
          node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now()
        if (parent) {
          parent.contents[name] = node
        }
        return node
      },
      getFileDataAsRegularArray: function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = []
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i])
          return arr
        }
        return node.contents
      },
      getFileDataAsTypedArray: function (node) {
        if (!node.contents) return new Uint8Array(0)
        if (node.contents.subarray)
          return node.contents.subarray(0, node.usedBytes)
        return new Uint8Array(node.contents)
      },
      expandFileStorage: function (node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0
        if (prevCapacity >= newCapacity) return
        var CAPACITY_DOUBLING_MAX = 1024 * 1024
        newCapacity = Math.max(
          newCapacity,
          (prevCapacity *
            (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
            0
        )
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256)
        var oldContents = node.contents
        node.contents = new Uint8Array(newCapacity)
        if (node.usedBytes > 0)
          node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
        return
      },
      resizeFileStorage: function (node, newSize) {
        if (node.usedBytes == newSize) return
        if (newSize == 0) {
          node.contents = null
          node.usedBytes = 0
          return
        }
        if (!node.contents || node.contents.subarray) {
          var oldContents = node.contents
          node.contents = new Uint8Array(newSize)
          if (oldContents) {
            node.contents.set(
              oldContents.subarray(0, Math.min(newSize, node.usedBytes))
            )
          }
          node.usedBytes = newSize
          return
        }
        if (!node.contents) node.contents = []
        if (node.contents.length > newSize) node.contents.length = newSize
        else while (node.contents.length < newSize) node.contents.push(0)
        node.usedBytes = newSize
      },
      node_ops: {
        getattr: function (node) {
          var attr = {}
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1
          attr.ino = node.id
          attr.mode = node.mode
          attr.nlink = 1
          attr.uid = 0
          attr.gid = 0
          attr.rdev = node.rdev
          if (FS.isDir(node.mode)) {
            attr.size = 4096
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length
          } else {
            attr.size = 0
          }
          attr.atime = new Date(node.timestamp)
          attr.mtime = new Date(node.timestamp)
          attr.ctime = new Date(node.timestamp)
          attr.blksize = 4096
          attr.blocks = Math.ceil(attr.size / attr.blksize)
          return attr
        },
        setattr: function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size)
          }
        },
        lookup: function (parent, name) {
          throw FS.genericErrors[44]
        },
        mknod: function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function (old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node
            try {
              new_node = FS.lookupNode(new_dir, new_name)
            } catch (e) {}
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55)
              }
            }
          }
          delete old_node.parent.contents[old_node.name]
          old_node.name = new_name
          new_dir.contents[new_name] = old_node
          old_node.parent = new_dir
        },
        unlink: function (parent, name) {
          delete parent.contents[name]
        },
        rmdir: function (parent, name) {
          var node = FS.lookupNode(parent, name)
          for (var i in node.contents) {
            throw new FS.ErrnoError(55)
          }
          delete parent.contents[name]
        },
        readdir: function (node) {
          var entries = [".", ".."]
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue
            }
            entries.push(key)
          }
          return entries
        },
        symlink: function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0)
          node.link = oldpath
          return node
        },
        readlink: function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28)
          }
          return node.link
        }
      },
      stream_ops: {
        read: function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents
          if (position >= stream.node.usedBytes) return 0
          var size = Math.min(stream.node.usedBytes - position, length)
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset)
          } else {
            for (var i = 0; i < size; i++)
              buffer[offset + i] = contents[position + i]
          }
          return size
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false
          }
          if (!length) return 0
          var node = stream.node
          node.timestamp = Date.now()
          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length)
              node.usedBytes = length
              return length
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length)
              node.usedBytes = length
              return length
            } else if (position + length <= node.usedBytes) {
              node.contents.set(
                buffer.subarray(offset, offset + length),
                position
              )
              return length
            }
          }
          MEMFS.expandFileStorage(node, position + length)
          if (node.contents.subarray && buffer.subarray) {
            node.contents.set(
              buffer.subarray(offset, offset + length),
              position
            )
          } else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i]
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length)
          return length
        },
        llseek: function (stream, offset, whence) {
          var position = offset
          if (whence === 1) {
            position += stream.position
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28)
          }
          return position
        },
        allocate: function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length)
          stream.node.usedBytes = Math.max(
            stream.node.usedBytes,
            offset + length
          )
        },
        mmap: function (stream, address, length, position, prot, flags) {
          assert(address === 0)
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43)
          }
          var ptr
          var allocated
          var contents = stream.node.contents
          if (!(flags & 2) && contents.buffer === buffer) {
            allocated = false
            ptr = contents.byteOffset
          } else {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length)
              } else {
                contents = Array.prototype.slice.call(
                  contents,
                  position,
                  position + length
                )
              }
            }
            allocated = true
            ptr = mmapAlloc(length)
            if (!ptr) {
              throw new FS.ErrnoError(48)
            }
            HEAP8.set(contents, ptr)
          }
          return { ptr: ptr, allocated: allocated }
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43)
          }
          if (mmapFlags & 2) {
            return 0
          }
          var bytesWritten = MEMFS.stream_ops.write(
            stream,
            buffer,
            0,
            length,
            offset,
            false
          )
          return 0
        }
      }
    }
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      trackingDelegate: {},
      tracking: { openFlags: { READ: 1, WRITE: 2 } },
      ErrnoError: null,
      genericErrors: {},
      filesystems: null,
      syncFSRequests: 0,
      lookupPath: function (path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path)
        opts = opts || {}
        if (!path) return { path: "", node: null }
        var defaults = { follow_mount: true, recurse_count: 0 }
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key]
          }
        }
        if (opts.recurse_count > 8) {
          throw new FS.ErrnoError(32)
        }
        var parts = PATH.normalizeArray(
          path.split("/").filter(function (p) {
            return !!p
          }),
          false
        )
        var current = FS.root
        var current_path = "/"
        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1
          if (islast && opts.parent) {
            break
          }
          current = FS.lookupNode(current, parts[i])
          current_path = PATH.join2(current_path, parts[i])
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root
            }
          }
          if (!islast || opts.follow) {
            var count = 0
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path)
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link)
              var lookup = FS.lookupPath(current_path, {
                recurse_count: opts.recurse_count
              })
              current = lookup.node
              if (count++ > 40) {
                throw new FS.ErrnoError(32)
              }
            }
          }
        }
        return { path: current_path, node: current }
      },
      getPath: function (node) {
        var path
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint
            if (!path) return mount
            return mount[mount.length - 1] !== "/"
              ? mount + "/" + path
              : mount + path
          }
          path = path ? node.name + "/" + path : node.name
          node = node.parent
        }
      },
      hashName: function (parentid, name) {
        var hash = 0
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length
      },
      hashAddNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name)
        node.name_next = FS.nameTable[hash]
        FS.nameTable[hash] = node
      },
      hashRemoveNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name)
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next
        } else {
          var current = FS.nameTable[hash]
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next
              break
            }
            current = current.name_next
          }
        }
      },
      lookupNode: function (parent, name) {
        var errCode = FS.mayLookup(parent)
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent)
        }
        var hash = FS.hashName(parent.id, name)
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name
          if (node.parent.id === parent.id && nodeName === name) {
            return node
          }
        }
        return FS.lookup(parent, name)
      },
      createNode: function (parent, name, mode, rdev) {
        var node = new FS.FSNode(parent, name, mode, rdev)
        FS.hashAddNode(node)
        return node
      },
      destroyNode: function (node) {
        FS.hashRemoveNode(node)
      },
      isRoot: function (node) {
        return node === node.parent
      },
      isMountpoint: function (node) {
        return !!node.mounted
      },
      isFile: function (mode) {
        return (mode & 61440) === 32768
      },
      isDir: function (mode) {
        return (mode & 61440) === 16384
      },
      isLink: function (mode) {
        return (mode & 61440) === 40960
      },
      isChrdev: function (mode) {
        return (mode & 61440) === 8192
      },
      isBlkdev: function (mode) {
        return (mode & 61440) === 24576
      },
      isFIFO: function (mode) {
        return (mode & 61440) === 4096
      },
      isSocket: function (mode) {
        return (mode & 49152) === 49152
      },
      flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
      modeStringToFlags: function (str) {
        var flags = FS.flagModes[str]
        if (typeof flags === "undefined") {
          throw new Error("Unknown file open mode: " + str)
        }
        return flags
      },
      flagsToPermissionString: function (flag) {
        var perms = ["r", "w", "rw"][flag & 3]
        if (flag & 512) {
          perms += "w"
        }
        return perms
      },
      nodePermissions: function (node, perms) {
        if (FS.ignorePermissions) {
          return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
          return 2
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
          return 2
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
          return 2
        }
        return 0
      },
      mayLookup: function (dir) {
        var errCode = FS.nodePermissions(dir, "x")
        if (errCode) return errCode
        if (!dir.node_ops.lookup) return 2
        return 0
      },
      mayCreate: function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name)
          return 20
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
      },
      mayDelete: function (dir, name, isdir) {
        var node
        try {
          node = FS.lookupNode(dir, name)
        } catch (e) {
          return e.errno
        }
        var errCode = FS.nodePermissions(dir, "wx")
        if (errCode) {
          return errCode
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31
          }
        }
        return 0
      },
      mayOpen: function (node, flags) {
        if (!node) {
          return 44
        }
        if (FS.isLink(node.mode)) {
          return 32
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
            return 31
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
      },
      MAX_OPEN_FDS: 4096,
      nextfd: function (fd_start, fd_end) {
        fd_start = fd_start || 0
        fd_end = fd_end || FS.MAX_OPEN_FDS
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd
          }
        }
        throw new FS.ErrnoError(33)
      },
      getStream: function (fd) {
        return FS.streams[fd]
      },
      createStream: function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function () {}
          FS.FSStream.prototype = {
            object: {
              get: function () {
                return this.node
              },
              set: function (val) {
                this.node = val
              }
            },
            isRead: {
              get: function () {
                return (this.flags & 2097155) !== 1
              }
            },
            isWrite: {
              get: function () {
                return (this.flags & 2097155) !== 0
              }
            },
            isAppend: {
              get: function () {
                return this.flags & 1024
              }
            }
          }
        }
        var newStream = new FS.FSStream()
        for (var p in stream) {
          newStream[p] = stream[p]
        }
        stream = newStream
        var fd = FS.nextfd(fd_start, fd_end)
        stream.fd = fd
        FS.streams[fd] = stream
        return stream
      },
      closeStream: function (fd) {
        FS.streams[fd] = null
      },
      chrdev_stream_ops: {
        open: function (stream) {
          var device = FS.getDevice(stream.node.rdev)
          stream.stream_ops = device.stream_ops
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
          }
        },
        llseek: function () {
          throw new FS.ErrnoError(70)
        }
      },
      major: function (dev) {
        return dev >> 8
      },
      minor: function (dev) {
        return dev & 255
      },
      makedev: function (ma, mi) {
        return (ma << 8) | mi
      },
      registerDevice: function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops }
      },
      getDevice: function (dev) {
        return FS.devices[dev]
      },
      getMounts: function (mount) {
        var mounts = []
        var check = [mount]
        while (check.length) {
          var m = check.pop()
          mounts.push(m)
          check.push.apply(check, m.mounts)
        }
        return mounts
      },
      syncfs: function (populate, callback) {
        if (typeof populate === "function") {
          callback = populate
          populate = false
        }
        FS.syncFSRequests++
        if (FS.syncFSRequests > 1) {
          err(
            "warning: " +
              FS.syncFSRequests +
              " FS.syncfs operations in flight at once, probably just doing extra work"
          )
        }
        var mounts = FS.getMounts(FS.root.mount)
        var completed = 0
        function doCallback(errCode) {
          FS.syncFSRequests--
          return callback(errCode)
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true
              return doCallback(errCode)
            }
            return
          }
          if (++completed >= mounts.length) {
            doCallback(null)
          }
        }
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null)
          }
          mount.type.syncfs(mount, populate, done)
        })
      },
      mount: function (type, opts, mountpoint) {
        var root = mountpoint === "/"
        var pseudo = !mountpoint
        var node
        if (root && FS.root) {
          throw new FS.ErrnoError(10)
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false })
          mountpoint = lookup.path
          node = lookup.node
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
          }
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        }
        var mountRoot = type.mount(mount)
        mountRoot.mount = mount
        mount.root = mountRoot
        if (root) {
          FS.root = mountRoot
        } else if (node) {
          node.mounted = mount
          if (node.mount) {
            node.mount.mounts.push(mount)
          }
        }
        return mountRoot
      },
      unmount: function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false })
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28)
        }
        var node = lookup.node
        var mount = node.mounted
        var mounts = FS.getMounts(mount)
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash]
          while (current) {
            var next = current.name_next
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current)
            }
            current = next
          }
        })
        node.mounted = null
        var idx = node.mount.mounts.indexOf(mount)
        node.mount.mounts.splice(idx, 1)
      },
      lookup: function (parent, name) {
        return parent.node_ops.lookup(parent, name)
      },
      mknod: function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true })
        var parent = lookup.node
        var name = PATH.basename(path)
        if (!name || name === "." || name === "..") {
          throw new FS.ErrnoError(28)
        }
        var errCode = FS.mayCreate(parent, name)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
      },
      create: function (path, mode) {
        mode = mode !== undefined ? mode : 438
        mode &= 4095
        mode |= 32768
        return FS.mknod(path, mode, 0)
      },
      mkdir: function (path, mode) {
        mode = mode !== undefined ? mode : 511
        mode &= 511 | 512
        mode |= 16384
        return FS.mknod(path, mode, 0)
      },
      mkdirTree: function (path, mode) {
        var dirs = path.split("/")
        var d = ""
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue
          d += "/" + dirs[i]
          try {
            FS.mkdir(d, mode)
          } catch (e) {
            if (e.errno != 20) throw e
          }
        }
      },
      mkdev: function (path, mode, dev) {
        if (typeof dev === "undefined") {
          dev = mode
          mode = 438
        }
        mode |= 8192
        return FS.mknod(path, mode, dev)
      },
      symlink: function (oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44)
        }
        var lookup = FS.lookupPath(newpath, { parent: true })
        var parent = lookup.node
        if (!parent) {
          throw new FS.ErrnoError(44)
        }
        var newname = PATH.basename(newpath)
        var errCode = FS.mayCreate(parent, newname)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
      },
      rename: function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path)
        var new_dirname = PATH.dirname(new_path)
        var old_name = PATH.basename(old_path)
        var new_name = PATH.basename(new_path)
        var lookup, old_dir, new_dir
        lookup = FS.lookupPath(old_path, { parent: true })
        old_dir = lookup.node
        lookup = FS.lookupPath(new_path, { parent: true })
        new_dir = lookup.node
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44)
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75)
        }
        var old_node = FS.lookupNode(old_dir, old_name)
        var relative = PATH_FS.relative(old_path, new_dirname)
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(28)
        }
        relative = PATH_FS.relative(new_path, old_dirname)
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(55)
        }
        var new_node
        try {
          new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
          return
        }
        var isdir = FS.isDir(old_node.mode)
        var errCode = FS.mayDelete(old_dir, old_name, isdir)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        errCode = new_node
          ? FS.mayDelete(new_dir, new_name, isdir)
          : FS.mayCreate(new_dir, new_name)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63)
        }
        if (
          FS.isMountpoint(old_node) ||
          (new_node && FS.isMountpoint(new_node))
        ) {
          throw new FS.ErrnoError(10)
        }
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, "w")
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
        }
        try {
          if (FS.trackingDelegate["willMovePath"]) {
            FS.trackingDelegate["willMovePath"](old_path, new_path)
          }
        } catch (e) {
          err(
            "FS.trackingDelegate['willMovePath']('" +
              old_path +
              "', '" +
              new_path +
              "') threw an exception: " +
              e.message
          )
        }
        FS.hashRemoveNode(old_node)
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
          throw e
        } finally {
          FS.hashAddNode(old_node)
        }
        try {
          if (FS.trackingDelegate["onMovePath"])
            FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
          err(
            "FS.trackingDelegate['onMovePath']('" +
              old_path +
              "', '" +
              new_path +
              "') threw an exception: " +
              e.message
          )
        }
      },
      rmdir: function (path) {
        var lookup = FS.lookupPath(path, { parent: true })
        var parent = lookup.node
        var name = PATH.basename(path)
        var node = FS.lookupNode(parent, name)
        var errCode = FS.mayDelete(parent, name, true)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10)
        }
        try {
          if (FS.trackingDelegate["willDeletePath"]) {
            FS.trackingDelegate["willDeletePath"](path)
          }
        } catch (e) {
          err(
            "FS.trackingDelegate['willDeletePath']('" +
              path +
              "') threw an exception: " +
              e.message
          )
        }
        parent.node_ops.rmdir(parent, name)
        FS.destroyNode(node)
        try {
          if (FS.trackingDelegate["onDeletePath"])
            FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
          err(
            "FS.trackingDelegate['onDeletePath']('" +
              path +
              "') threw an exception: " +
              e.message
          )
        }
      },
      readdir: function (path) {
        var lookup = FS.lookupPath(path, { follow: true })
        var node = lookup.node
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54)
        }
        return node.node_ops.readdir(node)
      },
      unlink: function (path) {
        var lookup = FS.lookupPath(path, { parent: true })
        var parent = lookup.node
        var name = PATH.basename(path)
        var node = FS.lookupNode(parent, name)
        var errCode = FS.mayDelete(parent, name, false)
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10)
        }
        try {
          if (FS.trackingDelegate["willDeletePath"]) {
            FS.trackingDelegate["willDeletePath"](path)
          }
        } catch (e) {
          err(
            "FS.trackingDelegate['willDeletePath']('" +
              path +
              "') threw an exception: " +
              e.message
          )
        }
        parent.node_ops.unlink(parent, name)
        FS.destroyNode(node)
        try {
          if (FS.trackingDelegate["onDeletePath"])
            FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
          err(
            "FS.trackingDelegate['onDeletePath']('" +
              path +
              "') threw an exception: " +
              e.message
          )
        }
      },
      readlink: function (path) {
        var lookup = FS.lookupPath(path)
        var link = lookup.node
        if (!link) {
          throw new FS.ErrnoError(44)
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28)
        }
        return PATH_FS.resolve(
          FS.getPath(link.parent),
          link.node_ops.readlink(link)
        )
      },
      stat: function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow })
        var node = lookup.node
        if (!node) {
          throw new FS.ErrnoError(44)
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63)
        }
        return node.node_ops.getattr(node)
      },
      lstat: function (path) {
        return FS.stat(path, true)
      },
      chmod: function (path, mode, dontFollow) {
        var node
        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow })
          node = lookup.node
        } else {
          node = path
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        })
      },
      lchmod: function (path, mode) {
        FS.chmod(path, mode, true)
      },
      fchmod: function (fd, mode) {
        var stream = FS.getStream(fd)
        if (!stream) {
          throw new FS.ErrnoError(8)
        }
        FS.chmod(stream.node, mode)
      },
      chown: function (path, uid, gid, dontFollow) {
        var node
        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow })
          node = lookup.node
        } else {
          node = path
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, { timestamp: Date.now() })
      },
      lchown: function (path, uid, gid) {
        FS.chown(path, uid, gid, true)
      },
      fchown: function (fd, uid, gid) {
        var stream = FS.getStream(fd)
        if (!stream) {
          throw new FS.ErrnoError(8)
        }
        FS.chown(stream.node, uid, gid)
      },
      truncate: function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28)
        }
        var node
        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, { follow: true })
          node = lookup.node
        } else {
          node = path
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63)
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31)
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28)
        }
        var errCode = FS.nodePermissions(node, "w")
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        node.node_ops.setattr(node, { size: len, timestamp: Date.now() })
      },
      ftruncate: function (fd, len) {
        var stream = FS.getStream(fd)
        if (!stream) {
          throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28)
        }
        FS.truncate(stream.node, len)
      },
      utime: function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true })
        var node = lookup.node
        node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) })
      },
      open: function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(44)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags
        mode = typeof mode === "undefined" ? 438 : mode
        if (flags & 64) {
          mode = (mode & 4095) | 32768
        } else {
          mode = 0
        }
        var node
        if (typeof path === "object") {
          node = path
        } else {
          path = PATH.normalize(path)
          try {
            var lookup = FS.lookupPath(path, { follow: !(flags & 131072) })
            node = lookup.node
          } catch (e) {}
        }
        var created = false
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20)
            }
          } else {
            node = FS.mknod(path, mode, 0)
            created = true
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44)
        }
        if (FS.isChrdev(node.mode)) {
          flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54)
        }
        if (!created) {
          var errCode = FS.mayOpen(node, flags)
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
        }
        if (flags & 512) {
          FS.truncate(node, 0)
        }
        flags &= ~(128 | 512 | 131072)
        var stream = FS.createStream(
          {
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
          },
          fd_start,
          fd_end
        )
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {}
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1
            err("FS.trackingDelegate error on read file: " + path)
          }
        }
        try {
          if (FS.trackingDelegate["onOpenFile"]) {
            var trackingFlags = 0
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE
            }
            FS.trackingDelegate["onOpenFile"](path, trackingFlags)
          }
        } catch (e) {
          err(
            "FS.trackingDelegate['onOpenFile']('" +
              path +
              "', flags) threw an exception: " +
              e.message
          )
        }
        return stream
      },
      close: function (stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8)
        }
        if (stream.getdents) stream.getdents = null
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream)
          }
        } catch (e) {
          throw e
        } finally {
          FS.closeStream(stream.fd)
        }
        stream.fd = null
      },
      isClosed: function (stream) {
        return stream.fd === null
      },
      llseek: function (stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence)
        stream.ungotten = []
        return stream.position
      },
      read: function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28)
        }
        var seeking = typeof position !== "undefined"
        if (!seeking) {
          position = stream.position
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70)
        }
        var bytesRead = stream.stream_ops.read(
          stream,
          buffer,
          offset,
          length,
          position
        )
        if (!seeking) stream.position += bytesRead
        return bytesRead
      },
      write: function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28)
        }
        if (stream.seekable && stream.flags & 1024) {
          FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position !== "undefined"
        if (!seeking) {
          position = stream.position
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70)
        }
        var bytesWritten = stream.stream_ops.write(
          stream,
          buffer,
          offset,
          length,
          position,
          canOwn
        )
        if (!seeking) stream.position += bytesWritten
        try {
          if (stream.path && FS.trackingDelegate["onWriteToFile"])
            FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
          err(
            "FS.trackingDelegate['onWriteToFile']('" +
              stream.path +
              "') threw an exception: " +
              e.message
          )
        }
        return bytesWritten
      },
      allocate: function (stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8)
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28)
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43)
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138)
        }
        stream.stream_ops.allocate(stream, offset, length)
      },
      mmap: function (stream, address, length, position, prot, flags) {
        if (
          (prot & 2) !== 0 &&
          (flags & 2) === 0 &&
          (stream.flags & 2097155) !== 2
        ) {
          throw new FS.ErrnoError(2)
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2)
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43)
        }
        return stream.stream_ops.mmap(
          stream,
          address,
          length,
          position,
          prot,
          flags
        )
      },
      msync: function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0
        }
        return stream.stream_ops.msync(
          stream,
          buffer,
          offset,
          length,
          mmapFlags
        )
      },
      munmap: function (stream) {
        return 0
      },
      ioctl: function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
      },
      readFile: function (path, opts) {
        opts = opts || {}
        opts.flags = opts.flags || 0
        opts.encoding = opts.encoding || "binary"
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret
        var stream = FS.open(path, opts.flags)
        var stat = FS.stat(path)
        var length = stat.size
        var buf = new Uint8Array(length)
        FS.read(stream, buf, 0, length, 0)
        if (opts.encoding === "utf8") {
          ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
          ret = buf
        }
        FS.close(stream)
        return ret
      },
      writeFile: function (path, data, opts) {
        opts = opts || {}
        opts.flags = opts.flags || 577
        var stream = FS.open(path, opts.flags, opts.mode)
        if (typeof data === "string") {
          var buf = new Uint8Array(lengthBytesUTF8(data) + 1)
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length)
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
          throw new Error("Unsupported data type")
        }
        FS.close(stream)
      },
      cwd: function () {
        return FS.currentPath
      },
      chdir: function (path) {
        var lookup = FS.lookupPath(path, { follow: true })
        if (lookup.node === null) {
          throw new FS.ErrnoError(44)
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54)
        }
        var errCode = FS.nodePermissions(lookup.node, "x")
        if (errCode) {
          throw new FS.ErrnoError(errCode)
        }
        FS.currentPath = lookup.path
      },
      createDefaultDirectories: function () {
        FS.mkdir("/tmp")
        FS.mkdir("/home")
        FS.mkdir("/home/web_user")
      },
      createDefaultDevices: function () {
        FS.mkdir("/dev")
        FS.registerDevice(FS.makedev(1, 3), {
          read: function () {
            return 0
          },
          write: function (stream, buffer, offset, length, pos) {
            return length
          }
        })
        FS.mkdev("/dev/null", FS.makedev(1, 3))
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops)
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops)
        FS.mkdev("/dev/tty", FS.makedev(5, 0))
        FS.mkdev("/dev/tty1", FS.makedev(6, 0))
        var random_device = getRandomDevice()
        FS.createDevice("/dev", "random", random_device)
        FS.createDevice("/dev", "urandom", random_device)
        FS.mkdir("/dev/shm")
        FS.mkdir("/dev/shm/tmp")
      },
      createSpecialDirectories: function () {
        FS.mkdir("/proc")
        FS.mkdir("/proc/self")
        FS.mkdir("/proc/self/fd")
        FS.mount(
          {
            mount: function () {
              var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73)
              node.node_ops = {
                lookup: function (parent, name) {
                  var fd = +name
                  var stream = FS.getStream(fd)
                  if (!stream) throw new FS.ErrnoError(8)
                  var ret = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: {
                      readlink: function () {
                        return stream.path
                      }
                    }
                  }
                  ret.parent = ret
                  return ret
                }
              }
              return node
            }
          },
          {},
          "/proc/self/fd"
        )
      },
      createStandardStreams: function () {
        if (Module["stdin"]) {
          FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
          FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
          FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
          FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
          FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
          FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", 0)
        var stdout = FS.open("/dev/stdout", 1)
        var stderr = FS.open("/dev/stderr", 1)
      },
      ensureErrnoError: function () {
        if (FS.ErrnoError) return
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node
          this.setErrno = function (errno) {
            this.errno = errno
          }
          this.setErrno(errno)
          this.message = "FS error"
        }
        FS.ErrnoError.prototype = new Error()
        FS.ErrnoError.prototype.constructor = FS.ErrnoError
        ;[44].forEach(function (code) {
          FS.genericErrors[code] = new FS.ErrnoError(code)
          FS.genericErrors[code].stack = "<generic error, no stack>"
        })
      },
      staticInit: function () {
        FS.ensureErrnoError()
        FS.nameTable = new Array(4096)
        FS.mount(MEMFS, {}, "/")
        FS.createDefaultDirectories()
        FS.createDefaultDevices()
        FS.createSpecialDirectories()
        FS.filesystems = { MEMFS: MEMFS }
      },
      init: function (input, output, error) {
        FS.init.initialized = true
        FS.ensureErrnoError()
        Module["stdin"] = input || Module["stdin"]
        Module["stdout"] = output || Module["stdout"]
        Module["stderr"] = error || Module["stderr"]
        FS.createStandardStreams()
      },
      quit: function () {
        FS.init.initialized = false
        var fflush = Module["_fflush"]
        if (fflush) fflush(0)
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i]
          if (!stream) {
            continue
          }
          FS.close(stream)
        }
      },
      getMode: function (canRead, canWrite) {
        var mode = 0
        if (canRead) mode |= 292 | 73
        if (canWrite) mode |= 146
        return mode
      },
      findObject: function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink)
        if (ret.exists) {
          return ret.object
        } else {
          return null
        }
      },
      analyzePath: function (path, dontResolveLastLink) {
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink })
          path = lookup.path
        } catch (e) {}
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        }
        try {
          var lookup = FS.lookupPath(path, { parent: true })
          ret.parentExists = true
          ret.parentPath = lookup.path
          ret.parentObject = lookup.node
          ret.name = PATH.basename(path)
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink })
          ret.exists = true
          ret.path = lookup.path
          ret.object = lookup.node
          ret.name = lookup.node.name
          ret.isRoot = lookup.path === "/"
        } catch (e) {
          ret.error = e.errno
        }
        return ret
      },
      createPath: function (parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent)
        var parts = path.split("/").reverse()
        while (parts.length) {
          var part = parts.pop()
          if (!part) continue
          var current = PATH.join2(parent, part)
          try {
            FS.mkdir(current)
          } catch (e) {}
          parent = current
        }
        return current
      },
      createFile: function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
        var mode = FS.getMode(canRead, canWrite)
        return FS.create(path, mode)
      },
      createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name
          ? PATH.join2(
              typeof parent === "string" ? parent : FS.getPath(parent),
              name
            )
          : parent
        var mode = FS.getMode(canRead, canWrite)
        var node = FS.create(path, mode)
        if (data) {
          if (typeof data === "string") {
            var arr = new Array(data.length)
            for (var i = 0, len = data.length; i < len; ++i)
              arr[i] = data.charCodeAt(i)
            data = arr
          }
          FS.chmod(node, mode | 146)
          var stream = FS.open(node, 577)
          FS.write(stream, data, 0, data.length, 0, canOwn)
          FS.close(stream)
          FS.chmod(node, mode)
        }
        return node
      },
      createDevice: function (parent, name, input, output) {
        var path = PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
        var mode = FS.getMode(!!input, !!output)
        if (!FS.createDevice.major) FS.createDevice.major = 64
        var dev = FS.makedev(FS.createDevice.major++, 0)
        FS.registerDevice(dev, {
          open: function (stream) {
            stream.seekable = false
          },
          close: function (stream) {
            if (output && output.buffer && output.buffer.length) {
              output(10)
            }
          },
          read: function (stream, buffer, offset, length, pos) {
            var bytesRead = 0
            for (var i = 0; i < length; i++) {
              var result
              try {
                result = input()
              } catch (e) {
                throw new FS.ErrnoError(29)
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6)
              }
              if (result === null || result === undefined) break
              bytesRead++
              buffer[offset + i] = result
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now()
            }
            return bytesRead
          },
          write: function (stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i])
              } catch (e) {
                throw new FS.ErrnoError(29)
              }
            }
            if (length) {
              stream.node.timestamp = Date.now()
            }
            return i
          }
        })
        return FS.mkdev(path, mode, dev)
      },
      forceLoadFile: function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
          return true
        if (typeof XMLHttpRequest !== "undefined") {
          throw new Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
          )
        } else if (read_) {
          try {
            obj.contents = intArrayFromString(read_(obj.url), true)
            obj.usedBytes = obj.contents.length
          } catch (e) {
            throw new FS.ErrnoError(29)
          }
        } else {
          throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
      },
      createLazyFile: function (parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
          this.lengthKnown = false
          this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return undefined
          }
          var chunkOffset = idx % this.chunkSize
          var chunkNum = (idx / this.chunkSize) | 0
          return this.getter(chunkNum)[chunkOffset]
        }
        LazyUint8Array.prototype.setDataGetter =
          function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
          }
        LazyUint8Array.prototype.cacheLength =
          function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest()
            xhr.open("HEAD", url, false)
            xhr.send(null)
            if (
              !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
            )
              throw new Error(
                "Couldn't load " + url + ". Status: " + xhr.status
              )
            var datalength = Number(xhr.getResponseHeader("Content-length"))
            var header
            var hasByteServing =
              (header = xhr.getResponseHeader("Accept-Ranges")) &&
              header === "bytes"
            var usesGzip =
              (header = xhr.getResponseHeader("Content-Encoding")) &&
              header === "gzip"
            var chunkSize = 1024 * 1024
            if (!hasByteServing) chunkSize = datalength
            var doXHR = function (from, to) {
              if (from > to)
                throw new Error(
                  "invalid range (" +
                    from +
                    ", " +
                    to +
                    ") or no bytes requested!"
                )
              if (to > datalength - 1)
                throw new Error(
                  "only " + datalength + " bytes available! programmer error!"
                )
              var xhr = new XMLHttpRequest()
              xhr.open("GET", url, false)
              if (datalength !== chunkSize)
                xhr.setRequestHeader("Range", "bytes=" + from + "-" + to)
              if (typeof Uint8Array != "undefined")
                xhr.responseType = "arraybuffer"
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined")
              }
              xhr.send(null)
              if (
                !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
              )
                throw new Error(
                  "Couldn't load " + url + ". Status: " + xhr.status
                )
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || [])
              } else {
                return intArrayFromString(xhr.responseText || "", true)
              }
            }
            var lazyArray = this
            lazyArray.setDataGetter(function (chunkNum) {
              var start = chunkNum * chunkSize
              var end = (chunkNum + 1) * chunkSize - 1
              end = Math.min(end, datalength - 1)
              if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end)
              }
              if (typeof lazyArray.chunks[chunkNum] === "undefined")
                throw new Error("doXHR failed!")
              return lazyArray.chunks[chunkNum]
            })
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1
              datalength = this.getter(0).length
              chunkSize = datalength
              out(
                "LazyFiles on gzip forces download of the whole file when length is accessed"
              )
            }
            this._length = datalength
            this._chunkSize = chunkSize
            this.lengthKnown = true
          }
        if (typeof XMLHttpRequest !== "undefined") {
          if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"
          var lazyArray = new LazyUint8Array()
          Object.defineProperties(lazyArray, {
            length: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength()
                }
                return this._length
              }
            },
            chunkSize: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength()
                }
                return this._chunkSize
              }
            }
          })
          var properties = { isDevice: false, contents: lazyArray }
        } else {
          var properties = { isDevice: false, url: url }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite)
        if (properties.contents) {
          node.contents = properties.contents
        } else if (properties.url) {
          node.contents = null
          node.url = properties.url
        }
        Object.defineProperties(node, {
          usedBytes: {
            get: function () {
              return this.contents.length
            }
          }
        })
        var stream_ops = {}
        var keys = Object.keys(node.stream_ops)
        keys.forEach(function (key) {
          var fn = node.stream_ops[key]
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node)
            return fn.apply(null, arguments)
          }
        })
        stream_ops.read = function stream_ops_read(
          stream,
          buffer,
          offset,
          length,
          position
        ) {
          FS.forceLoadFile(node)
          var contents = stream.node.contents
          if (position >= contents.length) return 0
          var size = Math.min(contents.length - position, length)
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i]
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i)
            }
          }
          return size
        }
        node.stream_ops = stream_ops
        return node
      },
      createPreloadedFile: function (
        parent,
        name,
        url,
        canRead,
        canWrite,
        onload,
        onerror,
        dontCreateFile,
        canOwn,
        preFinish
      ) {
        Browser.init()
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent
        var dep = getUniqueRunDependency("cp " + fullname)
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish()
            if (!dontCreateFile) {
              FS.createDataFile(
                parent,
                name,
                byteArray,
                canRead,
                canWrite,
                canOwn
              )
            }
            if (onload) onload()
            removeRunDependency(dep)
          }
          var handled = false
          Module["preloadPlugins"].forEach(function (plugin) {
            if (handled) return
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, function () {
                if (onerror) onerror()
                removeRunDependency(dep)
              })
              handled = true
            }
          })
          if (!handled) finish(byteArray)
        }
        addRunDependency(dep)
        if (typeof url == "string") {
          Browser.asyncLoad(
            url,
            function (byteArray) {
              processData(byteArray)
            },
            onerror
          )
        } else {
          processData(url)
        }
      },
      indexedDB: function () {
        return (
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB
        )
      },
      DB_NAME: function () {
        return "EM_FS_" + window.location.pathname
      },
      DB_VERSION: 20,
      DB_STORE_NAME: "FILE_DATA",
      saveFilesToDB: function (paths, onload, onerror) {
        onload = onload || function () {}
        onerror = onerror || function () {}
        var indexedDB = FS.indexedDB()
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
          return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          out("creating db")
          var db = openRequest.result
          db.createObjectStore(FS.DB_STORE_NAME)
        }
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result
          var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite")
          var files = transaction.objectStore(FS.DB_STORE_NAME)
          var ok = 0,
            fail = 0,
            total = paths.length
          function finish() {
            if (fail == 0) onload()
            else onerror()
          }
          paths.forEach(function (path) {
            var putRequest = files.put(
              FS.analyzePath(path).object.contents,
              path
            )
            putRequest.onsuccess = function putRequest_onsuccess() {
              ok++
              if (ok + fail == total) finish()
            }
            putRequest.onerror = function putRequest_onerror() {
              fail++
              if (ok + fail == total) finish()
            }
          })
          transaction.onerror = onerror
        }
        openRequest.onerror = onerror
      },
      loadFilesFromDB: function (paths, onload, onerror) {
        onload = onload || function () {}
        onerror = onerror || function () {}
        var indexedDB = FS.indexedDB()
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
          return onerror(e)
        }
        openRequest.onupgradeneeded = onerror
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
          } catch (e) {
            onerror(e)
            return
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME)
          var ok = 0,
            fail = 0,
            total = paths.length
          function finish() {
            if (fail == 0) onload()
            else onerror()
          }
          paths.forEach(function (path) {
            var getRequest = files.get(path)
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path)
              }
              FS.createDataFile(
                PATH.dirname(path),
                PATH.basename(path),
                getRequest.result,
                true,
                true,
                true
              )
              ok++
              if (ok + fail == total) finish()
            }
            getRequest.onerror = function getRequest_onerror() {
              fail++
              if (ok + fail == total) finish()
            }
          })
          transaction.onerror = onerror
        }
        openRequest.onerror = onerror
      }
    }
    var SYSCALLS = {
      mappings: {},
      DEFAULT_POLLMASK: 5,
      umask: 511,
      calculateAt: function (dirfd, path) {
        if (path[0] !== "/") {
          var dir
          if (dirfd === -100) {
            dir = FS.cwd()
          } else {
            var dirstream = FS.getStream(dirfd)
            if (!dirstream) throw new FS.ErrnoError(8)
            dir = dirstream.path
          }
          path = PATH.join2(dir, path)
        }
        return path
      },
      doStat: function (func, path, buf) {
        try {
          var stat = func(path)
        } catch (e) {
          if (
            e &&
            e.node &&
            PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
          ) {
            return -54
          }
          throw e
        }
        HEAP32[buf >> 2] = stat.dev
        HEAP32[(buf + 4) >> 2] = 0
        HEAP32[(buf + 8) >> 2] = stat.ino
        HEAP32[(buf + 12) >> 2] = stat.mode
        HEAP32[(buf + 16) >> 2] = stat.nlink
        HEAP32[(buf + 20) >> 2] = stat.uid
        HEAP32[(buf + 24) >> 2] = stat.gid
        HEAP32[(buf + 28) >> 2] = stat.rdev
        HEAP32[(buf + 32) >> 2] = 0
        ;(tempI64 = [
          stat.size >>> 0,
          ((tempDouble = stat.size),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0)
        ]),
          (HEAP32[(buf + 40) >> 2] = tempI64[0]),
          (HEAP32[(buf + 44) >> 2] = tempI64[1])
        HEAP32[(buf + 48) >> 2] = 4096
        HEAP32[(buf + 52) >> 2] = stat.blocks
        HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0
        HEAP32[(buf + 60) >> 2] = 0
        HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0
        HEAP32[(buf + 68) >> 2] = 0
        HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0
        HEAP32[(buf + 76) >> 2] = 0
        ;(tempI64 = [
          stat.ino >>> 0,
          ((tempDouble = stat.ino),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0)
        ]),
          (HEAP32[(buf + 80) >> 2] = tempI64[0]),
          (HEAP32[(buf + 84) >> 2] = tempI64[1])
        return 0
      },
      doMsync: function (addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len)
        FS.msync(stream, buffer, offset, len, flags)
      },
      doMkdir: function (path, mode) {
        path = PATH.normalize(path)
        if (path[path.length - 1] === "/")
          path = path.substr(0, path.length - 1)
        FS.mkdir(path, mode, 0)
        return 0
      },
      doMknod: function (path, mode, dev) {
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break
          default:
            return -28
        }
        FS.mknod(path, mode, dev)
        return 0
      },
      doReadlink: function (path, buf, bufsize) {
        if (bufsize <= 0) return -28
        var ret = FS.readlink(path)
        var len = Math.min(bufsize, lengthBytesUTF8(ret))
        var endChar = HEAP8[buf + len]
        stringToUTF8(ret, buf, bufsize + 1)
        HEAP8[buf + len] = endChar
        return len
      },
      doAccess: function (path, amode) {
        if (amode & ~7) {
          return -28
        }
        var node
        var lookup = FS.lookupPath(path, { follow: true })
        node = lookup.node
        if (!node) {
          return -44
        }
        var perms = ""
        if (amode & 4) perms += "r"
        if (amode & 2) perms += "w"
        if (amode & 1) perms += "x"
        if (perms && FS.nodePermissions(node, perms)) {
          return -2
        }
        return 0
      },
      doDup: function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD)
        if (suggest) FS.close(suggest)
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
      },
      doReadv: function (stream, iov, iovcnt, offset) {
        var ret = 0
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(iov + i * 8) >> 2]
          var len = HEAP32[(iov + (i * 8 + 4)) >> 2]
          var curr = FS.read(stream, HEAP8, ptr, len, offset)
          if (curr < 0) return -1
          ret += curr
          if (curr < len) break
        }
        return ret
      },
      doWritev: function (stream, iov, iovcnt, offset) {
        var ret = 0
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(iov + i * 8) >> 2]
          var len = HEAP32[(iov + (i * 8 + 4)) >> 2]
          var curr = FS.write(stream, HEAP8, ptr, len, offset)
          if (curr < 0) return -1
          ret += curr
        }
        return ret
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4
        var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2]
        return ret
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr)
        return ret
      },
      getStreamFromFD: function (fd) {
        var stream = FS.getStream(fd)
        if (!stream) throw new FS.ErrnoError(8)
        return stream
      },
      get64: function (low, high) {
        return low
      }
    }
    function ___sys_access(path, amode) {
      try {
        path = SYSCALLS.getStr(path)
        return SYSCALLS.doAccess(path, amode)
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_chmod(path, mode) {
      try {
        path = SYSCALLS.getStr(path)
        FS.chmod(path, mode)
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function setErrNo(value) {
      HEAP32[___errno_location() >> 2] = value
      return value
    }
    function ___sys_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        switch (cmd) {
          case 0: {
            var arg = SYSCALLS.get()
            if (arg < 0) {
              return -28
            }
            var newStream
            newStream = FS.open(stream.path, stream.flags, 0, arg)
            return newStream.fd
          }
          case 1:
          case 2:
            return 0
          case 3:
            return stream.flags
          case 4: {
            var arg = SYSCALLS.get()
            stream.flags |= arg
            return 0
          }
          case 12: {
            var arg = SYSCALLS.get()
            var offset = 0
            HEAP16[(arg + offset) >> 1] = 2
            return 0
          }
          case 13:
          case 14:
            return 0
          case 16:
          case 8:
            return -28
          case 9:
            setErrNo(28)
            return -1
          default: {
            return -28
          }
        }
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_fstat64(fd, buf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        return SYSCALLS.doStat(FS.stat, stream.path, buf)
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_getdents64(fd, dirp, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        if (!stream.getdents) {
          stream.getdents = FS.readdir(stream.path)
        }
        var struct_size = 280
        var pos = 0
        var off = FS.llseek(stream, 0, 1)
        var idx = Math.floor(off / struct_size)
        while (idx < stream.getdents.length && pos + struct_size <= count) {
          var id
          var type
          var name = stream.getdents[idx]
          if (name[0] === ".") {
            id = 1
            type = 4
          } else {
            var child = FS.lookupNode(stream.node, name)
            id = child.id
            type = FS.isChrdev(child.mode)
              ? 2
              : FS.isDir(child.mode)
              ? 4
              : FS.isLink(child.mode)
              ? 10
              : 8
          }
          ;(tempI64 = [
            id >>> 0,
            ((tempDouble = id),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                    0) >>>
                  0
                : ~~+Math.ceil(
                    (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                  ) >>> 0
              : 0)
          ]),
            (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1])
          ;(tempI64 = [
            ((idx + 1) * struct_size) >>> 0,
            ((tempDouble = (idx + 1) * struct_size),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                    0) >>>
                  0
                : ~~+Math.ceil(
                    (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                  ) >>> 0
              : 0)
          ]),
            (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1])
          HEAP16[(dirp + pos + 16) >> 1] = 280
          HEAP8[(dirp + pos + 18) >> 0] = type
          stringToUTF8(name, dirp + pos + 19, 256)
          pos += struct_size
          idx += 1
        }
        FS.llseek(stream, idx * struct_size, 0)
        return pos
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        switch (op) {
          case 21509:
          case 21505: {
            if (!stream.tty) return -59
            return 0
          }
          case 21510:
          case 21511:
          case 21512:
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59
            return 0
          }
          case 21519: {
            if (!stream.tty) return -59
            var argp = SYSCALLS.get()
            HEAP32[argp >> 2] = 0
            return 0
          }
          case 21520: {
            if (!stream.tty) return -59
            return -28
          }
          case 21531: {
            var argp = SYSCALLS.get()
            return FS.ioctl(stream, op, argp)
          }
          case 21523: {
            if (!stream.tty) return -59
            return 0
          }
          case 21524: {
            if (!stream.tty) return -59
            return 0
          }
          default:
            abort("bad ioctl syscall " + op)
        }
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function syscallMmap2(addr, len, prot, flags, fd, off) {
      off <<= 12
      var ptr
      var allocated = false
      if ((flags & 16) !== 0 && addr % 16384 !== 0) {
        return -28
      }
      if ((flags & 32) !== 0) {
        ptr = _memalign(16384, len)
        if (!ptr) return -48
        _memset(ptr, 0, len)
        allocated = true
      } else {
        var info = FS.getStream(fd)
        if (!info) return -8
        var res = FS.mmap(info, addr, len, off, prot, flags)
        ptr = res.ptr
        allocated = res.allocated
      }
      SYSCALLS.mappings[ptr] = {
        malloc: ptr,
        len: len,
        allocated: allocated,
        fd: fd,
        prot: prot,
        flags: flags,
        offset: off
      }
      return ptr
    }
    function ___sys_mmap2(addr, len, prot, flags, fd, off) {
      try {
        return syscallMmap2(addr, len, prot, flags, fd, off)
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function syscallMunmap(addr, len) {
      if ((addr | 0) === -1 || len === 0) {
        return -28
      }
      var info = SYSCALLS.mappings[addr]
      if (!info) return 0
      if (len === info.len) {
        var stream = FS.getStream(info.fd)
        if (info.prot & 2) {
          SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset)
        }
        FS.munmap(stream)
        SYSCALLS.mappings[addr] = null
        if (info.allocated) {
          _free(info.malloc)
        }
      }
      return 0
    }
    function ___sys_munmap(addr, len) {
      try {
        return syscallMunmap(addr, len)
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_open(path, flags, varargs) {
      SYSCALLS.varargs = varargs
      try {
        var pathname = SYSCALLS.getStr(path)
        var mode = varargs ? SYSCALLS.get() : 0
        var stream = FS.open(pathname, flags, mode)
        return stream.fd
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function ___sys_stat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path)
        return SYSCALLS.doStat(FS.stat, path, buf)
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return -e.errno
      }
    }
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0
        case 2:
          return 1
        case 4:
          return 2
        case 8:
          return 3
        default:
          throw new TypeError("Unknown type size: " + size)
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256)
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i)
      }
      embind_charCodes = codes
    }
    var embind_charCodes = undefined
    function readLatin1String(ptr) {
      var ret = ""
      var c = ptr
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]]
      }
      return ret
    }
    var awaitingDependencies = {}
    var registeredTypes = {}
    var typeDependencies = {}
    var char_0 = 48
    var char_9 = 57
    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown"
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$")
      var f = name.charCodeAt(0)
      if (f >= char_0 && f <= char_9) {
        return "_" + name
      } else {
        return name
      }
    }
    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name)
      return new Function(
        "body",
        "return function " +
          name +
          "() {\n" +
          '    "use strict";' +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body)
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName
        this.message = message
        var stack = new Error(message).stack
        if (stack !== undefined) {
          this.stack =
            this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
        }
      })
      errorClass.prototype = Object.create(baseErrorType.prototype)
      errorClass.prototype.constructor = errorClass
      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name
        } else {
          return this.name + ": " + this.message
        }
      }
      return errorClass
    }
    var BindingError = undefined
    function throwBindingError(message) {
      throw new BindingError(message)
    }
    var InternalError = undefined
    function throwInternalError(message) {
      throw new InternalError(message)
    }
    function whenDependentTypesAreResolved(
      myTypes,
      dependentTypes,
      getTypeConverters
    ) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes
      })
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters)
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count")
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i])
        }
      }
      var typeConverters = new Array(dependentTypes.length)
      var unregisteredTypes = []
      var registered = 0
      dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt]
        } else {
          unregisteredTypes.push(dt)
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = []
          }
          awaitingDependencies[dt].push(function () {
            typeConverters[i] = registeredTypes[dt]
            ++registered
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters)
            }
          })
        }
      })
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters)
      }
    }
    function registerType(rawType, registeredInstance, options) {
      options = options || {}
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        )
      }
      var name = registeredInstance.name
      if (!rawType) {
        throwBindingError(
          'type "' + name + '" must have a positive integer typeid pointer'
        )
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return
        } else {
          throwBindingError("Cannot register type '" + name + "' twice")
        }
      }
      registeredTypes[rawType] = registeredInstance
      delete typeDependencies[rawType]
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType]
        delete awaitingDependencies[rawType]
        callbacks.forEach(function (cb) {
          cb()
        })
      }
    }
    function __embind_register_bool(
      rawType,
      name,
      size,
      trueValue,
      falseValue
    ) {
      var shift = getShiftFromSize(size)
      name = readLatin1String(name)
      registerType(rawType, {
        name: name,
        fromWireType: function (wt) {
          return !!wt
        },
        toWireType: function (destructors, o) {
          return o ? trueValue : falseValue
        },
        argPackAdvance: 8,
        readValueFromPointer: function (pointer) {
          var heap
          if (size === 1) {
            heap = HEAP8
          } else if (size === 2) {
            heap = HEAP16
          } else if (size === 4) {
            heap = HEAP32
          } else {
            throw new TypeError("Unknown boolean type size: " + name)
          }
          return this["fromWireType"](heap[pointer >> shift])
        },
        destructorFunction: null
      })
    }
    var emval_free_list = []
    var emval_handle_array = [
      {},
      { value: undefined },
      { value: null },
      { value: true },
      { value: false }
    ]
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined
        emval_free_list.push(handle)
      }
    }
    function count_emval_handles() {
      var count = 0
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count
        }
      }
      return count
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i]
        }
      }
      return null
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles
      Module["get_first_emval"] = get_first_emval
    }
    function __emval_register(value) {
      switch (value) {
        case undefined: {
          return 1
        }
        case null: {
          return 2
        }
        case true: {
          return 3
        }
        case false: {
          return 4
        }
        default: {
          var handle = emval_free_list.length
            ? emval_free_list.pop()
            : emval_handle_array.length
          emval_handle_array[handle] = { refcount: 1, value: value }
          return handle
        }
      }
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2])
    }
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name)
      registerType(rawType, {
        name: name,
        fromWireType: function (handle) {
          var rv = emval_handle_array[handle].value
          __emval_decref(handle)
          return rv
        },
        toWireType: function (destructors, value) {
          return __emval_register(value)
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null
      })
    }
    function _embind_repr(v) {
      if (v === null) {
        return "null"
      }
      var t = typeof v
      if (t === "object" || t === "array" || t === "function") {
        return v.toString()
      } else {
        return "" + v
      }
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2])
          }
        case 3:
          return function (pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3])
          }
        default:
          throw new TypeError("Unknown float type: " + name)
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size)
      name = readLatin1String(name)
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          return value
        },
        toWireType: function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            )
          }
          return value
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null
      })
    }
    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof constructor +
            " which is not a function"
        )
      }
      var dummy = createNamedFunction(
        constructor.name || "unknownFunctionName",
        function () {}
      )
      dummy.prototype = constructor.prototype
      var obj = new dummy()
      var r = constructor.apply(obj, argumentList)
      return r instanceof Object ? r : obj
    }
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop()
        var del = destructors.pop()
        del(ptr)
      }
    }
    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc
    ) {
      var argCount = argTypes.length
      if (argCount < 2) {
        throwBindingError(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        )
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null
      var needsDestructorStack = false
      for (var i = 1; i < argTypes.length; ++i) {
        if (
          argTypes[i] !== null &&
          argTypes[i].destructorFunction === undefined
        ) {
          needsDestructorStack = true
          break
        }
      }
      var returns = argTypes[0].name !== "void"
      var argsList = ""
      var argsListWired = ""
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
      }
      var invokerFnBody =
        "return function " +
        makeLegalFunctionName(humanName) +
        "(" +
        argsList +
        ") {\n" +
        "if (arguments.length !== " +
        (argCount - 2) +
        ") {\n" +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        "}\n"
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n"
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null"
      var args1 = [
        "throwBindingError",
        "invoker",
        "fn",
        "runDestructors",
        "retType",
        "classParam"
      ]
      var args2 = [
        throwBindingError,
        cppInvokerFunc,
        cppTargetFunc,
        runDestructors,
        argTypes[0],
        argTypes[1]
      ]
      if (isClassMethodFunc) {
        invokerFnBody +=
          "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n"
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
          "var arg" +
          i +
          "Wired = argType" +
          i +
          ".toWireType(" +
          dtorStack +
          ", arg" +
          i +
          "); // " +
          argTypes[i + 2].name +
          "\n"
        args1.push("argType" + i)
        args2.push(argTypes[i + 2])
      }
      if (isClassMethodFunc) {
        argsListWired =
          "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired
      }
      invokerFnBody +=
        (returns ? "var rv = " : "") +
        "invoker(fn" +
        (argsListWired.length > 0 ? ", " : "") +
        argsListWired +
        ");\n"
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n"
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired"
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody +=
              paramName +
              "_dtor(" +
              paramName +
              "); // " +
              argTypes[i].name +
              "\n"
            args1.push(paramName + "_dtor")
            args2.push(argTypes[i].destructorFunction)
          }
        }
      }
      if (returns) {
        invokerFnBody +=
          "var ret = retType.fromWireType(rv);\n" + "return ret;\n"
      } else {
      }
      invokerFnBody += "}\n"
      args1.push(invokerFnBody)
      var invokerFunction = new_(Function, args1).apply(null, args2)
      return invokerFunction
    }
    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName]
        proto[methodName] = function () {
          if (
            !proto[methodName].overloadTable.hasOwnProperty(arguments.length)
          ) {
            throwBindingError(
              "Function '" +
                humanName +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                proto[methodName].overloadTable +
                ")!"
            )
          }
          return proto[methodName].overloadTable[arguments.length].apply(
            this,
            arguments
          )
        }
        proto[methodName].overloadTable = []
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable &&
            undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError("Cannot register public name '" + name + "' twice")
        }
        ensureOverloadTable(Module, name, name)
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              numArguments +
              ")!"
          )
        }
        Module[name].overloadTable[numArguments] = value
      } else {
        Module[name] = value
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments
        }
      }
    }
    function heap32VectorToArray(count, firstElement) {
      var array = []
      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i])
      }
      return array
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol")
      }
      if (
        undefined !== Module[name].overloadTable &&
        undefined !== numArguments
      ) {
        Module[name].overloadTable[numArguments] = value
      } else {
        Module[name] = value
        Module[name].argCount = numArguments
      }
    }
    function dynCallLegacy(sig, ptr, args) {
      if (args && args.length) {
        return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
      }
      return Module["dynCall_" + sig].call(null, ptr)
    }
    function dynCall(sig, ptr, args) {
      if (sig.indexOf("j") != -1) {
        return dynCallLegacy(sig, ptr, args)
      }
      return wasmTable.get(ptr).apply(null, args)
    }
    function getDynCaller(sig, ptr) {
      assert(
        sig.indexOf("j") >= 0,
        "getDynCaller should only be called with i64 sigs"
      )
      var argCache = []
      return function () {
        argCache.length = arguments.length
        for (var i = 0; i < arguments.length; i++) {
          argCache[i] = arguments[i]
        }
        return dynCall(sig, ptr, argCache)
      }
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature)
      function makeDynCaller() {
        if (signature.indexOf("j") != -1) {
          return getDynCaller(signature, rawFunction)
        }
        return wasmTable.get(rawFunction)
      }
      var fp = makeDynCaller()
      if (typeof fp !== "function") {
        throwBindingError(
          "unknown function pointer with signature " +
            signature +
            ": " +
            rawFunction
        )
      }
      return fp
    }
    var UnboundTypeError = undefined
    function getTypeName(type) {
      var ptr = ___getTypeName(type)
      var rv = readLatin1String(ptr)
      _free(ptr)
      return rv
    }
    function throwUnboundTypeError(message, types) {
      var unboundTypes = []
      var seen = {}
      function visit(type) {
        if (seen[type]) {
          return
        }
        if (registeredTypes[type]) {
          return
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit)
          return
        }
        unboundTypes.push(type)
        seen[type] = true
      }
      types.forEach(visit)
      throw new UnboundTypeError(
        message + ": " + unboundTypes.map(getTypeName).join([", "])
      )
    }
    function __embind_register_function(
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn
    ) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr)
      name = readLatin1String(name)
      rawInvoker = embind__requireFunction(signature, rawInvoker)
      exposePublicSymbol(
        name,
        function () {
          throwUnboundTypeError(
            "Cannot call " + name + " due to unbound types",
            argTypes
          )
        },
        argCount - 1
      )
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1))
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn),
          argCount - 1
        )
        return []
      })
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed
            ? function readS8FromPointer(pointer) {
                return HEAP8[pointer]
              }
            : function readU8FromPointer(pointer) {
                return HEAPU8[pointer]
              }
        case 1:
          return signed
            ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1]
              }
            : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1]
              }
        case 2:
          return signed
            ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2]
              }
            : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2]
              }
        default:
          throw new TypeError("Unknown integer type: " + name)
      }
    }
    function __embind_register_integer(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {
      name = readLatin1String(name)
      if (maxRange === -1) {
        maxRange = 4294967295
      }
      var shift = getShiftFromSize(size)
      var fromWireType = function (value) {
        return value
      }
      if (minRange === 0) {
        var bitshift = 32 - 8 * size
        fromWireType = function (value) {
          return (value << bitshift) >>> bitshift
        }
      }
      var isUnsignedType = name.indexOf("unsigned") != -1
      registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            )
          }
          if (value < minRange || value > maxRange) {
            throw new TypeError(
              'Passing a number "' +
                _embind_repr(value) +
                '" from JS side to C/C++ side to an argument of type "' +
                name +
                '", which is outside the valid range [' +
                minRange +
                ", " +
                maxRange +
                "]!"
            )
          }
          return isUnsignedType ? value >>> 0 : value | 0
        },
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(
          name,
          shift,
          minRange !== 0
        ),
        destructorFunction: null
      })
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
      ]
      var TA = typeMapping[dataTypeIndex]
      function decodeMemoryView(handle) {
        handle = handle >> 2
        var heap = HEAPU32
        var size = heap[handle]
        var data = heap[handle + 1]
        return new TA(buffer, data, size)
      }
      name = readLatin1String(name)
      registerType(
        rawType,
        {
          name: name,
          fromWireType: decodeMemoryView,
          argPackAdvance: 8,
          readValueFromPointer: decodeMemoryView
        },
        { ignoreDuplicateRegistrations: true }
      )
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name)
      var stdStringIsUTF8 = name === "std::string"
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2]
          var str
          if (stdStringIsUTF8) {
            var decodeStartPtr = value + 4
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead)
                if (str === undefined) {
                  str = stringSegment
                } else {
                  str += String.fromCharCode(0)
                  str += stringSegment
                }
                decodeStartPtr = currentBytePtr + 1
              }
            }
          } else {
            var a = new Array(length)
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i])
            }
            str = a.join("")
          }
          _free(value)
          return str
        },
        toWireType: function (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value)
          }
          var getLength
          var valueIsOfTypeString = typeof value === "string"
          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError("Cannot pass non-string to std::string")
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = function () {
              return lengthBytesUTF8(value)
            }
          } else {
            getLength = function () {
              return value.length
            }
          }
          var length = getLength()
          var ptr = _malloc(4 + length + 1)
          HEAPU32[ptr >> 2] = length
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1)
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i)
                if (charCode > 255) {
                  _free(ptr)
                  throwBindingError(
                    "String has UTF-16 code units that do not fit in 8 bits"
                  )
                }
                HEAPU8[ptr + 4 + i] = charCode
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i]
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, ptr)
          }
          return ptr
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr)
        }
      })
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name)
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift
      if (charSize === 2) {
        decodeString = UTF16ToString
        encodeString = stringToUTF16
        lengthBytesUTF = lengthBytesUTF16
        getHeap = function () {
          return HEAPU16
        }
        shift = 1
      } else if (charSize === 4) {
        decodeString = UTF32ToString
        encodeString = stringToUTF32
        lengthBytesUTF = lengthBytesUTF32
        getHeap = function () {
          return HEAPU32
        }
        shift = 2
      }
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2]
          var HEAP = getHeap()
          var str
          var decodeStartPtr = value + 4
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize
            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes)
              if (str === undefined) {
                str = stringSegment
              } else {
                str += String.fromCharCode(0)
                str += stringSegment
              }
              decodeStartPtr = currentBytePtr + charSize
            }
          }
          _free(value)
          return str
        },
        toWireType: function (destructors, value) {
          if (!(typeof value === "string")) {
            throwBindingError(
              "Cannot pass non-string to C++ string type " + name
            )
          }
          var length = lengthBytesUTF(value)
          var ptr = _malloc(4 + length + charSize)
          HEAPU32[ptr >> 2] = length >> shift
          encodeString(value, ptr + 4, length + charSize)
          if (destructors !== null) {
            destructors.push(_free, ptr)
          }
          return ptr
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr)
        }
      })
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name)
      registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function () {
          return undefined
        },
        toWireType: function (destructors, o) {
          return undefined
        }
      })
    }
    function _abort() {
      abort()
    }
    var _emscripten_get_now
    if (ENVIRONMENT_IS_NODE) {
      _emscripten_get_now = function () {
        var t = process["hrtime"]()
        return t[0] * 1e3 + t[1] / 1e6
      }
    } else if (typeof dateNow !== "undefined") {
      _emscripten_get_now = dateNow
    } else
      _emscripten_get_now = function () {
        return performance.now()
      }
    var _emscripten_get_now_is_monotonic = true
    function _clock_gettime(clk_id, tp) {
      var now
      if (clk_id === 0) {
        now = Date.now()
      } else if (
        (clk_id === 1 || clk_id === 4) &&
        _emscripten_get_now_is_monotonic
      ) {
        now = _emscripten_get_now()
      } else {
        setErrNo(28)
        return -1
      }
      HEAP32[tp >> 2] = (now / 1e3) | 0
      HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0
      return 0
    }
    function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode
      Browser.mainLoop.timingValue = value
      if (!Browser.mainLoop.func) {
        return 1
      }
      if (mode == 0) {
        Browser.mainLoop.scheduler =
          function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick =
              Math.max(
                0,
                Browser.mainLoop.tickStartTime + value - _emscripten_get_now()
              ) | 0
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
          }
        Browser.mainLoop.method = "timeout"
      } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner)
        }
        Browser.mainLoop.method = "rAF"
      } else if (mode == 2) {
        if (typeof setImmediate === "undefined") {
          var setImmediates = []
          var emscriptenMainLoopMessageId = "setimmediate"
          var Browser_setImmediate_messageHandler = function (event) {
            if (
              event.data === emscriptenMainLoopMessageId ||
              event.data.target === emscriptenMainLoopMessageId
            ) {
              event.stopPropagation()
              setImmediates.shift()()
            }
          }
          addEventListener("message", Browser_setImmediate_messageHandler, true)
          setImmediate = function Browser_emulated_setImmediate(func) {
            setImmediates.push(func)
            if (ENVIRONMENT_IS_WORKER) {
              if (Module["setImmediates"] === undefined)
                Module["setImmediates"] = []
              Module["setImmediates"].push(func)
              postMessage({ target: emscriptenMainLoopMessageId })
            } else postMessage(emscriptenMainLoopMessageId, "*")
          }
        }
        Browser.mainLoop.scheduler =
          function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
          }
        Browser.mainLoop.method = "immediate"
      }
      return 0
    }
    function setMainLoop(
      browserIterationFunc,
      fps,
      simulateInfiniteLoop,
      arg,
      noSetTiming
    ) {
      noExitRuntime = true
      assert(
        !Browser.mainLoop.func,
        "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
      )
      Browser.mainLoop.func = browserIterationFunc
      Browser.mainLoop.arg = arg
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now()
          var blocker = Browser.mainLoop.queue.shift()
          blocker.func(blocker.arg)
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers
            var next =
              remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining)
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next
            } else {
              next = next + 0.5
              Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
            }
          }
          console.log(
            'main loop blocker "' +
              blocker.name +
              '" took ' +
              (Date.now() - start) +
              " ms"
          )
          Browser.mainLoop.updateStatus()
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return
          setTimeout(Browser.mainLoop.runner, 0)
          return
        }
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return
        Browser.mainLoop.currentFrameNumber =
          (Browser.mainLoop.currentFrameNumber + 1) | 0
        if (
          Browser.mainLoop.timingMode == 1 &&
          Browser.mainLoop.timingValue > 1 &&
          Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue !=
            0
        ) {
          Browser.mainLoop.scheduler()
          return
        } else if (Browser.mainLoop.timingMode == 0) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        Browser.mainLoop.runIter(browserIterationFunc)
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return
        if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData)
          SDL.audio.queueNewAudioData()
        Browser.mainLoop.scheduler()
      }
      if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps)
        else _emscripten_set_main_loop_timing(1, 1)
        Browser.mainLoop.scheduler()
      }
      if (simulateInfiniteLoop) {
        throw "unwind"
      }
    }
    var Browser = {
      mainLoop: {
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function () {
          Browser.mainLoop.scheduler = null
          Browser.mainLoop.currentlyRunningMainloop++
        },
        resume: function () {
          Browser.mainLoop.currentlyRunningMainloop++
          var timingMode = Browser.mainLoop.timingMode
          var timingValue = Browser.mainLoop.timingValue
          var func = Browser.mainLoop.func
          Browser.mainLoop.func = null
          setMainLoop(func, 0, false, Browser.mainLoop.arg, true)
          _emscripten_set_main_loop_timing(timingMode, timingValue)
          Browser.mainLoop.scheduler()
        },
        updateStatus: function () {
          if (Module["setStatus"]) {
            var message = Module["statusMessage"] || "Please wait..."
            var remaining = Browser.mainLoop.remainingBlockers
            var expected = Browser.mainLoop.expectedBlockers
            if (remaining) {
              if (remaining < expected) {
                Module["setStatus"](
                  message + " (" + (expected - remaining) + "/" + expected + ")"
                )
              } else {
                Module["setStatus"](message)
              }
            } else {
              Module["setStatus"]("")
            }
          }
        },
        runIter: function (func) {
          if (ABORT) return
          if (Module["preMainLoop"]) {
            var preRet = Module["preMainLoop"]()
            if (preRet === false) {
              return
            }
          }
          try {
            func()
          } catch (e) {
            if (e instanceof ExitStatus) {
              return
            } else if (e == "unwind") {
              return
            } else {
              if (e && typeof e === "object" && e.stack)
                err("exception thrown: " + [e, e.stack])
              throw e
            }
          }
          if (Module["postMainLoop"]) Module["postMainLoop"]()
        }
      },
      isFullscreen: false,
      pointerLock: false,
      moduleContextCreatedCallbacks: [],
      workers: [],
      init: function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []
        if (Browser.initted) return
        Browser.initted = true
        try {
          new Blob()
          Browser.hasBlobConstructor = true
        } catch (e) {
          Browser.hasBlobConstructor = false
          console.log(
            "warning: no blob constructor, cannot create blobs with mimetypes"
          )
        }
        Browser.BlobBuilder =
          typeof MozBlobBuilder != "undefined"
            ? MozBlobBuilder
            : typeof WebKitBlobBuilder != "undefined"
            ? WebKitBlobBuilder
            : !Browser.hasBlobConstructor
            ? console.log("warning: no BlobBuilder")
            : null
        Browser.URLObject =
          typeof window != "undefined"
            ? window.URL
              ? window.URL
              : window.webkitURL
            : undefined
        if (
          !Module.noImageDecoding &&
          typeof Browser.URLObject === "undefined"
        ) {
          console.log(
            "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
          )
          Module.noImageDecoding = true
        }
        var imagePlugin = {}
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        }
        imagePlugin["handle"] = function imagePlugin_handle(
          byteArray,
          name,
          onload,
          onerror
        ) {
          var b = null
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) })
              if (b.size !== byteArray.length) {
                b = new Blob([new Uint8Array(byteArray).buffer], {
                  type: Browser.getMimetype(name)
                })
              }
            } catch (e) {
              warnOnce(
                "Blob constructor present but fails: " +
                  e +
                  "; falling back to blob builder"
              )
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder()
            bb.append(new Uint8Array(byteArray).buffer)
            b = bb.getBlob()
          }
          var url = Browser.URLObject.createObjectURL(b)
          var img = new Image()
          img.onload = function img_onload() {
            assert(img.complete, "Image " + name + " could not be decoded")
            var canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            var ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0)
            Module["preloadedImages"][name] = canvas
            Browser.URLObject.revokeObjectURL(url)
            if (onload) onload(byteArray)
          }
          img.onerror = function img_onerror(event) {
            console.log("Image " + url + " could not be decoded")
            if (onerror) onerror()
          }
          img.src = url
        }
        Module["preloadPlugins"].push(imagePlugin)
        var audioPlugin = {}
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
          return (
            !Module.noAudioDecoding &&
            name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }
          )
        }
        audioPlugin["handle"] = function audioPlugin_handle(
          byteArray,
          name,
          onload,
          onerror
        ) {
          var done = false
          function finish(audio) {
            if (done) return
            done = true
            Module["preloadedAudios"][name] = audio
            if (onload) onload(byteArray)
          }
          function fail() {
            if (done) return
            done = true
            Module["preloadedAudios"][name] = new Audio()
            if (onerror) onerror()
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], {
                type: Browser.getMimetype(name)
              })
            } catch (e) {
              return fail()
            }
            var url = Browser.URLObject.createObjectURL(b)
            var audio = new Audio()
            audio.addEventListener(
              "canplaythrough",
              function () {
                finish(audio)
              },
              false
            )
            audio.onerror = function audio_onerror(event) {
              if (done) return
              console.log(
                "warning: browser could not fully decode audio " +
                  name +
                  ", trying slower base64 approach"
              )
              function encode64(data) {
                var BASE =
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                var PAD = "="
                var ret = ""
                var leftchar = 0
                var leftbits = 0
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i]
                  leftbits += 8
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits - 6)) & 63
                    leftbits -= 6
                    ret += BASE[curr]
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar & 3) << 4]
                  ret += PAD + PAD
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar & 15) << 2]
                  ret += PAD
                }
                return ret
              }
              audio.src =
                "data:audio/x-" +
                name.substr(-3) +
                ";base64," +
                encode64(byteArray)
              finish(audio)
            }
            audio.src = url
            Browser.safeSetTimeout(function () {
              finish(audio)
            }, 1e4)
          } else {
            return fail()
          }
        }
        Module["preloadPlugins"].push(audioPlugin)
        function pointerLockChange() {
          Browser.pointerLock =
            document["pointerLockElement"] === Module["canvas"] ||
            document["mozPointerLockElement"] === Module["canvas"] ||
            document["webkitPointerLockElement"] === Module["canvas"] ||
            document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"]
        if (canvas) {
          canvas.requestPointerLock =
            canvas["requestPointerLock"] ||
            canvas["mozRequestPointerLock"] ||
            canvas["webkitRequestPointerLock"] ||
            canvas["msRequestPointerLock"] ||
            function () {}
          canvas.exitPointerLock =
            document["exitPointerLock"] ||
            document["mozExitPointerLock"] ||
            document["webkitExitPointerLock"] ||
            document["msExitPointerLock"] ||
            function () {}
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document)
          document.addEventListener(
            "pointerlockchange",
            pointerLockChange,
            false
          )
          document.addEventListener(
            "mozpointerlockchange",
            pointerLockChange,
            false
          )
          document.addEventListener(
            "webkitpointerlockchange",
            pointerLockChange,
            false
          )
          document.addEventListener(
            "mspointerlockchange",
            pointerLockChange,
            false
          )
          if (Module["elementPointerLock"]) {
            canvas.addEventListener(
              "click",
              function (ev) {
                if (
                  !Browser.pointerLock &&
                  Module["canvas"].requestPointerLock
                ) {
                  Module["canvas"].requestPointerLock()
                  ev.preventDefault()
                }
              },
              false
            )
          }
        }
      },
      createContext: function (
        canvas,
        useWebGL,
        setInModule,
        webGLContextAttributes
      ) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx
        var ctx
        var contextHandle
        if (useWebGL) {
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: typeof WebGL2RenderingContext !== "undefined" ? 2 : 1
          }
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute]
            }
          }
          if (typeof GL !== "undefined") {
            contextHandle = GL.createContext(canvas, contextAttributes)
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx
            }
          }
        } else {
          ctx = canvas.getContext("2d")
        }
        if (!ctx) return null
        if (setInModule) {
          if (!useWebGL)
            assert(
              typeof GLctx === "undefined",
              "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
            )
          Module.ctx = ctx
          if (useWebGL) GL.makeContextCurrent(contextHandle)
          Module.useWebGL = useWebGL
          Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
            callback()
          })
          Browser.init()
        }
        return ctx
      },
      destroyContext: function (canvas, useWebGL, setInModule) {},
      fullscreenHandlersInstalled: false,
      lockPointer: undefined,
      resizeCanvas: undefined,
      requestFullscreen: function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer
        Browser.resizeCanvas = resizeCanvas
        if (typeof Browser.lockPointer === "undefined")
          Browser.lockPointer = true
        if (typeof Browser.resizeCanvas === "undefined")
          Browser.resizeCanvas = false
        var canvas = Module["canvas"]
        function fullscreenChange() {
          Browser.isFullscreen = false
          var canvasContainer = canvas.parentNode
          if (
            (document["fullscreenElement"] ||
              document["mozFullScreenElement"] ||
              document["msFullscreenElement"] ||
              document["webkitFullscreenElement"] ||
              document["webkitCurrentFullScreenElement"]) === canvasContainer
          ) {
            canvas.exitFullscreen = Browser.exitFullscreen
            if (Browser.lockPointer) canvas.requestPointerLock()
            Browser.isFullscreen = true
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize()
            } else {
              Browser.updateCanvasDimensions(canvas)
            }
          } else {
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer)
            canvasContainer.parentNode.removeChild(canvasContainer)
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize()
            } else {
              Browser.updateCanvasDimensions(canvas)
            }
          }
          if (Module["onFullScreen"])
            Module["onFullScreen"](Browser.isFullscreen)
          if (Module["onFullscreen"])
            Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true
          document.addEventListener("fullscreenchange", fullscreenChange, false)
          document.addEventListener(
            "mozfullscreenchange",
            fullscreenChange,
            false
          )
          document.addEventListener(
            "webkitfullscreenchange",
            fullscreenChange,
            false
          )
          document.addEventListener(
            "MSFullscreenChange",
            fullscreenChange,
            false
          )
        }
        var canvasContainer = document.createElement("div")
        canvas.parentNode.insertBefore(canvasContainer, canvas)
        canvasContainer.appendChild(canvas)
        canvasContainer.requestFullscreen =
          canvasContainer["requestFullscreen"] ||
          canvasContainer["mozRequestFullScreen"] ||
          canvasContainer["msRequestFullscreen"] ||
          (canvasContainer["webkitRequestFullscreen"]
            ? function () {
                canvasContainer["webkitRequestFullscreen"](
                  Element["ALLOW_KEYBOARD_INPUT"]
                )
              }
            : null) ||
          (canvasContainer["webkitRequestFullScreen"]
            ? function () {
                canvasContainer["webkitRequestFullScreen"](
                  Element["ALLOW_KEYBOARD_INPUT"]
                )
              }
            : null)
        canvasContainer.requestFullscreen()
      },
      exitFullscreen: function () {
        if (!Browser.isFullscreen) {
          return false
        }
        var CFS =
          document["exitFullscreen"] ||
          document["cancelFullScreen"] ||
          document["mozCancelFullScreen"] ||
          document["msExitFullscreen"] ||
          document["webkitCancelFullScreen"] ||
          function () {}
        CFS.apply(document, [])
        return true
      },
      nextRAF: 0,
      fakeRequestAnimationFrame: function (func) {
        var now = Date.now()
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1e3 / 60
        } else {
          while (now + 2 >= Browser.nextRAF) {
            Browser.nextRAF += 1e3 / 60
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0)
        setTimeout(func, delay)
      },
      requestAnimationFrame: function (func) {
        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(func)
          return
        }
        var RAF = Browser.fakeRequestAnimationFrame
        RAF(func)
      },
      safeCallback: function (func) {
        return function () {
          if (!ABORT) return func.apply(null, arguments)
        }
      },
      allowAsyncCallbacks: true,
      queuedAsyncCallbacks: [],
      pauseAsyncCallbacks: function () {
        Browser.allowAsyncCallbacks = false
      },
      resumeAsyncCallbacks: function () {
        Browser.allowAsyncCallbacks = true
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks
          Browser.queuedAsyncCallbacks = []
          callbacks.forEach(function (func) {
            func()
          })
        }
      },
      safeRequestAnimationFrame: function (func) {
        return Browser.requestAnimationFrame(function () {
          if (ABORT) return
          if (Browser.allowAsyncCallbacks) {
            func()
          } else {
            Browser.queuedAsyncCallbacks.push(func)
          }
        })
      },
      safeSetTimeout: function (func, timeout) {
        noExitRuntime = true
        return setTimeout(function () {
          if (ABORT) return
          if (Browser.allowAsyncCallbacks) {
            func()
          } else {
            Browser.queuedAsyncCallbacks.push(func)
          }
        }, timeout)
      },
      safeSetInterval: function (func, timeout) {
        noExitRuntime = true
        return setInterval(function () {
          if (ABORT) return
          if (Browser.allowAsyncCallbacks) {
            func()
          }
        }, timeout)
      },
      getMimetype: function (name) {
        return {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          bmp: "image/bmp",
          ogg: "audio/ogg",
          wav: "audio/wav",
          mp3: "audio/mpeg"
        }[name.substr(name.lastIndexOf(".") + 1)]
      },
      getUserMedia: function (func) {
        if (!window.getUserMedia) {
          window.getUserMedia =
            navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
      },
      getMovementX: function (event) {
        return (
          event["movementX"] ||
          event["mozMovementX"] ||
          event["webkitMovementX"] ||
          0
        )
      },
      getMovementY: function (event) {
        return (
          event["movementY"] ||
          event["mozMovementY"] ||
          event["webkitMovementY"] ||
          0
        )
      },
      getMouseWheelDelta: function (event) {
        var delta = 0
        switch (event.type) {
          case "DOMMouseScroll":
            delta = event.detail / 3
            break
          case "mousewheel":
            delta = event.wheelDelta / 120
            break
          case "wheel":
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:
                delta /= 100
                break
              case 1:
                delta /= 3
                break
              case 2:
                delta *= 80
                break
              default:
                throw "unrecognized mouse wheel delta mode: " + event.deltaMode
            }
            break
          default:
            throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
      },
      mouseX: 0,
      mouseY: 0,
      mouseMovementX: 0,
      mouseMovementY: 0,
      touches: {},
      lastTouches: {},
      calculateMouseEvent: function (event) {
        if (Browser.pointerLock) {
          if (event.type != "mousemove" && "mozMovementX" in event) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event)
            Browser.mouseMovementY = Browser.getMovementY(event)
          }
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
          } else {
            Browser.mouseX += Browser.mouseMovementX
            Browser.mouseY += Browser.mouseMovementY
          }
        } else {
          var rect = Module["canvas"].getBoundingClientRect()
          var cw = Module["canvas"].width
          var ch = Module["canvas"].height
          var scrollX =
            typeof window.scrollX !== "undefined"
              ? window.scrollX
              : window.pageXOffset
          var scrollY =
            typeof window.scrollY !== "undefined"
              ? window.scrollY
              : window.pageYOffset
          if (
            event.type === "touchstart" ||
            event.type === "touchend" ||
            event.type === "touchmove"
          ) {
            var touch = event.touch
            if (touch === undefined) {
              return
            }
            var adjustedX = touch.pageX - (scrollX + rect.left)
            var adjustedY = touch.pageY - (scrollY + rect.top)
            adjustedX = adjustedX * (cw / rect.width)
            adjustedY = adjustedY * (ch / rect.height)
            var coords = { x: adjustedX, y: adjustedY }
            if (event.type === "touchstart") {
              Browser.lastTouches[touch.identifier] = coords
              Browser.touches[touch.identifier] = coords
            } else if (
              event.type === "touchend" ||
              event.type === "touchmove"
            ) {
              var last = Browser.touches[touch.identifier]
              if (!last) last = coords
              Browser.lastTouches[touch.identifier] = last
              Browser.touches[touch.identifier] = coords
            }
            return
          }
          var x = event.pageX - (scrollX + rect.left)
          var y = event.pageY - (scrollY + rect.top)
          x = x * (cw / rect.width)
          y = y * (ch / rect.height)
          Browser.mouseMovementX = x - Browser.mouseX
          Browser.mouseMovementY = y - Browser.mouseY
          Browser.mouseX = x
          Browser.mouseY = y
        }
      },
      asyncLoad: function (url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : ""
        readAsync(
          url,
          function (arrayBuffer) {
            assert(
              arrayBuffer,
              'Loading data file "' + url + '" failed (no arrayBuffer).'
            )
            onload(new Uint8Array(arrayBuffer))
            if (dep) removeRunDependency(dep)
          },
          function (event) {
            if (onerror) {
              onerror()
            } else {
              throw 'Loading data file "' + url + '" failed.'
            }
          }
        )
        if (dep) addRunDependency(dep)
      },
      resizeListeners: [],
      updateResizeListeners: function () {
        var canvas = Module["canvas"]
        Browser.resizeListeners.forEach(function (listener) {
          listener(canvas.width, canvas.height)
        })
      },
      setCanvasSize: function (width, height, noUpdates) {
        var canvas = Module["canvas"]
        Browser.updateCanvasDimensions(canvas, width, height)
        if (!noUpdates) Browser.updateResizeListeners()
      },
      windowedWidth: 0,
      windowedHeight: 0,
      setFullscreenCanvasSize: function () {
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[SDL.screen >> 2]
          flags = flags | 8388608
          HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"])
        Browser.updateResizeListeners()
      },
      setWindowedCanvasSize: function () {
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[SDL.screen >> 2]
          flags = flags & ~8388608
          HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"])
        Browser.updateResizeListeners()
      },
      updateCanvasDimensions: function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative
          canvas.heightNative = hNative
        } else {
          wNative = canvas.widthNative
          hNative = canvas.heightNative
        }
        var w = wNative
        var h = hNative
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
          if (w / h < Module["forcedAspectRatio"]) {
            w = Math.round(h * Module["forcedAspectRatio"])
          } else {
            h = Math.round(w / Module["forcedAspectRatio"])
          }
        }
        if (
          (document["fullscreenElement"] ||
            document["mozFullScreenElement"] ||
            document["msFullscreenElement"] ||
            document["webkitFullscreenElement"] ||
            document["webkitCurrentFullScreenElement"]) === canvas.parentNode &&
          typeof screen != "undefined"
        ) {
          var factor = Math.min(screen.width / w, screen.height / h)
          w = Math.round(w * factor)
          h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
          if (canvas.width != w) canvas.width = w
          if (canvas.height != h) canvas.height = h
          if (typeof canvas.style != "undefined") {
            canvas.style.removeProperty("width")
            canvas.style.removeProperty("height")
          }
        } else {
          if (canvas.width != wNative) canvas.width = wNative
          if (canvas.height != hNative) canvas.height = hNative
          if (typeof canvas.style != "undefined") {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty("width", w + "px", "important")
              canvas.style.setProperty("height", h + "px", "important")
            } else {
              canvas.style.removeProperty("width")
              canvas.style.removeProperty("height")
            }
          }
        }
      },
      wgetRequests: {},
      nextWgetRequestHandle: 0,
      getNextWgetRequestHandle: function () {
        var handle = Browser.nextWgetRequestHandle
        Browser.nextWgetRequestHandle++
        return handle
      }
    }
    var EGL = {
      errorCode: 12288,
      defaultDisplayInitialized: false,
      currentContext: 0,
      currentReadSurface: 0,
      currentDrawSurface: 0,
      contextAttributes: {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false
      },
      stringCache: {},
      setErrorCode: function (code) {
        EGL.errorCode = code
      },
      chooseConfig: function (
        display,
        attribList,
        config,
        config_size,
        numConfigs
      ) {
        if (display != 62e3) {
          EGL.setErrorCode(12296)
          return 0
        }
        if (attribList) {
          for (;;) {
            var param = HEAP32[attribList >> 2]
            if (param == 12321) {
              var alphaSize = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.alpha = alphaSize > 0
            } else if (param == 12325) {
              var depthSize = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.depth = depthSize > 0
            } else if (param == 12326) {
              var stencilSize = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.stencil = stencilSize > 0
            } else if (param == 12337) {
              var samples = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.antialias = samples > 0
            } else if (param == 12338) {
              var samples = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.antialias = samples == 1
            } else if (param == 12544) {
              var requestedPriority = HEAP32[(attribList + 4) >> 2]
              EGL.contextAttributes.lowLatency = requestedPriority != 12547
            } else if (param == 12344) {
              break
            }
            attribList += 8
          }
        }
        if ((!config || !config_size) && !numConfigs) {
          EGL.setErrorCode(12300)
          return 0
        }
        if (numConfigs) {
          HEAP32[numConfigs >> 2] = 1
        }
        if (config && config_size > 0) {
          HEAP32[config >> 2] = 62002
        }
        EGL.setErrorCode(12288)
        return 1
      }
    }
    function _eglBindAPI(api) {
      if (api == 12448) {
        EGL.setErrorCode(12288)
        return 1
      } else {
        EGL.setErrorCode(12300)
        return 0
      }
    }
    function _eglChooseConfig(
      display,
      attrib_list,
      configs,
      config_size,
      numConfigs
    ) {
      return EGL.chooseConfig(
        display,
        attrib_list,
        configs,
        config_size,
        numConfigs
      )
    }
    function __webgl_enable_ANGLE_instanced_arrays(ctx) {
      var ext = ctx.getExtension("ANGLE_instanced_arrays")
      if (ext) {
        ctx["vertexAttribDivisor"] = function (index, divisor) {
          ext["vertexAttribDivisorANGLE"](index, divisor)
        }
        ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
          ext["drawArraysInstancedANGLE"](mode, first, count, primcount)
        }
        ctx["drawElementsInstanced"] = function (
          mode,
          count,
          type,
          indices,
          primcount
        ) {
          ext["drawElementsInstancedANGLE"](
            mode,
            count,
            type,
            indices,
            primcount
          )
        }
        return 1
      }
    }
    function __webgl_enable_OES_vertex_array_object(ctx) {
      var ext = ctx.getExtension("OES_vertex_array_object")
      if (ext) {
        ctx["createVertexArray"] = function () {
          return ext["createVertexArrayOES"]()
        }
        ctx["deleteVertexArray"] = function (vao) {
          ext["deleteVertexArrayOES"](vao)
        }
        ctx["bindVertexArray"] = function (vao) {
          ext["bindVertexArrayOES"](vao)
        }
        ctx["isVertexArray"] = function (vao) {
          return ext["isVertexArrayOES"](vao)
        }
        return 1
      }
    }
    function __webgl_enable_WEBGL_draw_buffers(ctx) {
      var ext = ctx.getExtension("WEBGL_draw_buffers")
      if (ext) {
        ctx["drawBuffers"] = function (n, bufs) {
          ext["drawBuffersWEBGL"](n, bufs)
        }
        return 1
      }
    }
    function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(
      ctx
    ) {
      return !!(ctx.dibvbi = ctx.getExtension(
        "WEBGL_draw_instanced_base_vertex_base_instance"
      ))
    }
    function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
      ctx
    ) {
      return !!(ctx.mdibvbi = ctx.getExtension(
        "WEBGL_multi_draw_instanced_base_vertex_base_instance"
      ))
    }
    function __webgl_enable_WEBGL_multi_draw(ctx) {
      return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"))
    }
    var GL = {
      counter: 1,
      buffers: [],
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      uniforms: [],
      shaders: [],
      vaos: [],
      contexts: [],
      offscreenCanvases: {},
      timerQueriesEXT: [],
      queries: [],
      samplers: [],
      transformFeedbacks: [],
      syncs: [],
      programInfos: {},
      stringCache: {},
      stringiCache: {},
      unpackAlignment: 4,
      recordError: function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode
        }
      },
      getNewId: function (table) {
        var ret = GL.counter++
        for (var i = table.length; i < ret; i++) {
          table[i] = null
        }
        return ret
      },
      getSource: function (shader, count, string, length) {
        var source = ""
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAP32[(length + i * 4) >> 2] : -1
          source += UTF8ToString(
            HEAP32[(string + i * 4) >> 2],
            len < 0 ? undefined : len
          )
        }
        return source
      },
      createContext: function (canvas, webGLContextAttributes) {
        var ctx =
          webGLContextAttributes.majorVersion > 1
            ? canvas.getContext("webgl2", webGLContextAttributes)
            : canvas.getContext("webgl", webGLContextAttributes)
        if (!ctx) return 0
        var handle = GL.registerContext(ctx, webGLContextAttributes)
        return handle
      },
      registerContext: function (ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts)
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        }
        if (ctx.canvas) ctx.canvas.GLctxObject = context
        GL.contexts[handle] = context
        if (
          typeof webGLContextAttributes.enableExtensionsByDefault ===
            "undefined" ||
          webGLContextAttributes.enableExtensionsByDefault
        ) {
          GL.initExtensions(context)
        }
        return handle
      },
      makeContextCurrent: function (contextHandle) {
        GL.currentContext = GL.contexts[contextHandle]
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx
        return !(contextHandle && !GLctx)
      },
      getContext: function (contextHandle) {
        return GL.contexts[contextHandle]
      },
      deleteContext: function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle])
          GL.currentContext = null
        if (typeof JSEvents === "object")
          JSEvents.removeAllHandlersOnTarget(
            GL.contexts[contextHandle].GLctx.canvas
          )
        if (
          GL.contexts[contextHandle] &&
          GL.contexts[contextHandle].GLctx.canvas
        )
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined
        GL.contexts[contextHandle] = null
      },
      initExtensions: function (context) {
        if (!context) context = GL.currentContext
        if (context.initExtensionsDone) return
        context.initExtensionsDone = true
        var GLctx = context.GLctx
        __webgl_enable_ANGLE_instanced_arrays(GLctx)
        __webgl_enable_OES_vertex_array_object(GLctx)
        __webgl_enable_WEBGL_draw_buffers(GLctx)
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx)
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
          GLctx
        )
        GLctx.disjointTimerQueryExt = GLctx.getExtension(
          "EXT_disjoint_timer_query"
        )
        __webgl_enable_WEBGL_multi_draw(GLctx)
        var exts = GLctx.getSupportedExtensions() || []
        exts.forEach(function (ext) {
          if (ext.indexOf("lose_context") < 0 && ext.indexOf("debug") < 0) {
            GLctx.getExtension(ext)
          }
        })
      },
      populateUniformTable: function (program) {
        var p = GL.programs[program]
        var ptable = (GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0,
          maxAttributeLength: -1,
          maxUniformBlockNameLength: -1
        })
        var utable = ptable.uniforms
        var numUniforms = GLctx.getProgramParameter(p, 35718)
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i)
          var name = u.name
          ptable.maxUniformLength = Math.max(
            ptable.maxUniformLength,
            name.length + 1
          )
          if (name.slice(-1) == "]") {
            name = name.slice(0, name.lastIndexOf("["))
          }
          var loc = GLctx.getUniformLocation(p, name)
          if (loc) {
            var id = GL.getNewId(GL.uniforms)
            utable[name] = [u.size, id]
            GL.uniforms[id] = loc
            for (var j = 1; j < u.size; ++j) {
              var n = name + "[" + j + "]"
              loc = GLctx.getUniformLocation(p, n)
              id = GL.getNewId(GL.uniforms)
              GL.uniforms[id] = loc
            }
          }
        }
      }
    }
    function _eglCreateContext(display, config, hmm, contextAttribs) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      var glesContextVersion = 1
      for (;;) {
        var param = HEAP32[contextAttribs >> 2]
        if (param == 12440) {
          glesContextVersion = HEAP32[(contextAttribs + 4) >> 2]
        } else if (param == 12344) {
          break
        } else {
          EGL.setErrorCode(12292)
          return 0
        }
        contextAttribs += 8
      }
      if (glesContextVersion < 2 || glesContextVersion > 3) {
        EGL.setErrorCode(12293)
        return 0
      }
      EGL.contextAttributes.majorVersion = glesContextVersion - 1
      EGL.contextAttributes.minorVersion = 0
      EGL.context = GL.createContext(Module["canvas"], EGL.contextAttributes)
      if (EGL.context != 0) {
        EGL.setErrorCode(12288)
        GL.makeContextCurrent(EGL.context)
        Module.useWebGL = true
        Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
          callback()
        })
        GL.makeContextCurrent(null)
        return 62004
      } else {
        EGL.setErrorCode(12297)
        return 0
      }
    }
    function _eglCreateWindowSurface(display, config, win, attrib_list) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (config != 62002) {
        EGL.setErrorCode(12293)
        return 0
      }
      EGL.setErrorCode(12288)
      return 62006
    }
    function _eglDestroyContext(display, context) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (context != 62004) {
        EGL.setErrorCode(12294)
        return 0
      }
      GL.deleteContext(EGL.context)
      EGL.setErrorCode(12288)
      if (EGL.currentContext == context) {
        EGL.currentContext = 0
      }
      return 1
    }
    function _eglDestroySurface(display, surface) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (surface != 62006) {
        EGL.setErrorCode(12301)
        return 1
      }
      if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0
      }
      if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0
      }
      EGL.setErrorCode(12288)
      return 1
    }
    function _eglGetCurrentContext() {
      return EGL.currentContext
    }
    function _eglGetCurrentDisplay() {
      return EGL.currentContext ? 62e3 : 0
    }
    function _eglGetCurrentSurface(readdraw) {
      if (readdraw == 12378) {
        return EGL.currentReadSurface
      } else if (readdraw == 12377) {
        return EGL.currentDrawSurface
      } else {
        EGL.setErrorCode(12300)
        return 0
      }
    }
    function _eglGetDisplay(nativeDisplayType) {
      EGL.setErrorCode(12288)
      return 62e3
    }
    function _eglGetError() {
      return EGL.errorCode
    }
    function _eglGetProcAddress(name_) {
      return _emscripten_GetProcAddress(name_)
    }
    function _eglInitialize(display, majorVersion, minorVersion) {
      if (display == 62e3) {
        if (majorVersion) {
          HEAP32[majorVersion >> 2] = 1
        }
        if (minorVersion) {
          HEAP32[minorVersion >> 2] = 4
        }
        EGL.defaultDisplayInitialized = true
        EGL.setErrorCode(12288)
        return 1
      } else {
        EGL.setErrorCode(12296)
        return 0
      }
    }
    function _eglMakeCurrent(display, draw, read, context) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (context != 0 && context != 62004) {
        EGL.setErrorCode(12294)
        return 0
      }
      if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006)) {
        EGL.setErrorCode(12301)
        return 0
      }
      GL.makeContextCurrent(context ? EGL.context : null)
      EGL.currentContext = context
      EGL.currentDrawSurface = draw
      EGL.currentReadSurface = read
      EGL.setErrorCode(12288)
      return 1
    }
    function _eglQueryString(display, name) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      EGL.setErrorCode(12288)
      if (EGL.stringCache[name]) return EGL.stringCache[name]
      var ret
      switch (name) {
        case 12371:
          ret = allocateUTF8("Emscripten")
          break
        case 12372:
          ret = allocateUTF8("1.4 Emscripten EGL")
          break
        case 12373:
          ret = allocateUTF8("")
          break
        case 12429:
          ret = allocateUTF8("OpenGL_ES")
          break
        default:
          EGL.setErrorCode(12300)
          return 0
      }
      EGL.stringCache[name] = ret
      return ret
    }
    function _eglQuerySurface(display, surface, attribute, value) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (surface != 62006) {
        EGL.setErrorCode(12301)
        return 0
      }
      if (!value) {
        EGL.setErrorCode(12300)
        return 0
      }
      EGL.setErrorCode(12288)
      switch (attribute) {
        case 12328:
          HEAP32[value >> 2] = 62002
          return 1
        case 12376:
          return 1
        case 12375:
          HEAP32[value >> 2] = Module["canvas"].width
          return 1
        case 12374:
          HEAP32[value >> 2] = Module["canvas"].height
          return 1
        case 12432:
          HEAP32[value >> 2] = -1
          return 1
        case 12433:
          HEAP32[value >> 2] = -1
          return 1
        case 12434:
          HEAP32[value >> 2] = -1
          return 1
        case 12422:
          HEAP32[value >> 2] = 12420
          return 1
        case 12441:
          HEAP32[value >> 2] = 12442
          return 1
        case 12435:
          HEAP32[value >> 2] = 12437
          return 1
        case 12416:
        case 12417:
        case 12418:
        case 12419:
          return 1
        default:
          EGL.setErrorCode(12292)
          return 0
      }
    }
    function _eglSwapBuffers() {
      if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(12289)
      } else if (!Module.ctx) {
        EGL.setErrorCode(12290)
      } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(12302)
      } else {
        EGL.setErrorCode(12288)
        return 1
      }
      return 0
    }
    function _eglSwapInterval(display, interval) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      if (interval == 0) _emscripten_set_main_loop_timing(0, 0)
      else _emscripten_set_main_loop_timing(1, interval)
      EGL.setErrorCode(12288)
      return 1
    }
    function _eglTerminate(display) {
      if (display != 62e3) {
        EGL.setErrorCode(12296)
        return 0
      }
      EGL.currentContext = 0
      EGL.currentReadSurface = 0
      EGL.currentDrawSurface = 0
      EGL.defaultDisplayInitialized = false
      EGL.setErrorCode(12288)
      return 1
    }
    function _emscripten_asm_const_int(code, sigPtr, argbuf) {
      var args = readAsmConstArgs(sigPtr, argbuf)
      return ASM_CONSTS[code].apply(null, args)
    }
    function _emscripten_async_call(func, arg, millis) {
      noExitRuntime = true
      function wrapper() {
        wasmTable.get(func)(arg)
      }
      if (millis >= 0) {
        Browser.safeSetTimeout(wrapper, millis)
      } else {
        Browser.safeRequestAnimationFrame(wrapper)
      }
    }
    function _emscripten_async_wget(url, file, onload, onerror) {
      noExitRuntime = true
      var _url = UTF8ToString(url)
      var _file = UTF8ToString(file)
      _file = PATH_FS.resolve(_file)
      function doCallback(callback) {
        if (callback) {
          var stack = stackSave()
          wasmTable.get(callback)(
            allocate(intArrayFromString(_file), ALLOC_STACK)
          )
          stackRestore(stack)
        }
      }
      var destinationDirectory = PATH.dirname(_file)
      FS.createPreloadedFile(
        destinationDirectory,
        PATH.basename(_file),
        _url,
        true,
        true,
        function () {
          doCallback(onload)
        },
        function () {
          doCallback(onerror)
        },
        false,
        false,
        function () {
          try {
            FS.unlink(_file)
          } catch (e) {}
          FS.mkdirTree(destinationDirectory)
        }
      )
    }
    function _emscripten_async_wget_data(url, arg, onload, onerror) {
      Browser.asyncLoad(
        UTF8ToString(url),
        function (byteArray) {
          var buffer = _malloc(byteArray.length)
          HEAPU8.set(byteArray, buffer)
          wasmTable.get(onload)(arg, buffer, byteArray.length)
          _free(buffer)
        },
        function () {
          if (onerror) wasmTable.get(onerror)(arg)
        },
        true
      )
    }
    function _emscripten_cancel_main_loop() {
      Browser.mainLoop.pause()
      Browser.mainLoop.func = null
    }
    function traverseStack(args) {
      if (!args || !args.callee || !args.callee.name) {
        return [null, "", ""]
      }
      var funstr = args.callee.toString()
      var funcname = args.callee.name
      var str = "("
      var first = true
      for (var i in args) {
        var a = args[i]
        if (!first) {
          str += ", "
        }
        first = false
        if (typeof a === "number" || typeof a === "string") {
          str += a
        } else {
          str += "(" + typeof a + ")"
        }
      }
      str += ")"
      var caller = args.callee.caller
      args = caller ? caller.arguments : []
      if (first) str = ""
      return [args, funcname, str]
    }
    function _emscripten_get_callstack_js(flags) {
      var callstack = jsStackTrace()
      var iThisFunc = callstack.lastIndexOf("_emscripten_log")
      var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack")
      var iNextLine =
        callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1
      callstack = callstack.slice(iNextLine)
      if (flags & 32) {
        warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring")
      }
      if (flags & 8 && typeof emscripten_source_map === "undefined") {
        warnOnce(
          'Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.'
        )
        flags ^= 8
        flags |= 16
      }
      var stack_args = null
      if (flags & 128) {
        stack_args = traverseStack(arguments)
        while (stack_args[1].indexOf("_emscripten_") >= 0)
          stack_args = traverseStack(stack_args[0])
      }
      var lines = callstack.split("\n")
      callstack = ""
      var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)")
      var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?")
      var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)")
      for (var l in lines) {
        var line = lines[l]
        var symbolName = ""
        var file = ""
        var lineno = 0
        var column = 0
        var parts = chromeRe.exec(line)
        if (parts && parts.length == 5) {
          symbolName = parts[1]
          file = parts[2]
          lineno = parts[3]
          column = parts[4]
        } else {
          parts = newFirefoxRe.exec(line)
          if (!parts) parts = firefoxRe.exec(line)
          if (parts && parts.length >= 4) {
            symbolName = parts[1]
            file = parts[2]
            lineno = parts[3]
            column = parts[4] | 0
          } else {
            callstack += line + "\n"
            continue
          }
        }
        var haveSourceMap = false
        if (flags & 8) {
          var orig = emscripten_source_map.originalPositionFor({
            line: lineno,
            column: column
          })
          haveSourceMap = orig && orig.source
          if (haveSourceMap) {
            if (flags & 64) {
              orig.source = orig.source.substring(
                orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1
              )
            }
            callstack +=
              "    at " +
              symbolName +
              " (" +
              orig.source +
              ":" +
              orig.line +
              ":" +
              orig.column +
              ")\n"
          }
        }
        if (flags & 16 || !haveSourceMap) {
          if (flags & 64) {
            file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1)
          }
          callstack +=
            (haveSourceMap ? "     = " + symbolName : "    at " + symbolName) +
            " (" +
            file +
            ":" +
            lineno +
            ":" +
            column +
            ")\n"
        }
        if (flags & 128 && stack_args[0]) {
          if (stack_args[1] == symbolName && stack_args[2].length > 0) {
            callstack = callstack.replace(/\s+$/, "")
            callstack += " with values: " + stack_args[1] + stack_args[2] + "\n"
          }
          stack_args = traverseStack(stack_args[0])
        }
      }
      callstack = callstack.replace(/\s+$/, "")
      return callstack
    }
    function _emscripten_get_callstack(flags, str, maxbytes) {
      var callstack = _emscripten_get_callstack_js(flags)
      if (!str || maxbytes <= 0) {
        return lengthBytesUTF8(callstack) + 1
      }
      var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes)
      return bytesWrittenExcludingNull + 1
    }
    var JSEvents = {
      inEventHandler: 0,
      removeAllEventListeners: function () {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
          JSEvents._removeHandler(i)
        }
        JSEvents.eventHandlers = []
        JSEvents.deferredCalls = []
      },
      registerRemoveEventListeners: function () {
        if (!JSEvents.removeEventListenersRegistered) {
          __ATEXIT__.push(JSEvents.removeAllEventListeners)
          JSEvents.removeEventListenersRegistered = true
        }
      },
      deferredCalls: [],
      deferCall: function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false
          }
          return true
        }
        for (var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i]
          if (
            call.targetFunction == targetFunction &&
            arraysHaveEqualContent(call.argsList, argsList)
          ) {
            return
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        })
        JSEvents.deferredCalls.sort(function (x, y) {
          return x.precedence < y.precedence
        })
      },
      removeDeferredCalls: function (targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1)
            --i
          }
        }
      },
      canPerformEventHandlerRequests: function () {
        return (
          JSEvents.inEventHandler &&
          JSEvents.currentEventHandler.allowsDeferredCalls
        )
      },
      runDeferredCalls: function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i]
          JSEvents.deferredCalls.splice(i, 1)
          --i
          call.targetFunction.apply(null, call.argsList)
        }
      },
      eventHandlers: [],
      removeAllHandlersOnTarget: function (target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (
            JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString ||
              eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
          ) {
            JSEvents._removeHandler(i--)
          }
        }
      },
      _removeHandler: function (i) {
        var h = JSEvents.eventHandlers[i]
        h.target.removeEventListener(
          h.eventTypeString,
          h.eventListenerFunc,
          h.useCapture
        )
        JSEvents.eventHandlers.splice(i, 1)
      },
      registerOrRemoveHandler: function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          ++JSEvents.inEventHandler
          JSEvents.currentEventHandler = eventHandler
          JSEvents.runDeferredCalls()
          eventHandler.handlerFunc(event)
          JSEvents.runDeferredCalls()
          --JSEvents.inEventHandler
        }
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler
          eventHandler.target.addEventListener(
            eventHandler.eventTypeString,
            jsEventHandler,
            eventHandler.useCapture
          )
          JSEvents.eventHandlers.push(eventHandler)
          JSEvents.registerRemoveEventListeners()
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (
              JSEvents.eventHandlers[i].target == eventHandler.target &&
              JSEvents.eventHandlers[i].eventTypeString ==
                eventHandler.eventTypeString
            ) {
              JSEvents._removeHandler(i--)
            }
          }
        }
      },
      getNodeNameForTarget: function (target) {
        if (!target) return ""
        if (target == window) return "#window"
        if (target == screen) return "#screen"
        return target && target.nodeName ? target.nodeName : ""
      },
      fullscreenEnabled: function () {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled
      }
    }
    function maybeCStringToJsString(cString) {
      return cString > 2 ? UTF8ToString(cString) : cString
    }
    var specialHTMLTargets = [
      0,
      typeof document !== "undefined" ? document : 0,
      typeof window !== "undefined" ? window : 0
    ]
    function findEventTarget(target) {
      target = maybeCStringToJsString(target)
      var domElement =
        specialHTMLTargets[target] ||
        (typeof document !== "undefined"
          ? document.querySelector(target)
          : undefined)
      return domElement
    }
    function findCanvasEventTarget(target) {
      return findEventTarget(target)
    }
    function _emscripten_get_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target)
      if (!canvas) return -4
      HEAP32[width >> 2] = canvas.width
      HEAP32[height >> 2] = canvas.height
    }
    function _emscripten_get_device_pixel_ratio() {
      return (typeof devicePixelRatio === "number" && devicePixelRatio) || 1
    }
    function __getBoundingClientRect(e) {
      return specialHTMLTargets.indexOf(e) < 0
        ? e.getBoundingClientRect()
        : { left: 0, top: 0 }
    }
    function _emscripten_get_element_css_size(target, width, height) {
      target = findEventTarget(target)
      if (!target) return -4
      var rect = __getBoundingClientRect(target)
      HEAPF64[width >> 3] = rect.width
      HEAPF64[height >> 3] = rect.height
      return 0
    }
    function _emscripten_get_preloaded_image_data(path, w, h) {
      if ((path | 0) === path) path = UTF8ToString(path)
      path = PATH_FS.resolve(path)
      var canvas = Module["preloadedImages"][path]
      if (canvas) {
        var ctx = canvas.getContext("2d")
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height)
        var buf = _malloc(canvas.width * canvas.height * 4)
        HEAPU8.set(image.data, buf)
        HEAP32[w >> 2] = canvas.width
        HEAP32[h >> 2] = canvas.height
        return buf
      }
      return 0
    }
    function _emscripten_glActiveTexture(x0) {
      GLctx["activeTexture"](x0)
    }
    function _emscripten_glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader])
    }
    function _emscripten_glBeginQuery(target, id) {
      GLctx["beginQuery"](target, GL.queries[id])
    }
    function _emscripten_glBeginQueryEXT(target, id) {
      GLctx.disjointTimerQueryExt["beginQueryEXT"](
        target,
        GL.timerQueriesEXT[id]
      )
    }
    function _emscripten_glBeginTransformFeedback(x0) {
      GLctx["beginTransformFeedback"](x0)
    }
    function _emscripten_glBindAttribLocation(program, index, name) {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
    }
    function _emscripten_glBindBuffer(target, buffer) {
      if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
      } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
      }
      GLctx.bindBuffer(target, GL.buffers[buffer])
    }
    function _emscripten_glBindBufferBase(target, index, buffer) {
      GLctx["bindBufferBase"](target, index, GL.buffers[buffer])
    }
    function _emscripten_glBindBufferRange(
      target,
      index,
      buffer,
      offset,
      ptrsize
    ) {
      GLctx["bindBufferRange"](
        target,
        index,
        GL.buffers[buffer],
        offset,
        ptrsize
      )
    }
    function _emscripten_glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
    }
    function _emscripten_glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
    }
    function _emscripten_glBindSampler(unit, sampler) {
      GLctx["bindSampler"](unit, GL.samplers[sampler])
    }
    function _emscripten_glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture])
    }
    function _emscripten_glBindTransformFeedback(target, id) {
      GLctx["bindTransformFeedback"](target, GL.transformFeedbacks[id])
    }
    function _emscripten_glBindVertexArray(vao) {
      GLctx["bindVertexArray"](GL.vaos[vao])
    }
    function _emscripten_glBindVertexArrayOES(vao) {
      GLctx["bindVertexArray"](GL.vaos[vao])
    }
    function _emscripten_glBlendColor(x0, x1, x2, x3) {
      GLctx["blendColor"](x0, x1, x2, x3)
    }
    function _emscripten_glBlendEquation(x0) {
      GLctx["blendEquation"](x0)
    }
    function _emscripten_glBlendEquationSeparate(x0, x1) {
      GLctx["blendEquationSeparate"](x0, x1)
    }
    function _emscripten_glBlendFunc(x0, x1) {
      GLctx["blendFunc"](x0, x1)
    }
    function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
      GLctx["blendFuncSeparate"](x0, x1, x2, x3)
    }
    function _emscripten_glBlitFramebuffer(
      x0,
      x1,
      x2,
      x3,
      x4,
      x5,
      x6,
      x7,
      x8,
      x9
    ) {
      GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9)
    }
    function _emscripten_glBufferData(target, size, data, usage) {
      if (GL.currentContext.version >= 2) {
        if (data) {
          GLctx.bufferData(target, HEAPU8, usage, data, size)
        } else {
          GLctx.bufferData(target, size, usage)
        }
      } else {
        GLctx.bufferData(
          target,
          data ? HEAPU8.subarray(data, data + size) : size,
          usage
        )
      }
    }
    function _emscripten_glBufferSubData(target, offset, size, data) {
      if (GL.currentContext.version >= 2) {
        GLctx.bufferSubData(target, offset, HEAPU8, data, size)
        return
      }
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
    }
    function _emscripten_glCheckFramebufferStatus(x0) {
      return GLctx["checkFramebufferStatus"](x0)
    }
    function _emscripten_glClear(x0) {
      GLctx["clear"](x0)
    }
    function _emscripten_glClearBufferfi(x0, x1, x2, x3) {
      GLctx["clearBufferfi"](x0, x1, x2, x3)
    }
    function _emscripten_glClearBufferfv(buffer, drawbuffer, value) {
      GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2)
    }
    function _emscripten_glClearBufferiv(buffer, drawbuffer, value) {
      GLctx["clearBufferiv"](buffer, drawbuffer, HEAP32, value >> 2)
    }
    function _emscripten_glClearBufferuiv(buffer, drawbuffer, value) {
      GLctx["clearBufferuiv"](buffer, drawbuffer, HEAPU32, value >> 2)
    }
    function _emscripten_glClearColor(x0, x1, x2, x3) {
      GLctx["clearColor"](x0, x1, x2, x3)
    }
    function _emscripten_glClearDepthf(x0) {
      GLctx["clearDepth"](x0)
    }
    function _emscripten_glClearStencil(x0) {
      GLctx["clearStencil"](x0)
    }
    function convertI32PairToI53(lo, hi) {
      return (lo >>> 0) + hi * 4294967296
    }
    function _emscripten_glClientWaitSync(sync, flags, timeoutLo, timeoutHi) {
      return GLctx.clientWaitSync(
        GL.syncs[sync],
        flags,
        convertI32PairToI53(timeoutLo, timeoutHi)
      )
    }
    function _emscripten_glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
    }
    function _emscripten_glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader])
    }
    function _emscripten_glCompressedTexImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      imageSize,
      data
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx["compressedTexImage2D"](
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            imageSize,
            data
          )
        } else {
          GLctx["compressedTexImage2D"](
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            HEAPU8,
            data,
            imageSize
          )
        }
        return
      }
      GLctx["compressedTexImage2D"](
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        data ? HEAPU8.subarray(data, data + imageSize) : null
      )
    }
    function _emscripten_glCompressedTexImage3D(
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      imageSize,
      data
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexImage3D"](
          target,
          level,
          internalFormat,
          width,
          height,
          depth,
          border,
          imageSize,
          data
        )
      } else {
        GLctx["compressedTexImage3D"](
          target,
          level,
          internalFormat,
          width,
          height,
          depth,
          border,
          HEAPU8,
          data,
          imageSize
        )
      }
    }
    function _emscripten_glCompressedTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      imageSize,
      data
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx["compressedTexSubImage2D"](
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            imageSize,
            data
          )
        } else {
          GLctx["compressedTexSubImage2D"](
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            HEAPU8,
            data,
            imageSize
          )
        }
        return
      }
      GLctx["compressedTexSubImage2D"](
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        data ? HEAPU8.subarray(data, data + imageSize) : null
      )
    }
    function _emscripten_glCompressedTexSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      imageSize,
      data
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          imageSize,
          data
        )
      } else {
        GLctx["compressedTexSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          HEAPU8,
          data,
          imageSize
        )
      }
    }
    function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
      GLctx["copyBufferSubData"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
      GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
    }
    function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
      GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
    }
    function _emscripten_glCopyTexSubImage3D(
      x0,
      x1,
      x2,
      x3,
      x4,
      x5,
      x6,
      x7,
      x8
    ) {
      GLctx["copyTexSubImage3D"](x0, x1, x2, x3, x4, x5, x6, x7, x8)
    }
    function _emscripten_glCreateProgram() {
      var id = GL.getNewId(GL.programs)
      var program = GLctx.createProgram()
      program.name = id
      GL.programs[id] = program
      return id
    }
    function _emscripten_glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders)
      GL.shaders[id] = GLctx.createShader(shaderType)
      return id
    }
    function _emscripten_glCullFace(x0) {
      GLctx["cullFace"](x0)
    }
    function _emscripten_glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(buffers + i * 4) >> 2]
        var buffer = GL.buffers[id]
        if (!buffer) continue
        GLctx.deleteBuffer(buffer)
        buffer.name = 0
        GL.buffers[id] = null
        if (id == GLctx.currentPixelPackBufferBinding)
          GLctx.currentPixelPackBufferBinding = 0
        if (id == GLctx.currentPixelUnpackBufferBinding)
          GLctx.currentPixelUnpackBufferBinding = 0
      }
    }
    function _emscripten_glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(framebuffers + i * 4) >> 2]
        var framebuffer = GL.framebuffers[id]
        if (!framebuffer) continue
        GLctx.deleteFramebuffer(framebuffer)
        framebuffer.name = 0
        GL.framebuffers[id] = null
      }
    }
    function _emscripten_glDeleteProgram(id) {
      if (!id) return
      var program = GL.programs[id]
      if (!program) {
        GL.recordError(1281)
        return
      }
      GLctx.deleteProgram(program)
      program.name = 0
      GL.programs[id] = null
      GL.programInfos[id] = null
    }
    function _emscripten_glDeleteQueries(n, ids) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(ids + i * 4) >> 2]
        var query = GL.queries[id]
        if (!query) continue
        GLctx["deleteQuery"](query)
        GL.queries[id] = null
      }
    }
    function _emscripten_glDeleteQueriesEXT(n, ids) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(ids + i * 4) >> 2]
        var query = GL.timerQueriesEXT[id]
        if (!query) continue
        GLctx.disjointTimerQueryExt["deleteQueryEXT"](query)
        GL.timerQueriesEXT[id] = null
      }
    }
    function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(renderbuffers + i * 4) >> 2]
        var renderbuffer = GL.renderbuffers[id]
        if (!renderbuffer) continue
        GLctx.deleteRenderbuffer(renderbuffer)
        renderbuffer.name = 0
        GL.renderbuffers[id] = null
      }
    }
    function _emscripten_glDeleteSamplers(n, samplers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(samplers + i * 4) >> 2]
        var sampler = GL.samplers[id]
        if (!sampler) continue
        GLctx["deleteSampler"](sampler)
        sampler.name = 0
        GL.samplers[id] = null
      }
    }
    function _emscripten_glDeleteShader(id) {
      if (!id) return
      var shader = GL.shaders[id]
      if (!shader) {
        GL.recordError(1281)
        return
      }
      GLctx.deleteShader(shader)
      GL.shaders[id] = null
    }
    function _emscripten_glDeleteSync(id) {
      if (!id) return
      var sync = GL.syncs[id]
      if (!sync) {
        GL.recordError(1281)
        return
      }
      GLctx.deleteSync(sync)
      sync.name = 0
      GL.syncs[id] = null
    }
    function _emscripten_glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(textures + i * 4) >> 2]
        var texture = GL.textures[id]
        if (!texture) continue
        GLctx.deleteTexture(texture)
        texture.name = 0
        GL.textures[id] = null
      }
    }
    function _emscripten_glDeleteTransformFeedbacks(n, ids) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(ids + i * 4) >> 2]
        var transformFeedback = GL.transformFeedbacks[id]
        if (!transformFeedback) continue
        GLctx["deleteTransformFeedback"](transformFeedback)
        transformFeedback.name = 0
        GL.transformFeedbacks[id] = null
      }
    }
    function _emscripten_glDeleteVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(vaos + i * 4) >> 2]
        GLctx["deleteVertexArray"](GL.vaos[id])
        GL.vaos[id] = null
      }
    }
    function _emscripten_glDeleteVertexArraysOES(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(vaos + i * 4) >> 2]
        GLctx["deleteVertexArray"](GL.vaos[id])
        GL.vaos[id] = null
      }
    }
    function _emscripten_glDepthFunc(x0) {
      GLctx["depthFunc"](x0)
    }
    function _emscripten_glDepthMask(flag) {
      GLctx.depthMask(!!flag)
    }
    function _emscripten_glDepthRangef(x0, x1) {
      GLctx["depthRange"](x0, x1)
    }
    function _emscripten_glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program], GL.shaders[shader])
    }
    function _emscripten_glDisable(x0) {
      GLctx["disable"](x0)
    }
    function _emscripten_glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index)
    }
    function _emscripten_glDrawArrays(mode, first, count) {
      GLctx.drawArrays(mode, first, count)
    }
    function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount)
    }
    function _emscripten_glDrawArraysInstancedANGLE(
      mode,
      first,
      count,
      primcount
    ) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount)
    }
    function _emscripten_glDrawArraysInstancedARB(
      mode,
      first,
      count,
      primcount
    ) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount)
    }
    function _emscripten_glDrawArraysInstancedEXT(
      mode,
      first,
      count,
      primcount
    ) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount)
    }
    function _emscripten_glDrawArraysInstancedNV(
      mode,
      first,
      count,
      primcount
    ) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount)
    }
    var tempFixedLengthArray = []
    function _emscripten_glDrawBuffers(n, bufs) {
      var bufArray = tempFixedLengthArray[n]
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(bufs + i * 4) >> 2]
      }
      GLctx["drawBuffers"](bufArray)
    }
    function _emscripten_glDrawBuffersEXT(n, bufs) {
      var bufArray = tempFixedLengthArray[n]
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(bufs + i * 4) >> 2]
      }
      GLctx["drawBuffers"](bufArray)
    }
    function _emscripten_glDrawBuffersWEBGL(n, bufs) {
      var bufArray = tempFixedLengthArray[n]
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(bufs + i * 4) >> 2]
      }
      GLctx["drawBuffers"](bufArray)
    }
    function _emscripten_glDrawElements(mode, count, type, indices) {
      GLctx.drawElements(mode, count, type, indices)
    }
    function _emscripten_glDrawElementsInstanced(
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
    }
    function _emscripten_glDrawElementsInstancedANGLE(
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
    }
    function _emscripten_glDrawElementsInstancedARB(
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
    }
    function _emscripten_glDrawElementsInstancedEXT(
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
    }
    function _emscripten_glDrawElementsInstancedNV(
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
    }
    function _glDrawElements(mode, count, type, indices) {
      GLctx.drawElements(mode, count, type, indices)
    }
    function _emscripten_glDrawRangeElements(
      mode,
      start,
      end,
      count,
      type,
      indices
    ) {
      _glDrawElements(mode, count, type, indices)
    }
    function _emscripten_glEnable(x0) {
      GLctx["enable"](x0)
    }
    function _emscripten_glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index)
    }
    function _emscripten_glEndQuery(x0) {
      GLctx["endQuery"](x0)
    }
    function _emscripten_glEndQueryEXT(target) {
      GLctx.disjointTimerQueryExt["endQueryEXT"](target)
    }
    function _emscripten_glEndTransformFeedback() {
      GLctx["endTransformFeedback"]()
    }
    function _emscripten_glFenceSync(condition, flags) {
      var sync = GLctx.fenceSync(condition, flags)
      if (sync) {
        var id = GL.getNewId(GL.syncs)
        sync.name = id
        GL.syncs[id] = sync
        return id
      } else {
        return 0
      }
    }
    function _emscripten_glFinish() {
      GLctx["finish"]()
    }
    function _emscripten_glFlush() {
      GLctx["flush"]()
    }
    function _emscripten_glFramebufferRenderbuffer(
      target,
      attachment,
      renderbuffertarget,
      renderbuffer
    ) {
      GLctx.framebufferRenderbuffer(
        target,
        attachment,
        renderbuffertarget,
        GL.renderbuffers[renderbuffer]
      )
    }
    function _emscripten_glFramebufferTexture2D(
      target,
      attachment,
      textarget,
      texture,
      level
    ) {
      GLctx.framebufferTexture2D(
        target,
        attachment,
        textarget,
        GL.textures[texture],
        level
      )
    }
    function _emscripten_glFramebufferTextureLayer(
      target,
      attachment,
      texture,
      level,
      layer
    ) {
      GLctx.framebufferTextureLayer(
        target,
        attachment,
        GL.textures[texture],
        level,
        layer
      )
    }
    function _emscripten_glFrontFace(x0) {
      GLctx["frontFace"](x0)
    }
    function __glGenObject(n, buffers, createFunction, objectTable) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]()
        var id = buffer && GL.getNewId(objectTable)
        if (buffer) {
          buffer.name = id
          objectTable[id] = buffer
        } else {
          GL.recordError(1282)
        }
        HEAP32[(buffers + i * 4) >> 2] = id
      }
    }
    function _emscripten_glGenBuffers(n, buffers) {
      __glGenObject(n, buffers, "createBuffer", GL.buffers)
    }
    function _emscripten_glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
    }
    function _emscripten_glGenQueries(n, ids) {
      __glGenObject(n, ids, "createQuery", GL.queries)
    }
    function _emscripten_glGenQueriesEXT(n, ids) {
      for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt["createQueryEXT"]()
        if (!query) {
          GL.recordError(1282)
          while (i < n) HEAP32[(ids + i++ * 4) >> 2] = 0
          return
        }
        var id = GL.getNewId(GL.timerQueriesEXT)
        query.name = id
        GL.timerQueriesEXT[id] = query
        HEAP32[(ids + i * 4) >> 2] = id
      }
    }
    function _emscripten_glGenRenderbuffers(n, renderbuffers) {
      __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
    }
    function _emscripten_glGenSamplers(n, samplers) {
      __glGenObject(n, samplers, "createSampler", GL.samplers)
    }
    function _emscripten_glGenTextures(n, textures) {
      __glGenObject(n, textures, "createTexture", GL.textures)
    }
    function _emscripten_glGenTransformFeedbacks(n, ids) {
      __glGenObject(n, ids, "createTransformFeedback", GL.transformFeedbacks)
    }
    function _emscripten_glGenVertexArrays(n, arrays) {
      __glGenObject(n, arrays, "createVertexArray", GL.vaos)
    }
    function _emscripten_glGenVertexArraysOES(n, arrays) {
      __glGenObject(n, arrays, "createVertexArray", GL.vaos)
    }
    function _emscripten_glGenerateMipmap(x0) {
      GLctx["generateMipmap"](x0)
    }
    function __glGetActiveAttribOrUniform(
      funcName,
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    ) {
      program = GL.programs[program]
      var info = GLctx[funcName](program, index)
      if (info) {
        var numBytesWrittenExclNull =
          name && stringToUTF8(info.name, name, bufSize)
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
        if (size) HEAP32[size >> 2] = info.size
        if (type) HEAP32[type >> 2] = info.type
      }
    }
    function _emscripten_glGetActiveAttrib(
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    ) {
      __glGetActiveAttribOrUniform(
        "getActiveAttrib",
        program,
        index,
        bufSize,
        length,
        size,
        type,
        name
      )
    }
    function _emscripten_glGetActiveUniform(
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    ) {
      __glGetActiveAttribOrUniform(
        "getActiveUniform",
        program,
        index,
        bufSize,
        length,
        size,
        type,
        name
      )
    }
    function _emscripten_glGetActiveUniformBlockName(
      program,
      uniformBlockIndex,
      bufSize,
      length,
      uniformBlockName
    ) {
      program = GL.programs[program]
      var result = GLctx["getActiveUniformBlockName"](
        program,
        uniformBlockIndex
      )
      if (!result) return
      if (uniformBlockName && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(
          result,
          uniformBlockName,
          bufSize
        )
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
      } else {
        if (length) HEAP32[length >> 2] = 0
      }
    }
    function _emscripten_glGetActiveUniformBlockiv(
      program,
      uniformBlockIndex,
      pname,
      params
    ) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      program = GL.programs[program]
      switch (pname) {
        case 35393:
          var name = GLctx["getActiveUniformBlockName"](
            program,
            uniformBlockIndex
          )
          HEAP32[params >> 2] = name.length + 1
          return
        default:
          var result = GLctx["getActiveUniformBlockParameter"](
            program,
            uniformBlockIndex,
            pname
          )
          if (!result) return
          if (typeof result == "number") {
            HEAP32[params >> 2] = result
          } else {
            for (var i = 0; i < result.length; i++) {
              HEAP32[(params + i * 4) >> 2] = result[i]
            }
          }
      }
    }
    function _emscripten_glGetActiveUniformsiv(
      program,
      uniformCount,
      uniformIndices,
      pname,
      params
    ) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      if (uniformCount > 0 && uniformIndices == 0) {
        GL.recordError(1281)
        return
      }
      program = GL.programs[program]
      var ids = []
      for (var i = 0; i < uniformCount; i++) {
        ids.push(HEAP32[(uniformIndices + i * 4) >> 2])
      }
      var result = GLctx["getActiveUniforms"](program, ids, pname)
      if (!result) return
      var len = result.length
      for (var i = 0; i < len; i++) {
        HEAP32[(params + i * 4) >> 2] = result[i]
      }
    }
    function _emscripten_glGetAttachedShaders(
      program,
      maxCount,
      count,
      shaders
    ) {
      var result = GLctx.getAttachedShaders(GL.programs[program])
      var len = result.length
      if (len > maxCount) {
        len = maxCount
      }
      HEAP32[count >> 2] = len
      for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i])
        HEAP32[(shaders + i * 4) >> 2] = id
      }
    }
    function _emscripten_glGetAttribLocation(program, name) {
      return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
    }
    function writeI53ToI64(ptr, num) {
      HEAPU32[ptr >> 2] = num
      HEAPU32[(ptr + 4) >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296
    }
    function emscriptenWebGLGet(name_, p, type) {
      if (!p) {
        GL.recordError(1281)
        return
      }
      var ret = undefined
      switch (name_) {
        case 36346:
          ret = 1
          break
        case 36344:
          if (type != 0 && type != 1) {
            GL.recordError(1280)
          }
          return
        case 34814:
        case 36345:
          ret = 0
          break
        case 34466:
          var formats = GLctx.getParameter(34467)
          ret = formats ? formats.length : 0
          break
        case 33309:
          if (GL.currentContext.version < 2) {
            GL.recordError(1282)
            return
          }
          var exts = GLctx.getSupportedExtensions() || []
          ret = 2 * exts.length
          break
        case 33307:
        case 33308:
          if (GL.currentContext.version < 2) {
            GL.recordError(1280)
            return
          }
          ret = name_ == 33307 ? 3 : 0
          break
      }
      if (ret === undefined) {
        var result = GLctx.getParameter(name_)
        switch (typeof result) {
          case "number":
            ret = result
            break
          case "boolean":
            ret = result ? 1 : 0
            break
          case "string":
            GL.recordError(1280)
            return
          case "object":
            if (result === null) {
              switch (name_) {
                case 34964:
                case 35725:
                case 34965:
                case 36006:
                case 36007:
                case 32873:
                case 34229:
                case 36662:
                case 36663:
                case 35053:
                case 35055:
                case 36010:
                case 35097:
                case 35869:
                case 32874:
                case 36389:
                case 35983:
                case 35368:
                case 34068: {
                  ret = 0
                  break
                }
                default: {
                  GL.recordError(1280)
                  return
                }
              }
            } else if (
              result instanceof Float32Array ||
              result instanceof Uint32Array ||
              result instanceof Int32Array ||
              result instanceof Array
            ) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0:
                    HEAP32[(p + i * 4) >> 2] = result[i]
                    break
                  case 2:
                    HEAPF32[(p + i * 4) >> 2] = result[i]
                    break
                  case 4:
                    HEAP8[(p + i) >> 0] = result[i] ? 1 : 0
                    break
                }
              }
              return
            } else {
              try {
                ret = result.name | 0
              } catch (e) {
                GL.recordError(1280)
                err(
                  "GL_INVALID_ENUM in glGet" +
                    type +
                    "v: Unknown object returned from WebGL getParameter(" +
                    name_ +
                    ")! (error: " +
                    e +
                    ")"
                )
                return
              }
            }
            break
          default:
            GL.recordError(1280)
            err(
              "GL_INVALID_ENUM in glGet" +
                type +
                "v: Native code calling glGet" +
                type +
                "v(" +
                name_ +
                ") and it returns " +
                result +
                " of type " +
                typeof result +
                "!"
            )
            return
        }
      }
      switch (type) {
        case 1:
          writeI53ToI64(p, ret)
          break
        case 0:
          HEAP32[p >> 2] = ret
          break
        case 2:
          HEAPF32[p >> 2] = ret
          break
        case 4:
          HEAP8[p >> 0] = ret ? 1 : 0
          break
      }
    }
    function _emscripten_glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 4)
    }
    function _emscripten_glGetBufferParameteri64v(target, value, data) {
      if (!data) {
        GL.recordError(1281)
        return
      }
      writeI53ToI64(data, GLctx.getBufferParameter(target, value))
    }
    function _emscripten_glGetBufferParameteriv(target, value, data) {
      if (!data) {
        GL.recordError(1281)
        return
      }
      HEAP32[data >> 2] = GLctx.getBufferParameter(target, value)
    }
    function _emscripten_glGetError() {
      var error = GLctx.getError() || GL.lastError
      GL.lastError = 0
      return error
    }
    function _emscripten_glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2)
    }
    function _emscripten_glGetFragDataLocation(program, name) {
      return GLctx["getFragDataLocation"](
        GL.programs[program],
        UTF8ToString(name)
      )
    }
    function _emscripten_glGetFramebufferAttachmentParameteriv(
      target,
      attachment,
      pname,
      params
    ) {
      var result = GLctx.getFramebufferAttachmentParameter(
        target,
        attachment,
        pname
      )
      if (
        result instanceof WebGLRenderbuffer ||
        result instanceof WebGLTexture
      ) {
        result = result.name | 0
      }
      HEAP32[params >> 2] = result
    }
    function emscriptenWebGLGetIndexed(target, index, data, type) {
      if (!data) {
        GL.recordError(1281)
        return
      }
      var result = GLctx["getIndexedParameter"](target, index)
      var ret
      switch (typeof result) {
        case "boolean":
          ret = result ? 1 : 0
          break
        case "number":
          ret = result
          break
        case "object":
          if (result === null) {
            switch (target) {
              case 35983:
              case 35368:
                ret = 0
                break
              default: {
                GL.recordError(1280)
                return
              }
            }
          } else if (result instanceof WebGLBuffer) {
            ret = result.name | 0
          } else {
            GL.recordError(1280)
            return
          }
          break
        default:
          GL.recordError(1280)
          return
      }
      switch (type) {
        case 1:
          writeI53ToI64(data, ret)
          break
        case 0:
          HEAP32[data >> 2] = ret
          break
        case 2:
          HEAPF32[data >> 2] = ret
          break
        case 4:
          HEAP8[data >> 0] = ret ? 1 : 0
          break
        default:
          throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type
      }
    }
    function _emscripten_glGetInteger64i_v(target, index, data) {
      emscriptenWebGLGetIndexed(target, index, data, 1)
    }
    function _emscripten_glGetInteger64v(name_, p) {
      emscriptenWebGLGet(name_, p, 1)
    }
    function _emscripten_glGetIntegeri_v(target, index, data) {
      emscriptenWebGLGetIndexed(target, index, data, 0)
    }
    function _emscripten_glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0)
    }
    function _emscripten_glGetInternalformativ(
      target,
      internalformat,
      pname,
      bufSize,
      params
    ) {
      if (bufSize < 0) {
        GL.recordError(1281)
        return
      }
      if (!params) {
        GL.recordError(1281)
        return
      }
      var ret = GLctx["getInternalformatParameter"](
        target,
        internalformat,
        pname
      )
      if (ret === null) return
      for (var i = 0; i < ret.length && i < bufSize; ++i) {
        HEAP32[(params + i) >> 2] = ret[i]
      }
    }
    function _emscripten_glGetProgramBinary(
      program,
      bufSize,
      length,
      binaryFormat,
      binary
    ) {
      GL.recordError(1282)
    }
    function _emscripten_glGetProgramInfoLog(
      program,
      maxLength,
      length,
      infoLog
    ) {
      var log = GLctx.getProgramInfoLog(GL.programs[program])
      if (log === null) log = "(unknown error)"
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    }
    function _emscripten_glGetProgramiv(program, pname, p) {
      if (!p) {
        GL.recordError(1281)
        return
      }
      if (program >= GL.counter) {
        GL.recordError(1281)
        return
      }
      var ptable = GL.programInfos[program]
      if (!ptable) {
        GL.recordError(1282)
        return
      }
      if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(GL.programs[program])
        if (log === null) log = "(unknown error)"
        HEAP32[p >> 2] = log.length + 1
      } else if (pname == 35719) {
        HEAP32[p >> 2] = ptable.maxUniformLength
      } else if (pname == 35722) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program]
          var numAttribs = GLctx.getProgramParameter(program, 35721)
          ptable.maxAttributeLength = 0
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i)
            ptable.maxAttributeLength = Math.max(
              ptable.maxAttributeLength,
              activeAttrib.name.length + 1
            )
          }
        }
        HEAP32[p >> 2] = ptable.maxAttributeLength
      } else if (pname == 35381) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program]
          var numBlocks = GLctx.getProgramParameter(program, 35382)
          ptable.maxUniformBlockNameLength = 0
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i)
            ptable.maxUniformBlockNameLength = Math.max(
              ptable.maxUniformBlockNameLength,
              activeBlockName.length + 1
            )
          }
        }
        HEAP32[p >> 2] = ptable.maxUniformBlockNameLength
      } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname)
      }
    }
    function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var query = GL.timerQueriesEXT[id]
      var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
      var ret
      if (typeof param == "boolean") {
        ret = param ? 1 : 0
      } else {
        ret = param
      }
      writeI53ToI64(params, ret)
    }
    function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var query = GL.timerQueriesEXT[id]
      var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
      var ret
      if (typeof param == "boolean") {
        ret = param ? 1 : 0
      } else {
        ret = param
      }
      HEAP32[params >> 2] = ret
    }
    function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var query = GL.timerQueriesEXT[id]
      var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
      var ret
      if (typeof param == "boolean") {
        ret = param ? 1 : 0
      } else {
        ret = param
      }
      writeI53ToI64(params, ret)
    }
    function _emscripten_glGetQueryObjectuiv(id, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var query = GL.queries[id]
      var param = GLctx["getQueryParameter"](query, pname)
      var ret
      if (typeof param == "boolean") {
        ret = param ? 1 : 0
      } else {
        ret = param
      }
      HEAP32[params >> 2] = ret
    }
    function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var query = GL.timerQueriesEXT[id]
      var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
      var ret
      if (typeof param == "boolean") {
        ret = param ? 1 : 0
      } else {
        ret = param
      }
      HEAP32[params >> 2] = ret
    }
    function _emscripten_glGetQueryiv(target, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      HEAP32[params >> 2] = GLctx["getQuery"](target, pname)
    }
    function _emscripten_glGetQueryivEXT(target, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](
        target,
        pname
      )
    }
    function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname)
    }
    function _emscripten_glGetSamplerParameterfv(sampler, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      sampler = GL.samplers[sampler]
      HEAPF32[params >> 2] = GLctx["getSamplerParameter"](sampler, pname)
    }
    function _emscripten_glGetSamplerParameteriv(sampler, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      sampler = GL.samplers[sampler]
      HEAP32[params >> 2] = GLctx["getSamplerParameter"](sampler, pname)
    }
    function _emscripten_glGetShaderInfoLog(
      shader,
      maxLength,
      length,
      infoLog
    ) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader])
      if (log === null) log = "(unknown error)"
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    }
    function _emscripten_glGetShaderPrecisionFormat(
      shaderType,
      precisionType,
      range,
      precision
    ) {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType)
      HEAP32[range >> 2] = result.rangeMin
      HEAP32[(range + 4) >> 2] = result.rangeMax
      HEAP32[precision >> 2] = result.precision
    }
    function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
      var result = GLctx.getShaderSource(GL.shaders[shader])
      if (!result) return
      var numBytesWrittenExclNull =
        bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    }
    function _emscripten_glGetShaderiv(shader, pname, p) {
      if (!p) {
        GL.recordError(1281)
        return
      }
      if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader])
        if (log === null) log = "(unknown error)"
        var logLength = log ? log.length + 1 : 0
        HEAP32[p >> 2] = logLength
      } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader])
        var sourceLength = source ? source.length + 1 : 0
        HEAP32[p >> 2] = sourceLength
      } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
      }
    }
    function stringToNewUTF8(jsString) {
      var length = lengthBytesUTF8(jsString) + 1
      var cString = _malloc(length)
      stringToUTF8(jsString, cString, length)
      return cString
    }
    function _emscripten_glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_]
      var ret
      switch (name_) {
        case 7939:
          var exts = GLctx.getSupportedExtensions() || []
          exts = exts.concat(
            exts.map(function (e) {
              return "GL_" + e
            })
          )
          ret = stringToNewUTF8(exts.join(" "))
          break
        case 7936:
        case 7937:
        case 37445:
        case 37446:
          var s = GLctx.getParameter(name_)
          if (!s) {
            GL.recordError(1280)
          }
          ret = stringToNewUTF8(s)
          break
        case 7938:
          var glVersion = GLctx.getParameter(7938)
          if (GL.currentContext.version >= 2)
            glVersion = "OpenGL ES 3.0 (" + glVersion + ")"
          else {
            glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
          }
          ret = stringToNewUTF8(glVersion)
          break
        case 35724:
          var glslVersion = GLctx.getParameter(35724)
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/
          var ver_num = glslVersion.match(ver_re)
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0"
            glslVersion =
              "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
          }
          ret = stringToNewUTF8(glslVersion)
          break
        default:
          GL.recordError(1280)
          return 0
      }
      GL.stringCache[name_] = ret
      return ret
    }
    function _emscripten_glGetStringi(name, index) {
      if (GL.currentContext.version < 2) {
        GL.recordError(1282)
        return 0
      }
      var stringiCache = GL.stringiCache[name]
      if (stringiCache) {
        if (index < 0 || index >= stringiCache.length) {
          GL.recordError(1281)
          return 0
        }
        return stringiCache[index]
      }
      switch (name) {
        case 7939:
          var exts = GLctx.getSupportedExtensions() || []
          exts = exts.concat(
            exts.map(function (e) {
              return "GL_" + e
            })
          )
          exts = exts.map(function (e) {
            return stringToNewUTF8(e)
          })
          stringiCache = GL.stringiCache[name] = exts
          if (index < 0 || index >= stringiCache.length) {
            GL.recordError(1281)
            return 0
          }
          return stringiCache[index]
        default:
          GL.recordError(1280)
          return 0
      }
    }
    function _emscripten_glGetSynciv(sync, pname, bufSize, length, values) {
      if (bufSize < 0) {
        GL.recordError(1281)
        return
      }
      if (!values) {
        GL.recordError(1281)
        return
      }
      var ret = GLctx.getSyncParameter(GL.syncs[sync], pname)
      HEAP32[length >> 2] = ret
      if (ret !== null && length) HEAP32[length >> 2] = 1
    }
    function _emscripten_glGetTexParameterfv(target, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname)
    }
    function _emscripten_glGetTexParameteriv(target, pname, params) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      HEAP32[params >> 2] = GLctx.getTexParameter(target, pname)
    }
    function _emscripten_glGetTransformFeedbackVarying(
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    ) {
      program = GL.programs[program]
      var info = GLctx["getTransformFeedbackVarying"](program, index)
      if (!info) return
      if (name && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize)
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
      } else {
        if (length) HEAP32[length >> 2] = 0
      }
      if (size) HEAP32[size >> 2] = info.size
      if (type) HEAP32[type >> 2] = info.type
    }
    function _emscripten_glGetUniformBlockIndex(program, uniformBlockName) {
      return GLctx["getUniformBlockIndex"](
        GL.programs[program],
        UTF8ToString(uniformBlockName)
      )
    }
    function _emscripten_glGetUniformIndices(
      program,
      uniformCount,
      uniformNames,
      uniformIndices
    ) {
      if (!uniformIndices) {
        GL.recordError(1281)
        return
      }
      if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
        GL.recordError(1281)
        return
      }
      program = GL.programs[program]
      var names = []
      for (var i = 0; i < uniformCount; i++)
        names.push(UTF8ToString(HEAP32[(uniformNames + i * 4) >> 2]))
      var result = GLctx["getUniformIndices"](program, names)
      if (!result) return
      var len = result.length
      for (var i = 0; i < len; i++) {
        HEAP32[(uniformIndices + i * 4) >> 2] = result[i]
      }
    }
    function jstoi_q(str) {
      return parseInt(str)
    }
    function _emscripten_glGetUniformLocation(program, name) {
      name = UTF8ToString(name)
      var arrayIndex = 0
      if (name[name.length - 1] == "]") {
        var leftBrace = name.lastIndexOf("[")
        arrayIndex =
          name[leftBrace + 1] != "]" ? jstoi_q(name.slice(leftBrace + 1)) : 0
        name = name.slice(0, leftBrace)
      }
      var uniformInfo =
        GL.programInfos[program] && GL.programInfos[program].uniforms[name]
      if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) {
        return uniformInfo[1] + arrayIndex
      } else {
        return -1
      }
    }
    function emscriptenWebGLGetUniform(program, location, params, type) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location])
      if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
          case 0:
            HEAP32[params >> 2] = data
            break
          case 2:
            HEAPF32[params >> 2] = data
            break
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0:
              HEAP32[(params + i * 4) >> 2] = data[i]
              break
            case 2:
              HEAPF32[(params + i * 4) >> 2] = data[i]
              break
          }
        }
      }
    }
    function _emscripten_glGetUniformfv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 2)
    }
    function _emscripten_glGetUniformiv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 0)
    }
    function _emscripten_glGetUniformuiv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 0)
    }
    function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
      if (!params) {
        GL.recordError(1281)
        return
      }
      var data = GLctx.getVertexAttrib(index, pname)
      if (pname == 34975) {
        HEAP32[params >> 2] = data && data["name"]
      } else if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
          case 0:
            HEAP32[params >> 2] = data
            break
          case 2:
            HEAPF32[params >> 2] = data
            break
          case 5:
            HEAP32[params >> 2] = Math.fround(data)
            break
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0:
              HEAP32[(params + i * 4) >> 2] = data[i]
              break
            case 2:
              HEAPF32[(params + i * 4) >> 2] = data[i]
              break
            case 5:
              HEAP32[(params + i * 4) >> 2] = Math.fround(data[i])
              break
          }
        }
      }
    }
    function _emscripten_glGetVertexAttribIiv(index, pname, params) {
      emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
    }
    function _emscripten_glGetVertexAttribIuiv(index, pname, params) {
      emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
    }
    function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
      if (!pointer) {
        GL.recordError(1281)
        return
      }
      HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname)
    }
    function _emscripten_glGetVertexAttribfv(index, pname, params) {
      emscriptenWebGLGetVertexAttrib(index, pname, params, 2)
    }
    function _emscripten_glGetVertexAttribiv(index, pname, params) {
      emscriptenWebGLGetVertexAttrib(index, pname, params, 5)
    }
    function _emscripten_glHint(x0, x1) {
      GLctx["hint"](x0, x1)
    }
    function _emscripten_glInvalidateFramebuffer(
      target,
      numAttachments,
      attachments
    ) {
      var list = tempFixedLengthArray[numAttachments]
      for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[(attachments + i * 4) >> 2]
      }
      GLctx["invalidateFramebuffer"](target, list)
    }
    function _emscripten_glInvalidateSubFramebuffer(
      target,
      numAttachments,
      attachments,
      x,
      y,
      width,
      height
    ) {
      var list = tempFixedLengthArray[numAttachments]
      for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[(attachments + i * 4) >> 2]
      }
      GLctx["invalidateSubFramebuffer"](target, list, x, y, width, height)
    }
    function _emscripten_glIsBuffer(buffer) {
      var b = GL.buffers[buffer]
      if (!b) return 0
      return GLctx.isBuffer(b)
    }
    function _emscripten_glIsEnabled(x0) {
      return GLctx["isEnabled"](x0)
    }
    function _emscripten_glIsFramebuffer(framebuffer) {
      var fb = GL.framebuffers[framebuffer]
      if (!fb) return 0
      return GLctx.isFramebuffer(fb)
    }
    function _emscripten_glIsProgram(program) {
      program = GL.programs[program]
      if (!program) return 0
      return GLctx.isProgram(program)
    }
    function _emscripten_glIsQuery(id) {
      var query = GL.queries[id]
      if (!query) return 0
      return GLctx["isQuery"](query)
    }
    function _emscripten_glIsQueryEXT(id) {
      var query = GL.timerQueriesEXT[id]
      if (!query) return 0
      return GLctx.disjointTimerQueryExt["isQueryEXT"](query)
    }
    function _emscripten_glIsRenderbuffer(renderbuffer) {
      var rb = GL.renderbuffers[renderbuffer]
      if (!rb) return 0
      return GLctx.isRenderbuffer(rb)
    }
    function _emscripten_glIsSampler(id) {
      var sampler = GL.samplers[id]
      if (!sampler) return 0
      return GLctx["isSampler"](sampler)
    }
    function _emscripten_glIsShader(shader) {
      var s = GL.shaders[shader]
      if (!s) return 0
      return GLctx.isShader(s)
    }
    function _emscripten_glIsSync(sync) {
      return GLctx.isSync(GL.syncs[sync])
    }
    function _emscripten_glIsTexture(id) {
      var texture = GL.textures[id]
      if (!texture) return 0
      return GLctx.isTexture(texture)
    }
    function _emscripten_glIsTransformFeedback(id) {
      return GLctx["isTransformFeedback"](GL.transformFeedbacks[id])
    }
    function _emscripten_glIsVertexArray(array) {
      var vao = GL.vaos[array]
      if (!vao) return 0
      return GLctx["isVertexArray"](vao)
    }
    function _emscripten_glIsVertexArrayOES(array) {
      var vao = GL.vaos[array]
      if (!vao) return 0
      return GLctx["isVertexArray"](vao)
    }
    function _emscripten_glLineWidth(x0) {
      GLctx["lineWidth"](x0)
    }
    function _emscripten_glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program])
      GL.populateUniformTable(program)
    }
    function _emscripten_glPauseTransformFeedback() {
      GLctx["pauseTransformFeedback"]()
    }
    function _emscripten_glPixelStorei(pname, param) {
      if (pname == 3317) {
        GL.unpackAlignment = param
      }
      GLctx.pixelStorei(pname, param)
    }
    function _emscripten_glPolygonOffset(x0, x1) {
      GLctx["polygonOffset"](x0, x1)
    }
    function _emscripten_glProgramBinary(
      program,
      binaryFormat,
      binary,
      length
    ) {
      GL.recordError(1280)
    }
    function _emscripten_glProgramParameteri(program, pname, value) {
      GL.recordError(1280)
    }
    function _emscripten_glQueryCounterEXT(id, target) {
      GLctx.disjointTimerQueryExt["queryCounterEXT"](
        GL.timerQueriesEXT[id],
        target
      )
    }
    function _emscripten_glReadBuffer(x0) {
      GLctx["readBuffer"](x0)
    }
    function computeUnpackAlignedImageSize(
      width,
      height,
      sizePerPixel,
      alignment
    ) {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y
      }
      var plainRowSize = width * sizePerPixel
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment)
      return height * alignedRowSize
    }
    function __colorChannelsInGlTextureFormat(format) {
      var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
      }
      return colorChannels[format - 6402] || 1
    }
    function heapObjectForWebGLType(type) {
      type -= 5120
      if (type == 0) return HEAP8
      if (type == 1) return HEAPU8
      if (type == 2) return HEAP16
      if (type == 4) return HEAP32
      if (type == 6) return HEAPF32
      if (
        type == 5 ||
        type == 28922 ||
        type == 28520 ||
        type == 30779 ||
        type == 30782
      )
        return HEAPU32
      return HEAPU16
    }
    function heapAccessShiftForWebGLHeap(heap) {
      return 31 - Math.clz32(heap.BYTES_PER_ELEMENT)
    }
    function emscriptenWebGLGetTexPixelData(
      type,
      format,
      width,
      height,
      pixels,
      internalFormat
    ) {
      var heap = heapObjectForWebGLType(type)
      var shift = heapAccessShiftForWebGLHeap(heap)
      var byteSize = 1 << shift
      var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize
      var bytes = computeUnpackAlignedImageSize(
        width,
        height,
        sizePerPixel,
        GL.unpackAlignment
      )
      return heap.subarray(pixels >> shift, (pixels + bytes) >> shift)
    }
    function _emscripten_glReadPixels(
      x,
      y,
      width,
      height,
      format,
      type,
      pixels
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelPackBufferBinding) {
          GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
          var heap = heapObjectForWebGLType(type)
          GLctx.readPixels(
            x,
            y,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        }
        return
      }
      var pixelData = emscriptenWebGLGetTexPixelData(
        type,
        format,
        width,
        height,
        pixels,
        format
      )
      if (!pixelData) {
        GL.recordError(1280)
        return
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData)
    }
    function _emscripten_glReleaseShaderCompiler() {}
    function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
      GLctx["renderbufferStorage"](x0, x1, x2, x3)
    }
    function _emscripten_glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
      GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glResumeTransformFeedback() {
      GLctx["resumeTransformFeedback"]()
    }
    function _emscripten_glSampleCoverage(value, invert) {
      GLctx.sampleCoverage(value, !!invert)
    }
    function _emscripten_glSamplerParameterf(sampler, pname, param) {
      GLctx["samplerParameterf"](GL.samplers[sampler], pname, param)
    }
    function _emscripten_glSamplerParameterfv(sampler, pname, params) {
      var param = HEAPF32[params >> 2]
      GLctx["samplerParameterf"](GL.samplers[sampler], pname, param)
    }
    function _emscripten_glSamplerParameteri(sampler, pname, param) {
      GLctx["samplerParameteri"](GL.samplers[sampler], pname, param)
    }
    function _emscripten_glSamplerParameteriv(sampler, pname, params) {
      var param = HEAP32[params >> 2]
      GLctx["samplerParameteri"](GL.samplers[sampler], pname, param)
    }
    function _emscripten_glScissor(x0, x1, x2, x3) {
      GLctx["scissor"](x0, x1, x2, x3)
    }
    function _emscripten_glShaderBinary() {
      GL.recordError(1280)
    }
    function _emscripten_glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length)
      GLctx.shaderSource(GL.shaders[shader], source)
    }
    function _emscripten_glStencilFunc(x0, x1, x2) {
      GLctx["stencilFunc"](x0, x1, x2)
    }
    function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
      GLctx["stencilFuncSeparate"](x0, x1, x2, x3)
    }
    function _emscripten_glStencilMask(x0) {
      GLctx["stencilMask"](x0)
    }
    function _emscripten_glStencilMaskSeparate(x0, x1) {
      GLctx["stencilMaskSeparate"](x0, x1)
    }
    function _emscripten_glStencilOp(x0, x1, x2) {
      GLctx["stencilOp"](x0, x1, x2)
    }
    function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
      GLctx["stencilOpSeparate"](x0, x1, x2, x3)
    }
    function _emscripten_glTexImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      pixels
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            pixels
          )
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type)
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        } else {
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            null
          )
        }
        return
      }
      GLctx.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        pixels
          ? emscriptenWebGLGetTexPixelData(
              type,
              format,
              width,
              height,
              pixels,
              internalFormat
            )
          : null
      )
    }
    function _emscripten_glTexImage3D(
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      format,
      type,
      pixels
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["texImage3D"](
          target,
          level,
          internalFormat,
          width,
          height,
          depth,
          border,
          format,
          type,
          pixels
        )
      } else if (pixels) {
        var heap = heapObjectForWebGLType(type)
        GLctx["texImage3D"](
          target,
          level,
          internalFormat,
          width,
          height,
          depth,
          border,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        )
      } else {
        GLctx["texImage3D"](
          target,
          level,
          internalFormat,
          width,
          height,
          depth,
          border,
          format,
          type,
          null
        )
      }
    }
    function _emscripten_glTexParameterf(x0, x1, x2) {
      GLctx["texParameterf"](x0, x1, x2)
    }
    function _emscripten_glTexParameterfv(target, pname, params) {
      var param = HEAPF32[params >> 2]
      GLctx.texParameterf(target, pname, param)
    }
    function _emscripten_glTexParameteri(x0, x1, x2) {
      GLctx["texParameteri"](x0, x1, x2)
    }
    function _emscripten_glTexParameteriv(target, pname, params) {
      var param = HEAP32[params >> 2]
      GLctx.texParameteri(target, pname, param)
    }
    function _emscripten_glTexStorage2D(x0, x1, x2, x3, x4) {
      GLctx["texStorage2D"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glTexStorage3D(x0, x1, x2, x3, x4, x5) {
      GLctx["texStorage3D"](x0, x1, x2, x3, x4, x5)
    }
    function _emscripten_glTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      pixels
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            pixels
          )
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type)
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        } else {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            null
          )
        }
        return
      }
      var pixelData = null
      if (pixels)
        pixelData = emscriptenWebGLGetTexPixelData(
          type,
          format,
          width,
          height,
          pixels,
          0
        )
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        pixelData
      )
    }
    function _emscripten_glTexSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      pixels
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          pixels
        )
      } else if (pixels) {
        var heap = heapObjectForWebGLType(type)
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        )
      } else {
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          null
        )
      }
    }
    function _emscripten_glTransformFeedbackVaryings(
      program,
      count,
      varyings,
      bufferMode
    ) {
      program = GL.programs[program]
      var vars = []
      for (var i = 0; i < count; i++)
        vars.push(UTF8ToString(HEAP32[(varyings + i * 4) >> 2]))
      GLctx["transformFeedbackVaryings"](program, vars, bufferMode)
    }
    function _emscripten_glUniform1f(location, v0) {
      GLctx.uniform1f(GL.uniforms[location], v0)
    }
    var miniTempWebGLFloatBuffers = []
    function _emscripten_glUniform1fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform1fv(GL.uniforms[location], HEAPF32, value >> 2, count)
        return
      }
      if (count <= 288) {
        var view = miniTempWebGLFloatBuffers[count - 1]
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 4) >> 2)
      }
      GLctx.uniform1fv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform1i(location, v0) {
      GLctx.uniform1i(GL.uniforms[location], v0)
    }
    var __miniTempWebGLIntBuffers = []
    function _emscripten_glUniform1iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform1iv(GL.uniforms[location], HEAP32, value >> 2, count)
        return
      }
      if (count <= 288) {
        var view = __miniTempWebGLIntBuffers[count - 1]
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2)
      }
      GLctx.uniform1iv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform1ui(location, v0) {
      GLctx.uniform1ui(GL.uniforms[location], v0)
    }
    function _emscripten_glUniform1uiv(location, count, value) {
      GLctx.uniform1uiv(GL.uniforms[location], HEAPU32, value >> 2, count)
    }
    function _emscripten_glUniform2f(location, v0, v1) {
      GLctx.uniform2f(GL.uniforms[location], v0, v1)
    }
    function _emscripten_glUniform2fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform2fv(GL.uniforms[location], HEAPF32, value >> 2, count * 2)
        return
      }
      if (count <= 144) {
        var view = miniTempWebGLFloatBuffers[2 * count - 1]
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 8) >> 2)
      }
      GLctx.uniform2fv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform2i(location, v0, v1) {
      GLctx.uniform2i(GL.uniforms[location], v0, v1)
    }
    function _emscripten_glUniform2iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform2iv(GL.uniforms[location], HEAP32, value >> 2, count * 2)
        return
      }
      if (count <= 144) {
        var view = __miniTempWebGLIntBuffers[2 * count - 1]
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 8) >> 2)
      }
      GLctx.uniform2iv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform2ui(location, v0, v1) {
      GLctx.uniform2ui(GL.uniforms[location], v0, v1)
    }
    function _emscripten_glUniform2uiv(location, count, value) {
      GLctx.uniform2uiv(GL.uniforms[location], HEAPU32, value >> 2, count * 2)
    }
    function _emscripten_glUniform3f(location, v0, v1, v2) {
      GLctx.uniform3f(GL.uniforms[location], v0, v1, v2)
    }
    function _emscripten_glUniform3fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform3fv(GL.uniforms[location], HEAPF32, value >> 2, count * 3)
        return
      }
      if (count <= 96) {
        var view = miniTempWebGLFloatBuffers[3 * count - 1]
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 12) >> 2)
      }
      GLctx.uniform3fv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform3i(location, v0, v1, v2) {
      GLctx.uniform3i(GL.uniforms[location], v0, v1, v2)
    }
    function _emscripten_glUniform3iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform3iv(GL.uniforms[location], HEAP32, value >> 2, count * 3)
        return
      }
      if (count <= 96) {
        var view = __miniTempWebGLIntBuffers[3 * count - 1]
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 12) >> 2)
      }
      GLctx.uniform3iv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform3ui(location, v0, v1, v2) {
      GLctx.uniform3ui(GL.uniforms[location], v0, v1, v2)
    }
    function _emscripten_glUniform3uiv(location, count, value) {
      GLctx.uniform3uiv(GL.uniforms[location], HEAPU32, value >> 2, count * 3)
    }
    function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
      GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3)
    }
    function _emscripten_glUniform4fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4)
        return
      }
      if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1]
        var heap = HEAPF32
        value >>= 2
        for (var i = 0; i < 4 * count; i += 4) {
          var dst = value + i
          view[i] = heap[dst]
          view[i + 1] = heap[dst + 1]
          view[i + 2] = heap[dst + 2]
          view[i + 3] = heap[dst + 3]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2)
      }
      GLctx.uniform4fv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
      GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3)
    }
    function _emscripten_glUniform4iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform4iv(GL.uniforms[location], HEAP32, value >> 2, count * 4)
        return
      }
      if (count <= 72) {
        var view = __miniTempWebGLIntBuffers[4 * count - 1]
        for (var i = 0; i < 4 * count; i += 4) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2]
          view[i + 3] = HEAP32[(value + (4 * i + 12)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 16) >> 2)
      }
      GLctx.uniform4iv(GL.uniforms[location], view)
    }
    function _emscripten_glUniform4ui(location, v0, v1, v2, v3) {
      GLctx.uniform4ui(GL.uniforms[location], v0, v1, v2, v3)
    }
    function _emscripten_glUniform4uiv(location, count, value) {
      GLctx.uniform4uiv(GL.uniforms[location], HEAPU32, value >> 2, count * 4)
    }
    function _emscripten_glUniformBlockBinding(
      program,
      uniformBlockIndex,
      uniformBlockBinding
    ) {
      program = GL.programs[program]
      GLctx["uniformBlockBinding"](
        program,
        uniformBlockIndex,
        uniformBlockBinding
      )
    }
    function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix2fv(
          GL.uniforms[location],
          !!transpose,
          HEAPF32,
          value >> 2,
          count * 4
        )
        return
      }
      if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1]
        for (var i = 0; i < 4 * count; i += 4) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2]
          view[i + 3] = HEAPF32[(value + (4 * i + 12)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2)
      }
      GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view)
    }
    function _emscripten_glUniformMatrix2x3fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix2x3fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 6
      )
    }
    function _emscripten_glUniformMatrix2x4fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix2x4fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 8
      )
    }
    function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix3fv(
          GL.uniforms[location],
          !!transpose,
          HEAPF32,
          value >> 2,
          count * 9
        )
        return
      }
      if (count <= 32) {
        var view = miniTempWebGLFloatBuffers[9 * count - 1]
        for (var i = 0; i < 9 * count; i += 9) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2]
          view[i + 3] = HEAPF32[(value + (4 * i + 12)) >> 2]
          view[i + 4] = HEAPF32[(value + (4 * i + 16)) >> 2]
          view[i + 5] = HEAPF32[(value + (4 * i + 20)) >> 2]
          view[i + 6] = HEAPF32[(value + (4 * i + 24)) >> 2]
          view[i + 7] = HEAPF32[(value + (4 * i + 28)) >> 2]
          view[i + 8] = HEAPF32[(value + (4 * i + 32)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 36) >> 2)
      }
      GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view)
    }
    function _emscripten_glUniformMatrix3x2fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix3x2fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 6
      )
    }
    function _emscripten_glUniformMatrix3x4fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix3x4fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 12
      )
    }
    function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix4fv(
          GL.uniforms[location],
          !!transpose,
          HEAPF32,
          value >> 2,
          count * 16
        )
        return
      }
      if (count <= 18) {
        var view = miniTempWebGLFloatBuffers[16 * count - 1]
        var heap = HEAPF32
        value >>= 2
        for (var i = 0; i < 16 * count; i += 16) {
          var dst = value + i
          view[i] = heap[dst]
          view[i + 1] = heap[dst + 1]
          view[i + 2] = heap[dst + 2]
          view[i + 3] = heap[dst + 3]
          view[i + 4] = heap[dst + 4]
          view[i + 5] = heap[dst + 5]
          view[i + 6] = heap[dst + 6]
          view[i + 7] = heap[dst + 7]
          view[i + 8] = heap[dst + 8]
          view[i + 9] = heap[dst + 9]
          view[i + 10] = heap[dst + 10]
          view[i + 11] = heap[dst + 11]
          view[i + 12] = heap[dst + 12]
          view[i + 13] = heap[dst + 13]
          view[i + 14] = heap[dst + 14]
          view[i + 15] = heap[dst + 15]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 64) >> 2)
      }
      GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view)
    }
    function _emscripten_glUniformMatrix4x2fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix4x2fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 8
      )
    }
    function _emscripten_glUniformMatrix4x3fv(
      location,
      count,
      transpose,
      value
    ) {
      GLctx.uniformMatrix4x3fv(
        GL.uniforms[location],
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 12
      )
    }
    function _emscripten_glUseProgram(program) {
      GLctx.useProgram(GL.programs[program])
    }
    function _emscripten_glValidateProgram(program) {
      GLctx.validateProgram(GL.programs[program])
    }
    function _emscripten_glVertexAttrib1f(x0, x1) {
      GLctx["vertexAttrib1f"](x0, x1)
    }
    function _emscripten_glVertexAttrib1fv(index, v) {
      GLctx.vertexAttrib1f(index, HEAPF32[v >> 2])
    }
    function _emscripten_glVertexAttrib2f(x0, x1, x2) {
      GLctx["vertexAttrib2f"](x0, x1, x2)
    }
    function _emscripten_glVertexAttrib2fv(index, v) {
      GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[(v + 4) >> 2])
    }
    function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
      GLctx["vertexAttrib3f"](x0, x1, x2, x3)
    }
    function _emscripten_glVertexAttrib3fv(index, v) {
      GLctx.vertexAttrib3f(
        index,
        HEAPF32[v >> 2],
        HEAPF32[(v + 4) >> 2],
        HEAPF32[(v + 8) >> 2]
      )
    }
    function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
      GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glVertexAttrib4fv(index, v) {
      GLctx.vertexAttrib4f(
        index,
        HEAPF32[v >> 2],
        HEAPF32[(v + 4) >> 2],
        HEAPF32[(v + 8) >> 2],
        HEAPF32[(v + 12) >> 2]
      )
    }
    function _emscripten_glVertexAttribDivisor(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor)
    }
    function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor)
    }
    function _emscripten_glVertexAttribDivisorARB(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor)
    }
    function _emscripten_glVertexAttribDivisorEXT(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor)
    }
    function _emscripten_glVertexAttribDivisorNV(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor)
    }
    function _emscripten_glVertexAttribI4i(x0, x1, x2, x3, x4) {
      GLctx["vertexAttribI4i"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glVertexAttribI4iv(index, v) {
      GLctx.vertexAttribI4i(
        index,
        HEAP32[v >> 2],
        HEAP32[(v + 4) >> 2],
        HEAP32[(v + 8) >> 2],
        HEAP32[(v + 12) >> 2]
      )
    }
    function _emscripten_glVertexAttribI4ui(x0, x1, x2, x3, x4) {
      GLctx["vertexAttribI4ui"](x0, x1, x2, x3, x4)
    }
    function _emscripten_glVertexAttribI4uiv(index, v) {
      GLctx.vertexAttribI4ui(
        index,
        HEAPU32[v >> 2],
        HEAPU32[(v + 4) >> 2],
        HEAPU32[(v + 8) >> 2],
        HEAPU32[(v + 12) >> 2]
      )
    }
    function _emscripten_glVertexAttribIPointer(
      index,
      size,
      type,
      stride,
      ptr
    ) {
      GLctx["vertexAttribIPointer"](index, size, type, stride, ptr)
    }
    function _emscripten_glVertexAttribPointer(
      index,
      size,
      type,
      normalized,
      stride,
      ptr
    ) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
    }
    function _emscripten_glViewport(x0, x1, x2, x3) {
      GLctx["viewport"](x0, x1, x2, x3)
    }
    function _emscripten_glWaitSync(sync, flags, timeoutLo, timeoutHi) {
      GLctx.waitSync(
        GL.syncs[sync],
        flags,
        convertI32PairToI53(timeoutLo, timeoutHi)
      )
    }
    function _longjmp(env, value) {
      _setThrew(env, value || 1)
      throw "longjmp"
    }
    function _emscripten_longjmp(a0, a1) {
      return _longjmp(a0, a1)
    }
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num)
    }
    function _emscripten_get_heap_size() {
      return HEAPU8.length
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16)
        updateGlobalBufferAndViews(wasmMemory.buffer)
        return 1
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      requestedSize = requestedSize >>> 0
      var oldSize = _emscripten_get_heap_size()
      var maxHeapSize = 2147483648
      if (requestedSize > maxHeapSize) {
        return false
      }
      var minHeapSize = 16777216
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown)
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296
        )
        var newSize = Math.min(
          maxHeapSize,
          alignUp(
            Math.max(minHeapSize, requestedSize, overGrownHeapSize),
            65536
          )
        )
        var replacement = emscripten_realloc_buffer(newSize)
        if (replacement) {
          return true
        }
      }
      return false
    }
    function _emscripten_set_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target)
      if (!canvas) return -4
      canvas.width = width
      canvas.height = height
      return 0
    }
    function __fillMouseEventData(eventStruct, e, target) {
      var idx = eventStruct >> 2
      HEAP32[idx + 0] = e.screenX
      HEAP32[idx + 1] = e.screenY
      HEAP32[idx + 2] = e.clientX
      HEAP32[idx + 3] = e.clientY
      HEAP32[idx + 4] = e.ctrlKey
      HEAP32[idx + 5] = e.shiftKey
      HEAP32[idx + 6] = e.altKey
      HEAP32[idx + 7] = e.metaKey
      HEAP16[idx * 2 + 16] = e.button
      HEAP16[idx * 2 + 17] = e.buttons
      HEAP32[idx + 9] = e["movementX"]
      HEAP32[idx + 10] = e["movementY"]
      var rect = __getBoundingClientRect(target)
      HEAP32[idx + 11] = e.clientX - rect.left
      HEAP32[idx + 12] = e.clientY - rect.top
    }
    function __registerMouseEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      eventTypeId,
      eventTypeString,
      targetThread
    ) {
      if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(64)
      target = findEventTarget(target)
      var mouseEventHandlerFunc = function (ev) {
        var e = ev || event
        __fillMouseEventData(JSEvents.mouseEvent, e, target)
        if (
          wasmTable.get(callbackfunc)(
            eventTypeId,
            JSEvents.mouseEvent,
            userData
          )
        )
          e.preventDefault()
      }
      var eventHandler = {
        target: target,
        allowsDeferredCalls:
          eventTypeString != "mousemove" &&
          eventTypeString != "mouseenter" &&
          eventTypeString != "mouseleave",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
      }
      JSEvents.registerOrRemoveHandler(eventHandler)
    }
    function _emscripten_set_click_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        4,
        "click",
        targetThread
      )
      return 0
    }
    function _emscripten_set_dblclick_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        7,
        "dblclick",
        targetThread
      )
      return 0
    }
    function _emscripten_set_element_css_size(target, width, height) {
      target = findEventTarget(target)
      if (!target) return -4
      target.style.width = width + "px"
      target.style.height = height + "px"
      return 0
    }
    function __registerKeyEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      eventTypeId,
      eventTypeString,
      targetThread
    ) {
      if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(164)
      var keyEventHandlerFunc = function (e) {
        var keyEventData = JSEvents.keyEvent
        var idx = keyEventData >> 2
        HEAP32[idx + 0] = e.location
        HEAP32[idx + 1] = e.ctrlKey
        HEAP32[idx + 2] = e.shiftKey
        HEAP32[idx + 3] = e.altKey
        HEAP32[idx + 4] = e.metaKey
        HEAP32[idx + 5] = e.repeat
        HEAP32[idx + 6] = e.charCode
        HEAP32[idx + 7] = e.keyCode
        HEAP32[idx + 8] = e.which
        stringToUTF8(e.key || "", keyEventData + 36, 32)
        stringToUTF8(e.code || "", keyEventData + 68, 32)
        stringToUTF8(e.char || "", keyEventData + 100, 32)
        stringToUTF8(e.locale || "", keyEventData + 132, 32)
        if (wasmTable.get(callbackfunc)(eventTypeId, keyEventData, userData))
          e.preventDefault()
      }
      var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
      }
      JSEvents.registerOrRemoveHandler(eventHandler)
    }
    function _emscripten_set_keydown_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerKeyEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        2,
        "keydown",
        targetThread
      )
      return 0
    }
    function _emscripten_set_keyup_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerKeyEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        3,
        "keyup",
        targetThread
      )
      return 0
    }
    function _emscripten_set_main_loop(
      func,
      fps,
      simulateInfiniteLoop,
      arg,
      noSetTiming
    ) {
      var browserIterationFunc = wasmTable.get(func)
      setMainLoop(
        browserIterationFunc,
        fps,
        simulateInfiniteLoop,
        arg,
        noSetTiming
      )
    }
    function _emscripten_set_mousedown_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        5,
        "mousedown",
        targetThread
      )
      return 0
    }
    function _emscripten_set_mouseenter_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        33,
        "mouseenter",
        targetThread
      )
      return 0
    }
    function _emscripten_set_mouseleave_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        34,
        "mouseleave",
        targetThread
      )
      return 0
    }
    function _emscripten_set_mousemove_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        8,
        "mousemove",
        targetThread
      )
      return 0
    }
    function _emscripten_set_mouseup_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerMouseEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        6,
        "mouseup",
        targetThread
      )
      return 0
    }
    function __registerUiEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      eventTypeId,
      eventTypeString,
      targetThread
    ) {
      if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36)
      target = findEventTarget(target)
      var uiEventHandlerFunc = function (ev) {
        var e = ev || event
        if (e.target != target) {
          return
        }
        var b = document.body
        if (!b) {
          return
        }
        var uiEvent = JSEvents.uiEvent
        HEAP32[uiEvent >> 2] = e.detail
        HEAP32[(uiEvent + 4) >> 2] = b.clientWidth
        HEAP32[(uiEvent + 8) >> 2] = b.clientHeight
        HEAP32[(uiEvent + 12) >> 2] = innerWidth
        HEAP32[(uiEvent + 16) >> 2] = innerHeight
        HEAP32[(uiEvent + 20) >> 2] = outerWidth
        HEAP32[(uiEvent + 24) >> 2] = outerHeight
        HEAP32[(uiEvent + 28) >> 2] = pageXOffset
        HEAP32[(uiEvent + 32) >> 2] = pageYOffset
        if (wasmTable.get(callbackfunc)(eventTypeId, uiEvent, userData))
          e.preventDefault()
      }
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture: useCapture
      }
      JSEvents.registerOrRemoveHandler(eventHandler)
    }
    function _emscripten_set_resize_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerUiEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        10,
        "resize",
        targetThread
      )
      return 0
    }
    function __registerTouchEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      eventTypeId,
      eventTypeString,
      targetThread
    ) {
      if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1684)
      target = findEventTarget(target)
      var touchEventHandlerFunc = function (e) {
        var touches = {}
        var et = e.touches
        for (var i = 0; i < et.length; ++i) {
          var touch = et[i]
          touches[touch.identifier] = touch
        }
        et = e.changedTouches
        for (var i = 0; i < et.length; ++i) {
          var touch = et[i]
          touch.isChanged = 1
          touches[touch.identifier] = touch
        }
        et = e.targetTouches
        for (var i = 0; i < et.length; ++i) {
          touches[et[i].identifier].onTarget = 1
        }
        var touchEvent = JSEvents.touchEvent
        var idx = touchEvent >> 2
        HEAP32[idx + 1] = e.ctrlKey
        HEAP32[idx + 2] = e.shiftKey
        HEAP32[idx + 3] = e.altKey
        HEAP32[idx + 4] = e.metaKey
        idx += 5
        var targetRect = __getBoundingClientRect(target)
        var numTouches = 0
        for (var i in touches) {
          var t = touches[i]
          HEAP32[idx + 0] = t.identifier
          HEAP32[idx + 1] = t.screenX
          HEAP32[idx + 2] = t.screenY
          HEAP32[idx + 3] = t.clientX
          HEAP32[idx + 4] = t.clientY
          HEAP32[idx + 5] = t.pageX
          HEAP32[idx + 6] = t.pageY
          HEAP32[idx + 7] = t.isChanged
          HEAP32[idx + 8] = t.onTarget
          HEAP32[idx + 9] = t.clientX - targetRect.left
          HEAP32[idx + 10] = t.clientY - targetRect.top
          idx += 13
          if (++numTouches > 31) {
            break
          }
        }
        HEAP32[touchEvent >> 2] = numTouches
        if (wasmTable.get(callbackfunc)(eventTypeId, touchEvent, userData))
          e.preventDefault()
      }
      var eventHandler = {
        target: target,
        allowsDeferredCalls:
          eventTypeString == "touchstart" || eventTypeString == "touchend",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture: useCapture
      }
      JSEvents.registerOrRemoveHandler(eventHandler)
    }
    function _emscripten_set_touchcancel_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerTouchEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        25,
        "touchcancel",
        targetThread
      )
      return 0
    }
    function _emscripten_set_touchend_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerTouchEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        23,
        "touchend",
        targetThread
      )
      return 0
    }
    function _emscripten_set_touchmove_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerTouchEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        24,
        "touchmove",
        targetThread
      )
      return 0
    }
    function _emscripten_set_touchstart_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      __registerTouchEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        22,
        "touchstart",
        targetThread
      )
      return 0
    }
    function __registerWheelEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      eventTypeId,
      eventTypeString,
      targetThread
    ) {
      if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(96)
      var wheelHandlerFunc = function (ev) {
        var e = ev || event
        var wheelEvent = JSEvents.wheelEvent
        __fillMouseEventData(wheelEvent, e, target)
        HEAPF64[(wheelEvent + 64) >> 3] = e["deltaX"]
        HEAPF64[(wheelEvent + 72) >> 3] = e["deltaY"]
        HEAPF64[(wheelEvent + 80) >> 3] = e["deltaZ"]
        HEAP32[(wheelEvent + 88) >> 2] = e["deltaMode"]
        if (wasmTable.get(callbackfunc)(eventTypeId, wheelEvent, userData))
          e.preventDefault()
      }
      var eventHandler = {
        target: target,
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture: useCapture
      }
      JSEvents.registerOrRemoveHandler(eventHandler)
    }
    function _emscripten_set_wheel_callback_on_thread(
      target,
      userData,
      useCapture,
      callbackfunc,
      targetThread
    ) {
      target = findEventTarget(target)
      if (typeof target.onwheel !== "undefined") {
        __registerWheelEventCallback(
          target,
          userData,
          useCapture,
          callbackfunc,
          9,
          "wheel",
          targetThread
        )
        return 0
      } else {
        return -1
      }
    }
    function _emscripten_webgl_enable_extension(contextHandle, extension) {
      var context = GL.getContext(contextHandle)
      var extString = UTF8ToString(extension)
      if (extString.indexOf("GL_") == 0) extString = extString.substr(3)
      if (extString == "ANGLE_instanced_arrays")
        __webgl_enable_ANGLE_instanced_arrays(GLctx)
      if (extString == "OES_vertex_array_object")
        __webgl_enable_OES_vertex_array_object(GLctx)
      if (extString == "WEBGL_draw_buffers")
        __webgl_enable_WEBGL_draw_buffers(GLctx)
      if (extString == "WEBGL_draw_instanced_base_vertex_base_instance")
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx)
      if (extString == "WEBGL_multi_draw_instanced_base_vertex_base_instance")
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
          GLctx
        )
      if (extString == "WEBGL_multi_draw")
        __webgl_enable_WEBGL_multi_draw(GLctx)
      var ext = context.GLctx.getExtension(extString)
      return !!ext
    }
    var __emscripten_webgl_power_preferences = [
      "default",
      "low-power",
      "high-performance"
    ]
    function _emscripten_webgl_get_context_attributes(c, a) {
      if (!a) return -5
      c = GL.contexts[c]
      if (!c) return -3
      var t = c.GLctx
      if (!t) return -3
      t = t.getContextAttributes()
      HEAP32[a >> 2] = t.alpha
      HEAP32[(a + 4) >> 2] = t.depth
      HEAP32[(a + 8) >> 2] = t.stencil
      HEAP32[(a + 12) >> 2] = t.antialias
      HEAP32[(a + 16) >> 2] = t.premultipliedAlpha
      HEAP32[(a + 20) >> 2] = t.preserveDrawingBuffer
      var power =
        t["powerPreference"] &&
        __emscripten_webgl_power_preferences.indexOf(t["powerPreference"])
      HEAP32[(a + 24) >> 2] = power
      HEAP32[(a + 28) >> 2] = t.failIfMajorPerformanceCaveat
      HEAP32[(a + 32) >> 2] = c.version
      HEAP32[(a + 36) >> 2] = 0
      HEAP32[(a + 40) >> 2] = c.attributes.enableExtensionsByDefault
      return 0
    }
    function _emscripten_webgl_do_get_current_context() {
      return GL.currentContext ? GL.currentContext.handle : 0
    }
    function _emscripten_webgl_get_current_context() {
      return _emscripten_webgl_do_get_current_context()
    }
    var ENV = {}
    function getExecutableName() {
      return thisProgram || "./this.program"
    }
    function getEnvStrings() {
      if (!getEnvStrings.strings) {
        var lang =
          (
            (typeof navigator === "object" &&
              navigator.languages &&
              navigator.languages[0]) ||
            "C"
          ).replace("-", "_") + ".UTF-8"
        var env = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: lang,
          _: getExecutableName()
        }
        for (var x in ENV) {
          env[x] = ENV[x]
        }
        var strings = []
        for (var x in env) {
          strings.push(x + "=" + env[x])
        }
        getEnvStrings.strings = strings
      }
      return getEnvStrings.strings
    }
    function _environ_get(__environ, environ_buf) {
      try {
        var bufSize = 0
        getEnvStrings().forEach(function (string, i) {
          var ptr = environ_buf + bufSize
          HEAP32[(__environ + i * 4) >> 2] = ptr
          writeAsciiToMemory(string, ptr)
          bufSize += string.length + 1
        })
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _environ_sizes_get(penviron_count, penviron_buf_size) {
      try {
        var strings = getEnvStrings()
        HEAP32[penviron_count >> 2] = strings.length
        var bufSize = 0
        strings.forEach(function (string) {
          bufSize += string.length + 1
        })
        HEAP32[penviron_buf_size >> 2] = bufSize
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _exit(status) {
      exit(status)
    }
    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        FS.close(stream)
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _fd_fdstat_get(fd, pbuf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        var type = stream.tty
          ? 2
          : FS.isDir(stream.mode)
          ? 3
          : FS.isLink(stream.mode)
          ? 7
          : 4
        HEAP8[pbuf >> 0] = type
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _fd_read(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        var num = SYSCALLS.doReadv(stream, iov, iovcnt)
        HEAP32[pnum >> 2] = num
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        var HIGH_OFFSET = 4294967296
        var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0)
        var DOUBLE_LIMIT = 9007199254740992
        if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
          return -61
        }
        FS.llseek(stream, offset, whence)
        ;(tempI64 = [
          stream.position >>> 0,
          ((tempDouble = stream.position),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0)
        ]),
          (HEAP32[newOffset >> 2] = tempI64[0]),
          (HEAP32[(newOffset + 4) >> 2] = tempI64[1])
        if (stream.getdents && offset === 0 && whence === 0)
          stream.getdents = null
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd)
        var num = SYSCALLS.doWritev(stream, iov, iovcnt)
        HEAP32[pnum >> 2] = num
        return 0
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e)
        return e.errno
      }
    }
    function _getTempRet0() {
      return getTempRet0() | 0
    }
    function _gettimeofday(ptr) {
      var now = Date.now()
      HEAP32[ptr >> 2] = (now / 1e3) | 0
      HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0
      return 0
    }
    function _glActiveTexture(x0) {
      GLctx["activeTexture"](x0)
    }
    function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader])
    }
    function _glBindAttribLocation(program, index, name) {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
    }
    function _glBindBuffer(target, buffer) {
      if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
      } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
      }
      GLctx.bindBuffer(target, GL.buffers[buffer])
    }
    function _glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
    }
    function _glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
    }
    function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture])
    }
    function _glBlendEquation(x0) {
      GLctx["blendEquation"](x0)
    }
    function _glBlendFunc(x0, x1) {
      GLctx["blendFunc"](x0, x1)
    }
    function _glBlendFuncSeparate(x0, x1, x2, x3) {
      GLctx["blendFuncSeparate"](x0, x1, x2, x3)
    }
    function _glBufferData(target, size, data, usage) {
      if (GL.currentContext.version >= 2) {
        if (data) {
          GLctx.bufferData(target, HEAPU8, usage, data, size)
        } else {
          GLctx.bufferData(target, size, usage)
        }
      } else {
        GLctx.bufferData(
          target,
          data ? HEAPU8.subarray(data, data + size) : size,
          usage
        )
      }
    }
    function _glBufferSubData(target, offset, size, data) {
      if (GL.currentContext.version >= 2) {
        GLctx.bufferSubData(target, offset, HEAPU8, data, size)
        return
      }
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
    }
    function _glCheckFramebufferStatus(x0) {
      return GLctx["checkFramebufferStatus"](x0)
    }
    function _glClear(x0) {
      GLctx["clear"](x0)
    }
    function _glClearColor(x0, x1, x2, x3) {
      GLctx["clearColor"](x0, x1, x2, x3)
    }
    function _glClearDepthf(x0) {
      GLctx["clearDepth"](x0)
    }
    function _glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
    }
    function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader])
    }
    function _glCompressedTexImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      imageSize,
      data
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx["compressedTexImage2D"](
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            imageSize,
            data
          )
        } else {
          GLctx["compressedTexImage2D"](
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            HEAPU8,
            data,
            imageSize
          )
        }
        return
      }
      GLctx["compressedTexImage2D"](
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        data ? HEAPU8.subarray(data, data + imageSize) : null
      )
    }
    function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
      GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
    }
    function _glCreateProgram() {
      var id = GL.getNewId(GL.programs)
      var program = GLctx.createProgram()
      program.name = id
      GL.programs[id] = program
      return id
    }
    function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders)
      GL.shaders[id] = GLctx.createShader(shaderType)
      return id
    }
    function _glCullFace(x0) {
      GLctx["cullFace"](x0)
    }
    function _glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(buffers + i * 4) >> 2]
        var buffer = GL.buffers[id]
        if (!buffer) continue
        GLctx.deleteBuffer(buffer)
        buffer.name = 0
        GL.buffers[id] = null
        if (id == GLctx.currentPixelPackBufferBinding)
          GLctx.currentPixelPackBufferBinding = 0
        if (id == GLctx.currentPixelUnpackBufferBinding)
          GLctx.currentPixelUnpackBufferBinding = 0
      }
    }
    function _glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(framebuffers + i * 4) >> 2]
        var framebuffer = GL.framebuffers[id]
        if (!framebuffer) continue
        GLctx.deleteFramebuffer(framebuffer)
        framebuffer.name = 0
        GL.framebuffers[id] = null
      }
    }
    function _glDeleteProgram(id) {
      if (!id) return
      var program = GL.programs[id]
      if (!program) {
        GL.recordError(1281)
        return
      }
      GLctx.deleteProgram(program)
      program.name = 0
      GL.programs[id] = null
      GL.programInfos[id] = null
    }
    function _glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(renderbuffers + i * 4) >> 2]
        var renderbuffer = GL.renderbuffers[id]
        if (!renderbuffer) continue
        GLctx.deleteRenderbuffer(renderbuffer)
        renderbuffer.name = 0
        GL.renderbuffers[id] = null
      }
    }
    function _glDeleteShader(id) {
      if (!id) return
      var shader = GL.shaders[id]
      if (!shader) {
        GL.recordError(1281)
        return
      }
      GLctx.deleteShader(shader)
      GL.shaders[id] = null
    }
    function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(textures + i * 4) >> 2]
        var texture = GL.textures[id]
        if (!texture) continue
        GLctx.deleteTexture(texture)
        texture.name = 0
        GL.textures[id] = null
      }
    }
    function _glDepthFunc(x0) {
      GLctx["depthFunc"](x0)
    }
    function _glDepthMask(flag) {
      GLctx.depthMask(!!flag)
    }
    function _glDisable(x0) {
      GLctx["disable"](x0)
    }
    function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index)
    }
    function _glDrawArrays(mode, first, count) {
      GLctx.drawArrays(mode, first, count)
    }
    function _glEnable(x0) {
      GLctx["enable"](x0)
    }
    function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index)
    }
    function _glFinish() {
      GLctx["finish"]()
    }
    function _glFlush() {
      GLctx["flush"]()
    }
    function _glFramebufferRenderbuffer(
      target,
      attachment,
      renderbuffertarget,
      renderbuffer
    ) {
      GLctx.framebufferRenderbuffer(
        target,
        attachment,
        renderbuffertarget,
        GL.renderbuffers[renderbuffer]
      )
    }
    function _glFramebufferTexture2D(
      target,
      attachment,
      textarget,
      texture,
      level
    ) {
      GLctx.framebufferTexture2D(
        target,
        attachment,
        textarget,
        GL.textures[texture],
        level
      )
    }
    function _glFrontFace(x0) {
      GLctx["frontFace"](x0)
    }
    function _glGenBuffers(n, buffers) {
      __glGenObject(n, buffers, "createBuffer", GL.buffers)
    }
    function _glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
    }
    function _glGenRenderbuffers(n, renderbuffers) {
      __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
    }
    function _glGenTextures(n, textures) {
      __glGenObject(n, textures, "createTexture", GL.textures)
    }
    function _glGenerateMipmap(x0) {
      GLctx["generateMipmap"](x0)
    }
    function _glGetAttribLocation(program, name) {
      return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
    }
    function _glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 4)
    }
    function _glGetError() {
      var error = GLctx.getError() || GL.lastError
      GL.lastError = 0
      return error
    }
    function _glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2)
    }
    function _glGetFramebufferAttachmentParameteriv(
      target,
      attachment,
      pname,
      params
    ) {
      var result = GLctx.getFramebufferAttachmentParameter(
        target,
        attachment,
        pname
      )
      if (
        result instanceof WebGLRenderbuffer ||
        result instanceof WebGLTexture
      ) {
        result = result.name | 0
      }
      HEAP32[params >> 2] = result
    }
    function _glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0)
    }
    function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program])
      if (log === null) log = "(unknown error)"
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    }
    function _glGetProgramiv(program, pname, p) {
      if (!p) {
        GL.recordError(1281)
        return
      }
      if (program >= GL.counter) {
        GL.recordError(1281)
        return
      }
      var ptable = GL.programInfos[program]
      if (!ptable) {
        GL.recordError(1282)
        return
      }
      if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(GL.programs[program])
        if (log === null) log = "(unknown error)"
        HEAP32[p >> 2] = log.length + 1
      } else if (pname == 35719) {
        HEAP32[p >> 2] = ptable.maxUniformLength
      } else if (pname == 35722) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program]
          var numAttribs = GLctx.getProgramParameter(program, 35721)
          ptable.maxAttributeLength = 0
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i)
            ptable.maxAttributeLength = Math.max(
              ptable.maxAttributeLength,
              activeAttrib.name.length + 1
            )
          }
        }
        HEAP32[p >> 2] = ptable.maxAttributeLength
      } else if (pname == 35381) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program]
          var numBlocks = GLctx.getProgramParameter(program, 35382)
          ptable.maxUniformBlockNameLength = 0
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i)
            ptable.maxUniformBlockNameLength = Math.max(
              ptable.maxUniformBlockNameLength,
              activeBlockName.length + 1
            )
          }
        }
        HEAP32[p >> 2] = ptable.maxUniformBlockNameLength
      } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname)
      }
    }
    function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader])
      if (log === null) log = "(unknown error)"
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    }
    function _glGetShaderPrecisionFormat(
      shaderType,
      precisionType,
      range,
      precision
    ) {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType)
      HEAP32[range >> 2] = result.rangeMin
      HEAP32[(range + 4) >> 2] = result.rangeMax
      HEAP32[precision >> 2] = result.precision
    }
    function _glGetShaderiv(shader, pname, p) {
      if (!p) {
        GL.recordError(1281)
        return
      }
      if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader])
        if (log === null) log = "(unknown error)"
        var logLength = log ? log.length + 1 : 0
        HEAP32[p >> 2] = logLength
      } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader])
        var sourceLength = source ? source.length + 1 : 0
        HEAP32[p >> 2] = sourceLength
      } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
      }
    }
    function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_]
      var ret
      switch (name_) {
        case 7939:
          var exts = GLctx.getSupportedExtensions() || []
          exts = exts.concat(
            exts.map(function (e) {
              return "GL_" + e
            })
          )
          ret = stringToNewUTF8(exts.join(" "))
          break
        case 7936:
        case 7937:
        case 37445:
        case 37446:
          var s = GLctx.getParameter(name_)
          if (!s) {
            GL.recordError(1280)
          }
          ret = stringToNewUTF8(s)
          break
        case 7938:
          var glVersion = GLctx.getParameter(7938)
          if (GL.currentContext.version >= 2)
            glVersion = "OpenGL ES 3.0 (" + glVersion + ")"
          else {
            glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
          }
          ret = stringToNewUTF8(glVersion)
          break
        case 35724:
          var glslVersion = GLctx.getParameter(35724)
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/
          var ver_num = glslVersion.match(ver_re)
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0"
            glslVersion =
              "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
          }
          ret = stringToNewUTF8(glslVersion)
          break
        default:
          GL.recordError(1280)
          return 0
      }
      GL.stringCache[name_] = ret
      return ret
    }
    function _glGetUniformLocation(program, name) {
      name = UTF8ToString(name)
      var arrayIndex = 0
      if (name[name.length - 1] == "]") {
        var leftBrace = name.lastIndexOf("[")
        arrayIndex =
          name[leftBrace + 1] != "]" ? jstoi_q(name.slice(leftBrace + 1)) : 0
        name = name.slice(0, leftBrace)
      }
      var uniformInfo =
        GL.programInfos[program] && GL.programInfos[program].uniforms[name]
      if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) {
        return uniformInfo[1] + arrayIndex
      } else {
        return -1
      }
    }
    function _glLineWidth(x0) {
      GLctx["lineWidth"](x0)
    }
    function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program])
      GL.populateUniformTable(program)
    }
    function _glPixelStorei(pname, param) {
      if (pname == 3317) {
        GL.unpackAlignment = param
      }
      GLctx.pixelStorei(pname, param)
    }
    function _glPolygonOffset(x0, x1) {
      GLctx["polygonOffset"](x0, x1)
    }
    function _glReadPixels(x, y, width, height, format, type, pixels) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelPackBufferBinding) {
          GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
          var heap = heapObjectForWebGLType(type)
          GLctx.readPixels(
            x,
            y,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        }
        return
      }
      var pixelData = emscriptenWebGLGetTexPixelData(
        type,
        format,
        width,
        height,
        pixels,
        format
      )
      if (!pixelData) {
        GL.recordError(1280)
        return
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData)
    }
    function _glRenderbufferStorage(x0, x1, x2, x3) {
      GLctx["renderbufferStorage"](x0, x1, x2, x3)
    }
    function _glScissor(x0, x1, x2, x3) {
      GLctx["scissor"](x0, x1, x2, x3)
    }
    function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length)
      GLctx.shaderSource(GL.shaders[shader], source)
    }
    function _glStencilFunc(x0, x1, x2) {
      GLctx["stencilFunc"](x0, x1, x2)
    }
    function _glStencilOp(x0, x1, x2) {
      GLctx["stencilOp"](x0, x1, x2)
    }
    function _glTexImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      pixels
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            pixels
          )
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type)
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        } else {
          GLctx.texImage2D(
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            null
          )
        }
        return
      }
      GLctx.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        format,
        type,
        pixels
          ? emscriptenWebGLGetTexPixelData(
              type,
              format,
              width,
              height,
              pixels,
              internalFormat
            )
          : null
      )
    }
    function _glTexParameteri(x0, x1, x2) {
      GLctx["texParameteri"](x0, x1, x2)
    }
    function _glTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      pixels
    ) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            pixels
          )
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type)
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          )
        } else {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            null
          )
        }
        return
      }
      var pixelData = null
      if (pixels)
        pixelData = emscriptenWebGLGetTexPixelData(
          type,
          format,
          width,
          height,
          pixels,
          0
        )
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        pixelData
      )
    }
    function _glUniform1f(location, v0) {
      GLctx.uniform1f(GL.uniforms[location], v0)
    }
    function _glUniform1fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform1fv(GL.uniforms[location], HEAPF32, value >> 2, count)
        return
      }
      if (count <= 288) {
        var view = miniTempWebGLFloatBuffers[count - 1]
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 4) >> 2)
      }
      GLctx.uniform1fv(GL.uniforms[location], view)
    }
    function _glUniform1i(location, v0) {
      GLctx.uniform1i(GL.uniforms[location], v0)
    }
    function _glUniform1iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform1iv(GL.uniforms[location], HEAP32, value >> 2, count)
        return
      }
      if (count <= 288) {
        var view = __miniTempWebGLIntBuffers[count - 1]
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2)
      }
      GLctx.uniform1iv(GL.uniforms[location], view)
    }
    function _glUniform2fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform2fv(GL.uniforms[location], HEAPF32, value >> 2, count * 2)
        return
      }
      if (count <= 144) {
        var view = miniTempWebGLFloatBuffers[2 * count - 1]
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 8) >> 2)
      }
      GLctx.uniform2fv(GL.uniforms[location], view)
    }
    function _glUniform2iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform2iv(GL.uniforms[location], HEAP32, value >> 2, count * 2)
        return
      }
      if (count <= 144) {
        var view = __miniTempWebGLIntBuffers[2 * count - 1]
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 8) >> 2)
      }
      GLctx.uniform2iv(GL.uniforms[location], view)
    }
    function _glUniform3fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform3fv(GL.uniforms[location], HEAPF32, value >> 2, count * 3)
        return
      }
      if (count <= 96) {
        var view = miniTempWebGLFloatBuffers[3 * count - 1]
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = HEAPF32[(value + 4 * i) >> 2]
          view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 12) >> 2)
      }
      GLctx.uniform3fv(GL.uniforms[location], view)
    }
    function _glUniform3iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform3iv(GL.uniforms[location], HEAP32, value >> 2, count * 3)
        return
      }
      if (count <= 96) {
        var view = __miniTempWebGLIntBuffers[3 * count - 1]
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 12) >> 2)
      }
      GLctx.uniform3iv(GL.uniforms[location], view)
    }
    function _glUniform4fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4)
        return
      }
      if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1]
        var heap = HEAPF32
        value >>= 2
        for (var i = 0; i < 4 * count; i += 4) {
          var dst = value + i
          view[i] = heap[dst]
          view[i + 1] = heap[dst + 1]
          view[i + 2] = heap[dst + 2]
          view[i + 3] = heap[dst + 3]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2)
      }
      GLctx.uniform4fv(GL.uniforms[location], view)
    }
    function _glUniform4iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniform4iv(GL.uniforms[location], HEAP32, value >> 2, count * 4)
        return
      }
      if (count <= 72) {
        var view = __miniTempWebGLIntBuffers[4 * count - 1]
        for (var i = 0; i < 4 * count; i += 4) {
          view[i] = HEAP32[(value + 4 * i) >> 2]
          view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2]
          view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2]
          view[i + 3] = HEAP32[(value + (4 * i + 12)) >> 2]
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 16) >> 2)
      }
      GLctx.uniform4iv(GL.uniforms[location], view)
    }
    function _glUniformMatrix4fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix4fv(
          GL.uniforms[location],
          !!transpose,
          HEAPF32,
          value >> 2,
          count * 16
        )
        return
      }
      if (count <= 18) {
        var view = miniTempWebGLFloatBuffers[16 * count - 1]
        var heap = HEAPF32
        value >>= 2
        for (var i = 0; i < 16 * count; i += 16) {
          var dst = value + i
          view[i] = heap[dst]
          view[i + 1] = heap[dst + 1]
          view[i + 2] = heap[dst + 2]
          view[i + 3] = heap[dst + 3]
          view[i + 4] = heap[dst + 4]
          view[i + 5] = heap[dst + 5]
          view[i + 6] = heap[dst + 6]
          view[i + 7] = heap[dst + 7]
          view[i + 8] = heap[dst + 8]
          view[i + 9] = heap[dst + 9]
          view[i + 10] = heap[dst + 10]
          view[i + 11] = heap[dst + 11]
          view[i + 12] = heap[dst + 12]
          view[i + 13] = heap[dst + 13]
          view[i + 14] = heap[dst + 14]
          view[i + 15] = heap[dst + 15]
        }
      } else {
        var view = HEAPF32.subarray(value >> 2, (value + count * 64) >> 2)
      }
      GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view)
    }
    function _glUseProgram(program) {
      GLctx.useProgram(GL.programs[program])
    }
    function _glVertexAttribPointer(
      index,
      size,
      type,
      normalized,
      stride,
      ptr
    ) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
    }
    function _glViewport(x0, x1, x2, x3) {
      GLctx["viewport"](x0, x1, x2, x3)
    }
    function _llvm_eh_typeid_for(type) {
      return type
    }
    function _pthread_create() {
      return 6
    }
    function _pthread_join() {
      return 28
    }
    function _setTempRet0($i) {
      setTempRet0($i | 0)
    }
    function __isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    }
    function __arraySum(array, index) {
      var sum = 0
      for (var i = 0; i <= index; sum += array[i++]) {}
      return sum
    }
    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    function __addDays(date, days) {
      var newDate = new Date(date.getTime())
      while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear())
        var currentMonth = newDate.getMonth()
        var daysInCurrentMonth = (
          leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR
        )[currentMonth]
        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1
          newDate.setDate(1)
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1)
          } else {
            newDate.setMonth(0)
            newDate.setFullYear(newDate.getFullYear() + 1)
          }
        } else {
          newDate.setDate(newDate.getDate() + days)
          return newDate
        }
      }
      return newDate
    }
    function _strftime(s, maxsize, format, tm) {
      var tm_zone = HEAP32[(tm + 40) >> 2]
      var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[(tm + 4) >> 2],
        tm_hour: HEAP32[(tm + 8) >> 2],
        tm_mday: HEAP32[(tm + 12) >> 2],
        tm_mon: HEAP32[(tm + 16) >> 2],
        tm_year: HEAP32[(tm + 20) >> 2],
        tm_wday: HEAP32[(tm + 24) >> 2],
        tm_yday: HEAP32[(tm + 28) >> 2],
        tm_isdst: HEAP32[(tm + 32) >> 2],
        tm_gmtoff: HEAP32[(tm + 36) >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
      }
      var pattern = UTF8ToString(format)
      var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
      }
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(
          new RegExp(rule, "g"),
          EXPANSION_RULES_1[rule]
        )
      }
      var WEEKDAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
      var MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
      function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || ""
        while (str.length < digits) {
          str = character[0] + str
        }
        return str
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate())
          }
        }
        return compare
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29)
          case 1:
            return janFourth
          case 2:
            return new Date(janFourth.getFullYear(), 0, 3)
          case 3:
            return new Date(janFourth.getFullYear(), 0, 2)
          case 4:
            return new Date(janFourth.getFullYear(), 0, 1)
          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31)
          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30)
        }
      }
      function getWeekBasedYear(date) {
        var thisDate = __addDays(
          new Date(date.tm_year + 1900, 0, 1),
          date.tm_yday
        )
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4)
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4)
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear)
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear)
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1
          } else {
            return thisDate.getFullYear()
          }
        } else {
          return thisDate.getFullYear() - 1
        }
      }
      var EXPANSION_RULES_2 = {
        "%a": function (date) {
          return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function (date) {
          return WEEKDAYS[date.tm_wday]
        },
        "%b": function (date) {
          return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function (date) {
          return MONTHS[date.tm_mon]
        },
        "%C": function (date) {
          var year = date.tm_year + 1900
          return leadingNulls((year / 100) | 0, 2)
        },
        "%d": function (date) {
          return leadingNulls(date.tm_mday, 2)
        },
        "%e": function (date) {
          return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function (date) {
          return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function (date) {
          return getWeekBasedYear(date)
        },
        "%H": function (date) {
          return leadingNulls(date.tm_hour, 2)
        },
        "%I": function (date) {
          var twelveHour = date.tm_hour
          if (twelveHour == 0) twelveHour = 12
          else if (twelveHour > 12) twelveHour -= 12
          return leadingNulls(twelveHour, 2)
        },
        "%j": function (date) {
          return leadingNulls(
            date.tm_mday +
              __arraySum(
                __isLeapYear(date.tm_year + 1900)
                  ? __MONTH_DAYS_LEAP
                  : __MONTH_DAYS_REGULAR,
                date.tm_mon - 1
              ),
            3
          )
        },
        "%m": function (date) {
          return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function (date) {
          return leadingNulls(date.tm_min, 2)
        },
        "%n": function () {
          return "\n"
        },
        "%p": function (date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return "AM"
          } else {
            return "PM"
          }
        },
        "%S": function (date) {
          return leadingNulls(date.tm_sec, 2)
        },
        "%t": function () {
          return "\t"
        },
        "%u": function (date) {
          return date.tm_wday || 7
        },
        "%U": function (date) {
          var janFirst = new Date(date.tm_year + 1900, 0, 1)
          var firstSunday =
            janFirst.getDay() === 0
              ? janFirst
              : __addDays(janFirst, 7 - janFirst.getDay())
          var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday)
          if (compareByDay(firstSunday, endDate) < 0) {
            var februaryFirstUntilEndMonth =
              __arraySum(
                __isLeapYear(endDate.getFullYear())
                  ? __MONTH_DAYS_LEAP
                  : __MONTH_DAYS_REGULAR,
                endDate.getMonth() - 1
              ) - 31
            var firstSundayUntilEndJanuary = 31 - firstSunday.getDate()
            var days =
              firstSundayUntilEndJanuary +
              februaryFirstUntilEndMonth +
              endDate.getDate()
            return leadingNulls(Math.ceil(days / 7), 2)
          }
          return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
        },
        "%V": function (date) {
          var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4)
          var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4)
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear)
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear)
          var endDate = __addDays(
            new Date(date.tm_year + 1900, 0, 1),
            date.tm_yday
          )
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            return "53"
          }
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            return "01"
          }
          var daysDifference
          if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
            daysDifference =
              date.tm_yday + 32 - firstWeekStartThisYear.getDate()
          } else {
            daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
          }
          return leadingNulls(Math.ceil(daysDifference / 7), 2)
        },
        "%w": function (date) {
          return date.tm_wday
        },
        "%W": function (date) {
          var janFirst = new Date(date.tm_year, 0, 1)
          var firstMonday =
            janFirst.getDay() === 1
              ? janFirst
              : __addDays(
                  janFirst,
                  janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1
                )
          var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday)
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth =
              __arraySum(
                __isLeapYear(endDate.getFullYear())
                  ? __MONTH_DAYS_LEAP
                  : __MONTH_DAYS_REGULAR,
                endDate.getMonth() - 1
              ) - 31
            var firstMondayUntilEndJanuary = 31 - firstMonday.getDate()
            var days =
              firstMondayUntilEndJanuary +
              februaryFirstUntilEndMonth +
              endDate.getDate()
            return leadingNulls(Math.ceil(days / 7), 2)
          }
          return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
        },
        "%y": function (date) {
          return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function (date) {
          return date.tm_year + 1900
        },
        "%z": function (date) {
          var off = date.tm_gmtoff
          var ahead = off >= 0
          off = Math.abs(off) / 60
          off = (off / 60) * 100 + (off % 60)
          return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function (date) {
          return date.tm_zone
        },
        "%%": function () {
          return "%"
        }
      }
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(
            new RegExp(rule, "g"),
            EXPANSION_RULES_2[rule](date)
          )
        }
      }
      var bytes = intArrayFromString(pattern, false)
      if (bytes.length > maxsize) {
        return 0
      }
      writeArrayToMemory(bytes, s)
      return bytes.length - 1
    }
    function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm)
    }
    function _sysconf(name) {
      switch (name) {
        case 30:
          return 16384
        case 85:
          var maxHeapSize = 2147483648
          return maxHeapSize / 16384
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
        case 79:
          return 200809
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024
        case 31:
        case 42:
        case 72:
          return 32
        case 87:
        case 26:
        case 33:
          return 2147483647
        case 34:
        case 1:
          return 47839
        case 38:
        case 36:
          return 99
        case 43:
        case 37:
          return 2048
        case 0:
          return 2097152
        case 3:
          return 65536
        case 28:
          return 32768
        case 44:
          return 32767
        case 75:
          return 16384
        case 39:
          return 1e3
        case 89:
          return 700
        case 71:
          return 256
        case 40:
          return 255
        case 2:
          return 100
        case 180:
          return 64
        case 25:
          return 20
        case 5:
          return 16
        case 6:
          return 6
        case 73:
          return 4
        case 84: {
          if (typeof navigator === "object")
            return navigator["hardwareConcurrency"] || 1
          return 1
        }
      }
      setErrNo(28)
      return -1
    }
    function _times(buffer) {
      if (buffer !== 0) {
        _memset(buffer, 0, 16)
      }
      return 0
    }
    var readAsmConstArgsArray = []
    function readAsmConstArgs(sigPtr, buf) {
      readAsmConstArgsArray.length = 0
      var ch
      buf >>= 2
      while ((ch = HEAPU8[sigPtr++])) {
        var double = ch < 105
        if (double && buf & 1) buf++
        readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf])
        ++buf
      }
      return readAsmConstArgsArray
    }
    var FSNode = function (parent, name, mode, rdev) {
      if (!parent) {
        parent = this
      }
      this.parent = parent
      this.mount = parent.mount
      this.mounted = null
      this.id = FS.nextInode++
      this.name = name
      this.mode = mode
      this.node_ops = {}
      this.stream_ops = {}
      this.rdev = rdev
    }
    var readMode = 292 | 73
    var writeMode = 146
    Object.defineProperties(FSNode.prototype, {
      read: {
        get: function () {
          return (this.mode & readMode) === readMode
        },
        set: function (val) {
          val ? (this.mode |= readMode) : (this.mode &= ~readMode)
        }
      },
      write: {
        get: function () {
          return (this.mode & writeMode) === writeMode
        },
        set: function (val) {
          val ? (this.mode |= writeMode) : (this.mode &= ~writeMode)
        }
      },
      isFolder: {
        get: function () {
          return FS.isDir(this.mode)
        }
      },
      isDevice: {
        get: function () {
          return FS.isChrdev(this.mode)
        }
      }
    })
    FS.FSNode = FSNode
    FS.staticInit()
    embind_init_charCodes()
    BindingError = Module["BindingError"] = extendError(Error, "BindingError")
    InternalError = Module["InternalError"] = extendError(
      Error,
      "InternalError"
    )
    init_emval()
    UnboundTypeError = Module["UnboundTypeError"] = extendError(
      Error,
      "UnboundTypeError"
    )
    Module["requestFullscreen"] = function Module_requestFullscreen(
      lockPointer,
      resizeCanvas
    ) {
      Browser.requestFullscreen(lockPointer, resizeCanvas)
    }
    Module["requestAnimationFrame"] = function Module_requestAnimationFrame(
      func
    ) {
      Browser.requestAnimationFrame(func)
    }
    Module["setCanvasSize"] = function Module_setCanvasSize(
      width,
      height,
      noUpdates
    ) {
      Browser.setCanvasSize(width, height, noUpdates)
    }
    Module["pauseMainLoop"] = function Module_pauseMainLoop() {
      Browser.mainLoop.pause()
    }
    Module["resumeMainLoop"] = function Module_resumeMainLoop() {
      Browser.mainLoop.resume()
    }
    Module["getUserMedia"] = function Module_getUserMedia() {
      Browser.getUserMedia()
    }
    Module["createContext"] = function Module_createContext(
      canvas,
      useWebGL,
      setInModule,
      webGLContextAttributes
    ) {
      return Browser.createContext(
        canvas,
        useWebGL,
        setInModule,
        webGLContextAttributes
      )
    }
    var GLctx
    for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i))
    var miniTempWebGLFloatBuffersStorage = new Float32Array(288)
    for (var i = 0; i < 288; ++i) {
      miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(
        0,
        i + 1
      )
    }
    var __miniTempWebGLIntBuffersStorage = new Int32Array(288)
    for (var i = 0; i < 288; ++i) {
      __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(
        0,
        i + 1
      )
    }
    var ASSERTIONS = false
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1
      var u8array = new Array(len)
      var numBytesWritten = stringToUTF8Array(
        stringy,
        u8array,
        0,
        u8array.length
      )
      if (dontAddNull) u8array.length = numBytesWritten
      return u8array
    }
    __ATINIT__.push({
      func: function () {
        ___wasm_call_ctors()
      }
    })
    var asmLibraryArg = {
      OSD_MemInfo_getModuleHeapLength: OSD_MemInfo_getModuleHeapLength,
      __assert_fail: ___assert_fail,
      __cxa_allocate_exception: ___cxa_allocate_exception,
      __cxa_atexit: ___cxa_atexit,
      __cxa_begin_catch: ___cxa_begin_catch,
      __cxa_end_catch: ___cxa_end_catch,
      __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
      __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
      __cxa_find_matching_catch_4: ___cxa_find_matching_catch_4,
      __cxa_find_matching_catch_5: ___cxa_find_matching_catch_5,
      __cxa_free_exception: ___cxa_free_exception,
      __cxa_rethrow: ___cxa_rethrow,
      __cxa_throw: ___cxa_throw,
      __resumeException: ___resumeException,
      __sys_access: ___sys_access,
      __sys_chmod: ___sys_chmod,
      __sys_fcntl64: ___sys_fcntl64,
      __sys_fstat64: ___sys_fstat64,
      __sys_getdents64: ___sys_getdents64,
      __sys_ioctl: ___sys_ioctl,
      __sys_mmap2: ___sys_mmap2,
      __sys_munmap: ___sys_munmap,
      __sys_open: ___sys_open,
      __sys_stat64: ___sys_stat64,
      _embind_register_bool: __embind_register_bool,
      _embind_register_emval: __embind_register_emval,
      _embind_register_float: __embind_register_float,
      _embind_register_function: __embind_register_function,
      _embind_register_integer: __embind_register_integer,
      _embind_register_memory_view: __embind_register_memory_view,
      _embind_register_std_string: __embind_register_std_string,
      _embind_register_std_wstring: __embind_register_std_wstring,
      _embind_register_void: __embind_register_void,
      abort: _abort,
      clock_gettime: _clock_gettime,
      eglBindAPI: _eglBindAPI,
      eglChooseConfig: _eglChooseConfig,
      eglCreateContext: _eglCreateContext,
      eglCreateWindowSurface: _eglCreateWindowSurface,
      eglDestroyContext: _eglDestroyContext,
      eglDestroySurface: _eglDestroySurface,
      eglGetCurrentContext: _eglGetCurrentContext,
      eglGetCurrentDisplay: _eglGetCurrentDisplay,
      eglGetCurrentSurface: _eglGetCurrentSurface,
      eglGetDisplay: _eglGetDisplay,
      eglGetError: _eglGetError,
      eglGetProcAddress: _eglGetProcAddress,
      eglInitialize: _eglInitialize,
      eglMakeCurrent: _eglMakeCurrent,
      eglQueryString: _eglQueryString,
      eglQuerySurface: _eglQuerySurface,
      eglSwapBuffers: _eglSwapBuffers,
      eglSwapInterval: _eglSwapInterval,
      eglTerminate: _eglTerminate,
      emscripten_asm_const_int: _emscripten_asm_const_int,
      emscripten_async_call: _emscripten_async_call,
      emscripten_async_wget: _emscripten_async_wget,
      emscripten_async_wget_data: _emscripten_async_wget_data,
      emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
      emscripten_get_callstack: _emscripten_get_callstack,
      emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
      emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
      emscripten_get_element_css_size: _emscripten_get_element_css_size,
      emscripten_get_preloaded_image_data: _emscripten_get_preloaded_image_data,
      emscripten_glActiveTexture: _emscripten_glActiveTexture,
      emscripten_glAttachShader: _emscripten_glAttachShader,
      emscripten_glBeginQuery: _emscripten_glBeginQuery,
      emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
      emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
      emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
      emscripten_glBindBuffer: _emscripten_glBindBuffer,
      emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
      emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
      emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
      emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
      emscripten_glBindSampler: _emscripten_glBindSampler,
      emscripten_glBindTexture: _emscripten_glBindTexture,
      emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
      emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
      emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
      emscripten_glBlendColor: _emscripten_glBlendColor,
      emscripten_glBlendEquation: _emscripten_glBlendEquation,
      emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
      emscripten_glBlendFunc: _emscripten_glBlendFunc,
      emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
      emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
      emscripten_glBufferData: _emscripten_glBufferData,
      emscripten_glBufferSubData: _emscripten_glBufferSubData,
      emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
      emscripten_glClear: _emscripten_glClear,
      emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
      emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
      emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
      emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
      emscripten_glClearColor: _emscripten_glClearColor,
      emscripten_glClearDepthf: _emscripten_glClearDepthf,
      emscripten_glClearStencil: _emscripten_glClearStencil,
      emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
      emscripten_glColorMask: _emscripten_glColorMask,
      emscripten_glCompileShader: _emscripten_glCompileShader,
      emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
      emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
      emscripten_glCompressedTexSubImage2D:
        _emscripten_glCompressedTexSubImage2D,
      emscripten_glCompressedTexSubImage3D:
        _emscripten_glCompressedTexSubImage3D,
      emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
      emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
      emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
      emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
      emscripten_glCreateProgram: _emscripten_glCreateProgram,
      emscripten_glCreateShader: _emscripten_glCreateShader,
      emscripten_glCullFace: _emscripten_glCullFace,
      emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
      emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
      emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
      emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
      emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
      emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
      emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
      emscripten_glDeleteShader: _emscripten_glDeleteShader,
      emscripten_glDeleteSync: _emscripten_glDeleteSync,
      emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
      emscripten_glDeleteTransformFeedbacks:
        _emscripten_glDeleteTransformFeedbacks,
      emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
      emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
      emscripten_glDepthFunc: _emscripten_glDepthFunc,
      emscripten_glDepthMask: _emscripten_glDepthMask,
      emscripten_glDepthRangef: _emscripten_glDepthRangef,
      emscripten_glDetachShader: _emscripten_glDetachShader,
      emscripten_glDisable: _emscripten_glDisable,
      emscripten_glDisableVertexAttribArray:
        _emscripten_glDisableVertexAttribArray,
      emscripten_glDrawArrays: _emscripten_glDrawArrays,
      emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
      emscripten_glDrawArraysInstancedANGLE:
        _emscripten_glDrawArraysInstancedANGLE,
      emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
      emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
      emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
      emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
      emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
      emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
      emscripten_glDrawElements: _emscripten_glDrawElements,
      emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
      emscripten_glDrawElementsInstancedANGLE:
        _emscripten_glDrawElementsInstancedANGLE,
      emscripten_glDrawElementsInstancedARB:
        _emscripten_glDrawElementsInstancedARB,
      emscripten_glDrawElementsInstancedEXT:
        _emscripten_glDrawElementsInstancedEXT,
      emscripten_glDrawElementsInstancedNV:
        _emscripten_glDrawElementsInstancedNV,
      emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
      emscripten_glEnable: _emscripten_glEnable,
      emscripten_glEnableVertexAttribArray:
        _emscripten_glEnableVertexAttribArray,
      emscripten_glEndQuery: _emscripten_glEndQuery,
      emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
      emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
      emscripten_glFenceSync: _emscripten_glFenceSync,
      emscripten_glFinish: _emscripten_glFinish,
      emscripten_glFlush: _emscripten_glFlush,
      emscripten_glFramebufferRenderbuffer:
        _emscripten_glFramebufferRenderbuffer,
      emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
      emscripten_glFramebufferTextureLayer:
        _emscripten_glFramebufferTextureLayer,
      emscripten_glFrontFace: _emscripten_glFrontFace,
      emscripten_glGenBuffers: _emscripten_glGenBuffers,
      emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
      emscripten_glGenQueries: _emscripten_glGenQueries,
      emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
      emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
      emscripten_glGenSamplers: _emscripten_glGenSamplers,
      emscripten_glGenTextures: _emscripten_glGenTextures,
      emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
      emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
      emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
      emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
      emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
      emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
      emscripten_glGetActiveUniformBlockName:
        _emscripten_glGetActiveUniformBlockName,
      emscripten_glGetActiveUniformBlockiv:
        _emscripten_glGetActiveUniformBlockiv,
      emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
      emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
      emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
      emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
      emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
      emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
      emscripten_glGetError: _emscripten_glGetError,
      emscripten_glGetFloatv: _emscripten_glGetFloatv,
      emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
      emscripten_glGetFramebufferAttachmentParameteriv:
        _emscripten_glGetFramebufferAttachmentParameteriv,
      emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
      emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
      emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
      emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
      emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
      emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
      emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
      emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
      emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
      emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
      emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
      emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
      emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
      emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
      emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
      emscripten_glGetRenderbufferParameteriv:
        _emscripten_glGetRenderbufferParameteriv,
      emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
      emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
      emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
      emscripten_glGetShaderPrecisionFormat:
        _emscripten_glGetShaderPrecisionFormat,
      emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
      emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
      emscripten_glGetString: _emscripten_glGetString,
      emscripten_glGetStringi: _emscripten_glGetStringi,
      emscripten_glGetSynciv: _emscripten_glGetSynciv,
      emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
      emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
      emscripten_glGetTransformFeedbackVarying:
        _emscripten_glGetTransformFeedbackVarying,
      emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
      emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
      emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
      emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
      emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
      emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
      emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
      emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
      emscripten_glGetVertexAttribPointerv:
        _emscripten_glGetVertexAttribPointerv,
      emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
      emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
      emscripten_glHint: _emscripten_glHint,
      emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
      emscripten_glInvalidateSubFramebuffer:
        _emscripten_glInvalidateSubFramebuffer,
      emscripten_glIsBuffer: _emscripten_glIsBuffer,
      emscripten_glIsEnabled: _emscripten_glIsEnabled,
      emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
      emscripten_glIsProgram: _emscripten_glIsProgram,
      emscripten_glIsQuery: _emscripten_glIsQuery,
      emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
      emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
      emscripten_glIsSampler: _emscripten_glIsSampler,
      emscripten_glIsShader: _emscripten_glIsShader,
      emscripten_glIsSync: _emscripten_glIsSync,
      emscripten_glIsTexture: _emscripten_glIsTexture,
      emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
      emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
      emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
      emscripten_glLineWidth: _emscripten_glLineWidth,
      emscripten_glLinkProgram: _emscripten_glLinkProgram,
      emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
      emscripten_glPixelStorei: _emscripten_glPixelStorei,
      emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
      emscripten_glProgramBinary: _emscripten_glProgramBinary,
      emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
      emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
      emscripten_glReadBuffer: _emscripten_glReadBuffer,
      emscripten_glReadPixels: _emscripten_glReadPixels,
      emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
      emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
      emscripten_glRenderbufferStorageMultisample:
        _emscripten_glRenderbufferStorageMultisample,
      emscripten_glResumeTransformFeedback:
        _emscripten_glResumeTransformFeedback,
      emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
      emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
      emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
      emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
      emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
      emscripten_glScissor: _emscripten_glScissor,
      emscripten_glShaderBinary: _emscripten_glShaderBinary,
      emscripten_glShaderSource: _emscripten_glShaderSource,
      emscripten_glStencilFunc: _emscripten_glStencilFunc,
      emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
      emscripten_glStencilMask: _emscripten_glStencilMask,
      emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
      emscripten_glStencilOp: _emscripten_glStencilOp,
      emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
      emscripten_glTexImage2D: _emscripten_glTexImage2D,
      emscripten_glTexImage3D: _emscripten_glTexImage3D,
      emscripten_glTexParameterf: _emscripten_glTexParameterf,
      emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
      emscripten_glTexParameteri: _emscripten_glTexParameteri,
      emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
      emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
      emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
      emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
      emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
      emscripten_glTransformFeedbackVaryings:
        _emscripten_glTransformFeedbackVaryings,
      emscripten_glUniform1f: _emscripten_glUniform1f,
      emscripten_glUniform1fv: _emscripten_glUniform1fv,
      emscripten_glUniform1i: _emscripten_glUniform1i,
      emscripten_glUniform1iv: _emscripten_glUniform1iv,
      emscripten_glUniform1ui: _emscripten_glUniform1ui,
      emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
      emscripten_glUniform2f: _emscripten_glUniform2f,
      emscripten_glUniform2fv: _emscripten_glUniform2fv,
      emscripten_glUniform2i: _emscripten_glUniform2i,
      emscripten_glUniform2iv: _emscripten_glUniform2iv,
      emscripten_glUniform2ui: _emscripten_glUniform2ui,
      emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
      emscripten_glUniform3f: _emscripten_glUniform3f,
      emscripten_glUniform3fv: _emscripten_glUniform3fv,
      emscripten_glUniform3i: _emscripten_glUniform3i,
      emscripten_glUniform3iv: _emscripten_glUniform3iv,
      emscripten_glUniform3ui: _emscripten_glUniform3ui,
      emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
      emscripten_glUniform4f: _emscripten_glUniform4f,
      emscripten_glUniform4fv: _emscripten_glUniform4fv,
      emscripten_glUniform4i: _emscripten_glUniform4i,
      emscripten_glUniform4iv: _emscripten_glUniform4iv,
      emscripten_glUniform4ui: _emscripten_glUniform4ui,
      emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
      emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
      emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
      emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
      emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
      emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
      emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
      emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
      emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
      emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
      emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
      emscripten_glUseProgram: _emscripten_glUseProgram,
      emscripten_glValidateProgram: _emscripten_glValidateProgram,
      emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
      emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
      emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
      emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
      emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
      emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
      emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
      emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
      emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
      emscripten_glVertexAttribDivisorANGLE:
        _emscripten_glVertexAttribDivisorANGLE,
      emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
      emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
      emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
      emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
      emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
      emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
      emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
      emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
      emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
      emscripten_glViewport: _emscripten_glViewport,
      emscripten_glWaitSync: _emscripten_glWaitSync,
      emscripten_longjmp: _emscripten_longjmp,
      emscripten_memcpy_big: _emscripten_memcpy_big,
      emscripten_resize_heap: _emscripten_resize_heap,
      emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
      emscripten_set_click_callback_on_thread:
        _emscripten_set_click_callback_on_thread,
      emscripten_set_dblclick_callback_on_thread:
        _emscripten_set_dblclick_callback_on_thread,
      emscripten_set_element_css_size: _emscripten_set_element_css_size,
      emscripten_set_keydown_callback_on_thread:
        _emscripten_set_keydown_callback_on_thread,
      emscripten_set_keyup_callback_on_thread:
        _emscripten_set_keyup_callback_on_thread,
      emscripten_set_main_loop: _emscripten_set_main_loop,
      emscripten_set_mousedown_callback_on_thread:
        _emscripten_set_mousedown_callback_on_thread,
      emscripten_set_mouseenter_callback_on_thread:
        _emscripten_set_mouseenter_callback_on_thread,
      emscripten_set_mouseleave_callback_on_thread:
        _emscripten_set_mouseleave_callback_on_thread,
      emscripten_set_mousemove_callback_on_thread:
        _emscripten_set_mousemove_callback_on_thread,
      emscripten_set_mouseup_callback_on_thread:
        _emscripten_set_mouseup_callback_on_thread,
      emscripten_set_resize_callback_on_thread:
        _emscripten_set_resize_callback_on_thread,
      emscripten_set_touchcancel_callback_on_thread:
        _emscripten_set_touchcancel_callback_on_thread,
      emscripten_set_touchend_callback_on_thread:
        _emscripten_set_touchend_callback_on_thread,
      emscripten_set_touchmove_callback_on_thread:
        _emscripten_set_touchmove_callback_on_thread,
      emscripten_set_touchstart_callback_on_thread:
        _emscripten_set_touchstart_callback_on_thread,
      emscripten_set_wheel_callback_on_thread:
        _emscripten_set_wheel_callback_on_thread,
      emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
      emscripten_webgl_get_context_attributes:
        _emscripten_webgl_get_context_attributes,
      emscripten_webgl_get_current_context:
        _emscripten_webgl_get_current_context,
      environ_get: _environ_get,
      environ_sizes_get: _environ_sizes_get,
      exit: _exit,
      fd_close: _fd_close,
      fd_fdstat_get: _fd_fdstat_get,
      fd_read: _fd_read,
      fd_seek: _fd_seek,
      fd_write: _fd_write,
      getTempRet0: _getTempRet0,
      gettimeofday: _gettimeofday,
      glActiveTexture: _glActiveTexture,
      glAttachShader: _glAttachShader,
      glBindAttribLocation: _glBindAttribLocation,
      glBindBuffer: _glBindBuffer,
      glBindFramebuffer: _glBindFramebuffer,
      glBindRenderbuffer: _glBindRenderbuffer,
      glBindTexture: _glBindTexture,
      glBlendEquation: _glBlendEquation,
      glBlendFunc: _glBlendFunc,
      glBlendFuncSeparate: _glBlendFuncSeparate,
      glBufferData: _glBufferData,
      glBufferSubData: _glBufferSubData,
      glCheckFramebufferStatus: _glCheckFramebufferStatus,
      glClear: _glClear,
      glClearColor: _glClearColor,
      glClearDepthf: _glClearDepthf,
      glColorMask: _glColorMask,
      glCompileShader: _glCompileShader,
      glCompressedTexImage2D: _glCompressedTexImage2D,
      glCopyTexImage2D: _glCopyTexImage2D,
      glCreateProgram: _glCreateProgram,
      glCreateShader: _glCreateShader,
      glCullFace: _glCullFace,
      glDeleteBuffers: _glDeleteBuffers,
      glDeleteFramebuffers: _glDeleteFramebuffers,
      glDeleteProgram: _glDeleteProgram,
      glDeleteRenderbuffers: _glDeleteRenderbuffers,
      glDeleteShader: _glDeleteShader,
      glDeleteTextures: _glDeleteTextures,
      glDepthFunc: _glDepthFunc,
      glDepthMask: _glDepthMask,
      glDisable: _glDisable,
      glDisableVertexAttribArray: _glDisableVertexAttribArray,
      glDrawArrays: _glDrawArrays,
      glDrawElements: _glDrawElements,
      glEnable: _glEnable,
      glEnableVertexAttribArray: _glEnableVertexAttribArray,
      glFinish: _glFinish,
      glFlush: _glFlush,
      glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
      glFramebufferTexture2D: _glFramebufferTexture2D,
      glFrontFace: _glFrontFace,
      glGenBuffers: _glGenBuffers,
      glGenFramebuffers: _glGenFramebuffers,
      glGenRenderbuffers: _glGenRenderbuffers,
      glGenTextures: _glGenTextures,
      glGenerateMipmap: _glGenerateMipmap,
      glGetAttribLocation: _glGetAttribLocation,
      glGetBooleanv: _glGetBooleanv,
      glGetError: _glGetError,
      glGetFloatv: _glGetFloatv,
      glGetFramebufferAttachmentParameteriv:
        _glGetFramebufferAttachmentParameteriv,
      glGetIntegerv: _glGetIntegerv,
      glGetProgramInfoLog: _glGetProgramInfoLog,
      glGetProgramiv: _glGetProgramiv,
      glGetShaderInfoLog: _glGetShaderInfoLog,
      glGetShaderPrecisionFormat: _glGetShaderPrecisionFormat,
      glGetShaderiv: _glGetShaderiv,
      glGetString: _glGetString,
      glGetUniformLocation: _glGetUniformLocation,
      glLineWidth: _glLineWidth,
      glLinkProgram: _glLinkProgram,
      glPixelStorei: _glPixelStorei,
      glPolygonOffset: _glPolygonOffset,
      glReadPixels: _glReadPixels,
      glRenderbufferStorage: _glRenderbufferStorage,
      glScissor: _glScissor,
      glShaderSource: _glShaderSource,
      glStencilFunc: _glStencilFunc,
      glStencilOp: _glStencilOp,
      glTexImage2D: _glTexImage2D,
      glTexParameteri: _glTexParameteri,
      glTexSubImage2D: _glTexSubImage2D,
      glUniform1f: _glUniform1f,
      glUniform1fv: _glUniform1fv,
      glUniform1i: _glUniform1i,
      glUniform1iv: _glUniform1iv,
      glUniform2fv: _glUniform2fv,
      glUniform2iv: _glUniform2iv,
      glUniform3fv: _glUniform3fv,
      glUniform3iv: _glUniform3iv,
      glUniform4fv: _glUniform4fv,
      glUniform4iv: _glUniform4iv,
      glUniformMatrix4fv: _glUniformMatrix4fv,
      glUseProgram: _glUseProgram,
      glVertexAttribPointer: _glVertexAttribPointer,
      glViewport: _glViewport,
      invoke_d: invoke_d,
      invoke_dd: invoke_dd,
      invoke_ddd: invoke_ddd,
      invoke_dddd: invoke_dddd,
      invoke_di: invoke_di,
      invoke_did: invoke_did,
      invoke_didd: invoke_didd,
      invoke_diddd: invoke_diddd,
      invoke_didi: invoke_didi,
      invoke_dii: invoke_dii,
      invoke_diid: invoke_diid,
      invoke_diidd: invoke_diidd,
      invoke_diiddd: invoke_diiddd,
      invoke_diiddi: invoke_diiddi,
      invoke_diii: invoke_diii,
      invoke_diiii: invoke_diiii,
      invoke_diiiii: invoke_diiiii,
      invoke_diiiiii: invoke_diiiiii,
      invoke_fiii: invoke_fiii,
      invoke_i: invoke_i,
      invoke_iddid: invoke_iddid,
      invoke_iddiiiiii: invoke_iddiiiiii,
      invoke_idi: invoke_idi,
      invoke_idiiiiii: invoke_idiiiiii,
      invoke_ii: invoke_ii,
      invoke_iid: invoke_iid,
      invoke_iidd: invoke_iidd,
      invoke_iiddd: invoke_iiddd,
      invoke_iidddd: invoke_iidddd,
      invoke_iiddddd: invoke_iiddddd,
      invoke_iiddddddddddddii: invoke_iiddddddddddddii,
      invoke_iiddddddiiii: invoke_iiddddddiiii,
      invoke_iiddddi: invoke_iiddddi,
      invoke_iiddddii: invoke_iiddddii,
      invoke_iidddi: invoke_iidddi,
      invoke_iidddii: invoke_iidddii,
      invoke_iiddi: invoke_iiddi,
      invoke_iiddid: invoke_iiddid,
      invoke_iiddii: invoke_iiddii,
      invoke_iiddiid: invoke_iiddiid,
      invoke_iiddiiiii: invoke_iiddiiiii,
      invoke_iidi: invoke_iidi,
      invoke_iidid: invoke_iidid,
      invoke_iidii: invoke_iidii,
      invoke_iidiiddii: invoke_iidiiddii,
      invoke_iidiii: invoke_iidiii,
      invoke_iidiiii: invoke_iidiiii,
      invoke_iif: invoke_iif,
      invoke_iii: invoke_iii,
      invoke_iiid: invoke_iiid,
      invoke_iiidd: invoke_iiidd,
      invoke_iiidddd: invoke_iiidddd,
      invoke_iiidddddd: invoke_iiidddddd,
      invoke_iiiddddi: invoke_iiiddddi,
      invoke_iiiddddidd: invoke_iiiddddidd,
      invoke_iiiddddii: invoke_iiiddddii,
      invoke_iiidddi: invoke_iiidddi,
      invoke_iiidddid: invoke_iiidddid,
      invoke_iiidddiid: invoke_iiidddiid,
      invoke_iiiddi: invoke_iiiddi,
      invoke_iiiddid: invoke_iiiddid,
      invoke_iiiddidd: invoke_iiiddidd,
      invoke_iiiddidddd: invoke_iiiddidddd,
      invoke_iiiddii: invoke_iiiddii,
      invoke_iiiddiiii: invoke_iiiddiiii,
      invoke_iiidi: invoke_iiidi,
      invoke_iiidid: invoke_iiidid,
      invoke_iiidii: invoke_iiidii,
      invoke_iiidiid: invoke_iiidiid,
      invoke_iiidiii: invoke_iiidiii,
      invoke_iiii: invoke_iiii,
      invoke_iiiid: invoke_iiiid,
      invoke_iiiidd: invoke_iiiidd,
      invoke_iiiiddd: invoke_iiiiddd,
      invoke_iiiidddddd: invoke_iiiidddddd,
      invoke_iiiidddi: invoke_iiiidddi,
      invoke_iiiiddi: invoke_iiiiddi,
      invoke_iiiiddii: invoke_iiiiddii,
      invoke_iiiiddiii: invoke_iiiiddiii,
      invoke_iiiiddiiii: invoke_iiiiddiiii,
      invoke_iiiidi: invoke_iiiidi,
      invoke_iiiidiii: invoke_iiiidiii,
      invoke_iiiif: invoke_iiiif,
      invoke_iiiii: invoke_iiiii,
      invoke_iiiiid: invoke_iiiiid,
      invoke_iiiiiddd: invoke_iiiiiddd,
      invoke_iiiiidddd: invoke_iiiiidddd,
      invoke_iiiiiddi: invoke_iiiiiddi,
      invoke_iiiiidi: invoke_iiiiidi,
      invoke_iiiiidiidd: invoke_iiiiidiidd,
      invoke_iiiiii: invoke_iiiiii,
      invoke_iiiiiid: invoke_iiiiiid,
      invoke_iiiiiidd: invoke_iiiiiidd,
      invoke_iiiiiidddd: invoke_iiiiiidddd,
      invoke_iiiiiiddiddiii: invoke_iiiiiiddiddiii,
      invoke_iiiiiidi: invoke_iiiiiidi,
      invoke_iiiiiidii: invoke_iiiiiidii,
      invoke_iiiiiii: invoke_iiiiiii,
      invoke_iiiiiiid: invoke_iiiiiiid,
      invoke_iiiiiiii: invoke_iiiiiiii,
      invoke_iiiiiiiiddi: invoke_iiiiiiiiddi,
      invoke_iiiiiiiiddiiii: invoke_iiiiiiiiddiiii,
      invoke_iiiiiiiiddiiiii: invoke_iiiiiiiiddiiiii,
      invoke_iiiiiiiifiii: invoke_iiiiiiiifiii,
      invoke_iiiiiiiii: invoke_iiiiiiiii,
      invoke_iiiiiiiiid: invoke_iiiiiiiiid,
      invoke_iiiiiiiiidi: invoke_iiiiiiiiidi,
      invoke_iiiiiiiiii: invoke_iiiiiiiiii,
      invoke_iiiiiiiiiiddidd: invoke_iiiiiiiiiiddidd,
      invoke_iiiiiiiiiii: invoke_iiiiiiiiiii,
      invoke_iiiiiiiiiiii: invoke_iiiiiiiiiiii,
      invoke_iiiiiiiiiiiid: invoke_iiiiiiiiiiiid,
      invoke_iiiiiiiiiiiiid: invoke_iiiiiiiiiiiiid,
      invoke_iiiiiiiiiiiiii: invoke_iiiiiiiiiiiiii,
      invoke_iiiiiiiiiiiiiii: invoke_iiiiiiiiiiiiiii,
      invoke_iiji: invoke_iiji,
      invoke_v: invoke_v,
      invoke_vddddiiiiiiiiiiii: invoke_vddddiiiiiiiiiiii,
      invoke_vdddii: invoke_vdddii,
      invoke_vdddiii: invoke_vdddiii,
      invoke_vdddiiii: invoke_vdddiiii,
      invoke_vddi: invoke_vddi,
      invoke_vddii: invoke_vddii,
      invoke_vddiii: invoke_vddiii,
      invoke_vddiiii: invoke_vddiiii,
      invoke_vddiiiiiii: invoke_vddiiiiiii,
      invoke_vddiiiiiiiiiiiiiii: invoke_vddiiiiiiiiiiiiiii,
      invoke_vddiiiiiiiiiiiiiiiii: invoke_vddiiiiiiiiiiiiiiiii,
      invoke_vddiiiiiiiiiiiiiiiiiiii: invoke_vddiiiiiiiiiiiiiiiiiiii,
      invoke_vddiiiiiiiiiiiiiiiiiiiiiiii: invoke_vddiiiiiiiiiiiiiiiiiiiiiiii,
      invoke_vdi: invoke_vdi,
      invoke_vdiddddi: invoke_vdiddddi,
      invoke_vdiddiiii: invoke_vdiddiiii,
      invoke_vdidii: invoke_vdidii,
      invoke_vdiii: invoke_vdiii,
      invoke_vdiiii: invoke_vdiiii,
      invoke_vdiiiii: invoke_vdiiiii,
      invoke_vdiiiiiiii: invoke_vdiiiiiiii,
      invoke_vdiiiiiiiii: invoke_vdiiiiiiiii,
      invoke_vdiiiiiiiiii: invoke_vdiiiiiiiiii,
      invoke_vdiiiiiiiiiii: invoke_vdiiiiiiiiiii,
      invoke_vf: invoke_vf,
      invoke_vffff: invoke_vffff,
      invoke_vi: invoke_vi,
      invoke_vid: invoke_vid,
      invoke_vidd: invoke_vidd,
      invoke_viddd: invoke_viddd,
      invoke_vidddd: invoke_vidddd,
      invoke_vidddddd: invoke_vidddddd,
      invoke_viddddddd: invoke_viddddddd,
      invoke_vidddddddddddd: invoke_vidddddddddddd,
      invoke_vidddddddii: invoke_vidddddddii,
      invoke_vidddddi: invoke_vidddddi,
      invoke_viddddii: invoke_viddddii,
      invoke_viddddiiii: invoke_viddddiiii,
      invoke_vidddi: invoke_vidddi,
      invoke_vidddidddddd: invoke_vidddidddddd,
      invoke_vidddii: invoke_vidddii,
      invoke_vidddiiidi: invoke_vidddiiidi,
      invoke_viddi: invoke_viddi,
      invoke_viddid: invoke_viddid,
      invoke_viddidd: invoke_viddidd,
      invoke_viddidddiiii: invoke_viddidddiiii,
      invoke_viddii: invoke_viddii,
      invoke_viddiii: invoke_viddiii,
      invoke_viddiiii: invoke_viddiiii,
      invoke_viddiiiiii: invoke_viddiiiiii,
      invoke_viddiiiiiiiiii: invoke_viddiiiiiiiiii,
      invoke_vidfdfii: invoke_vidfdfii,
      invoke_vidi: invoke_vidi,
      invoke_vidid: invoke_vidid,
      invoke_vididd: invoke_vididd,
      invoke_vidii: invoke_vidii,
      invoke_vidiiddddii: invoke_vidiiddddii,
      invoke_vidiidii: invoke_vidiidii,
      invoke_vidiii: invoke_vidiii,
      invoke_vidiiidi: invoke_vidiiidi,
      invoke_vidiiii: invoke_vidiiii,
      invoke_vidiiiiidd: invoke_vidiiiiidd,
      invoke_vif: invoke_vif,
      invoke_vii: invoke_vii,
      invoke_viid: invoke_viid,
      invoke_viidd: invoke_viidd,
      invoke_viiddd: invoke_viiddd,
      invoke_viidddd: invoke_viidddd,
      invoke_viidddddd: invoke_viidddddd,
      invoke_viidddddddiiii: invoke_viidddddddiiii,
      invoke_viiddddi: invoke_viiddddi,
      invoke_viiddddidd: invoke_viiddddidd,
      invoke_viidddi: invoke_viidddi,
      invoke_viidddidi: invoke_viidddidi,
      invoke_viidddii: invoke_viidddii,
      invoke_viiddi: invoke_viiddi,
      invoke_viiddidd: invoke_viiddidd,
      invoke_viiddii: invoke_viiddii,
      invoke_viiddiiii: invoke_viiddiiii,
      invoke_viiddiiiiii: invoke_viiddiiiiii,
      invoke_viiddiiiiiiii: invoke_viiddiiiiiiii,
      invoke_viidi: invoke_viidi,
      invoke_viidid: invoke_viidid,
      invoke_viididd: invoke_viididd,
      invoke_viidii: invoke_viidii,
      invoke_viidiii: invoke_viidiii,
      invoke_viidiiid: invoke_viidiiid,
      invoke_viidiiii: invoke_viidiiii,
      invoke_viidiiiii: invoke_viidiiiii,
      invoke_viif: invoke_viif,
      invoke_viifi: invoke_viifi,
      invoke_viifiii: invoke_viifiii,
      invoke_viii: invoke_viii,
      invoke_viiid: invoke_viiid,
      invoke_viiidd: invoke_viiidd,
      invoke_viiiddd: invoke_viiiddd,
      invoke_viiidddd: invoke_viiidddd,
      invoke_viiiddddi: invoke_viiiddddi,
      invoke_viiiddi: invoke_viiiddi,
      invoke_viiiddidi: invoke_viiiddidi,
      invoke_viiiddiiiiiiiiiiiiii: invoke_viiiddiiiiiiiiiiiiii,
      invoke_viiidi: invoke_viiidi,
      invoke_viiidid: invoke_viiidid,
      invoke_viiidiii: invoke_viiidiii,
      invoke_viiidiiiii: invoke_viiidiiiii,
      invoke_viiidiiiiii: invoke_viiidiiiiii,
      invoke_viiifiiiii: invoke_viiifiiiii,
      invoke_viiii: invoke_viiii,
      invoke_viiiid: invoke_viiiid,
      invoke_viiiidd: invoke_viiiidd,
      invoke_viiiidddd: invoke_viiiidddd,
      invoke_viiiiddddd: invoke_viiiiddddd,
      invoke_viiiidddddd: invoke_viiiidddddd,
      invoke_viiiidddi: invoke_viiiidddi,
      invoke_viiiiddiiid: invoke_viiiiddiiid,
      invoke_viiiii: invoke_viiiii,
      invoke_viiiiid: invoke_viiiiid,
      invoke_viiiiidd: invoke_viiiiidd,
      invoke_viiiiidddd: invoke_viiiiidddd,
      invoke_viiiiiddidd: invoke_viiiiiddidd,
      invoke_viiiiidi: invoke_viiiiidi,
      invoke_viiiiidii: invoke_viiiiidii,
      invoke_viiiiii: invoke_viiiiii,
      invoke_viiiiiid: invoke_viiiiiid,
      invoke_viiiiiiddi: invoke_viiiiiiddi,
      invoke_viiiiiiddiii: invoke_viiiiiiddiii,
      invoke_viiiiiiddiiii: invoke_viiiiiiddiiii,
      invoke_viiiiiidii: invoke_viiiiiidii,
      invoke_viiiiiii: invoke_viiiiiii,
      invoke_viiiiiiid: invoke_viiiiiiid,
      invoke_viiiiiiif: invoke_viiiiiiif,
      invoke_viiiiiiii: invoke_viiiiiiii,
      invoke_viiiiiiiid: invoke_viiiiiiiid,
      invoke_viiiiiiiidi: invoke_viiiiiiiidi,
      invoke_viiiiiiiii: invoke_viiiiiiiii,
      invoke_viiiiiiiiiddi: invoke_viiiiiiiiiddi,
      invoke_viiiiiiiiii: invoke_viiiiiiiiii,
      invoke_viiiiiiiiiid: invoke_viiiiiiiiiid,
      invoke_viiiiiiiiiidfdf: invoke_viiiiiiiiiidfdf,
      invoke_viiiiiiiiiii: invoke_viiiiiiiiiii,
      invoke_viiiiiiiiiiidd: invoke_viiiiiiiiiiidd,
      invoke_viiiiiiiiiiidi: invoke_viiiiiiiiiiidi,
      invoke_viiiiiiiiiiiidi: invoke_viiiiiiiiiiiidi,
      invoke_viiiiiiiiiiiidii: invoke_viiiiiiiiiiiidii,
      invoke_viiiiiiiiiiiii: invoke_viiiiiiiiiiiii,
      invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiii:
        invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiii,
      invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:
        invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,
      invoke_viiiij: invoke_viiiij,
      invoke_viiiiji: invoke_viiiiji,
      invoke_viijii: invoke_viijii,
      llvm_eh_typeid_for: _llvm_eh_typeid_for,
      occJSConsoleDebug: occJSConsoleDebug,
      occJSConsoleError: occJSConsoleError,
      occJSConsoleInfo: occJSConsoleInfo,
      occJSConsoleWarn: occJSConsoleWarn,
      pthread_create: _pthread_create,
      pthread_join: _pthread_join,
      setTempRet0: _setTempRet0,
      strftime_l: _strftime_l,
      sysconf: _sysconf,
      times: _times
    }
    var asm = createWasm()
    var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
        Module["asm"]["__wasm_call_ctors"]).apply(null, arguments)
    })
    var _memset = (Module["_memset"] = function () {
      return (_memset = Module["_memset"] = Module["asm"]["memset"]).apply(
        null,
        arguments
      )
    })
    var _memcpy = (Module["_memcpy"] = function () {
      return (_memcpy = Module["_memcpy"] = Module["asm"]["memcpy"]).apply(
        null,
        arguments
      )
    })
    var _malloc = (Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(
        null,
        arguments
      )
    })
    var _free = (Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["free"]).apply(
        null,
        arguments
      )
    })
    var ___errno_location = (Module["___errno_location"] = function () {
      return (___errno_location = Module["___errno_location"] =
        Module["asm"]["__errno_location"]).apply(null, arguments)
    })
    var ___original_main = (Module["___original_main"] = function () {
      return (___original_main = Module["___original_main"] =
        Module["asm"]["__original_main"]).apply(null, arguments)
    })
    var _main = (Module["_main"] = function () {
      return (_main = Module["_main"] = Module["asm"]["main"]).apply(
        null,
        arguments
      )
    })
    var _strstr = (Module["_strstr"] = function () {
      return (_strstr = Module["_strstr"] = Module["asm"]["strstr"]).apply(
        null,
        arguments
      )
    })
    var ___em_js__OSD_MemInfo_getModuleHeapLength = (Module[
      "___em_js__OSD_MemInfo_getModuleHeapLength"
    ] = function () {
      return (___em_js__OSD_MemInfo_getModuleHeapLength = Module[
        "___em_js__OSD_MemInfo_getModuleHeapLength"
      ] =
        Module["asm"]["__em_js__OSD_MemInfo_getModuleHeapLength"]).apply(
        null,
        arguments
      )
    })
    var _realloc = (Module["_realloc"] = function () {
      return (_realloc = Module["_realloc"] = Module["asm"]["realloc"]).apply(
        null,
        arguments
      )
    })
    var ___em_js__occJSConsoleDebug = (Module["___em_js__occJSConsoleDebug"] =
      function () {
        return (___em_js__occJSConsoleDebug = Module[
          "___em_js__occJSConsoleDebug"
        ] =
          Module["asm"]["__em_js__occJSConsoleDebug"]).apply(null, arguments)
      })
    var ___em_js__occJSConsoleInfo = (Module["___em_js__occJSConsoleInfo"] =
      function () {
        return (___em_js__occJSConsoleInfo = Module[
          "___em_js__occJSConsoleInfo"
        ] =
          Module["asm"]["__em_js__occJSConsoleInfo"]).apply(null, arguments)
      })
    var ___em_js__occJSConsoleWarn = (Module["___em_js__occJSConsoleWarn"] =
      function () {
        return (___em_js__occJSConsoleWarn = Module[
          "___em_js__occJSConsoleWarn"
        ] =
          Module["asm"]["__em_js__occJSConsoleWarn"]).apply(null, arguments)
      })
    var ___em_js__occJSConsoleError = (Module["___em_js__occJSConsoleError"] =
      function () {
        return (___em_js__occJSConsoleError = Module[
          "___em_js__occJSConsoleError"
        ] =
          Module["asm"]["__em_js__occJSConsoleError"]).apply(null, arguments)
      })
    var _testSetjmp = (Module["_testSetjmp"] = function () {
      return (_testSetjmp = Module["_testSetjmp"] =
        Module["asm"]["testSetjmp"]).apply(null, arguments)
    })
    var _saveSetjmp = (Module["_saveSetjmp"] = function () {
      return (_saveSetjmp = Module["_saveSetjmp"] =
        Module["asm"]["saveSetjmp"]).apply(null, arguments)
    })
    var ___getTypeName = (Module["___getTypeName"] = function () {
      return (___getTypeName = Module["___getTypeName"] =
        Module["asm"]["__getTypeName"]).apply(null, arguments)
    })
    var ___embind_register_native_and_builtin_types = (Module[
      "___embind_register_native_and_builtin_types"
    ] = function () {
      return (___embind_register_native_and_builtin_types = Module[
        "___embind_register_native_and_builtin_types"
      ] =
        Module["asm"]["__embind_register_native_and_builtin_types"]).apply(
        null,
        arguments
      )
    })
    var _emscripten_GetProcAddress = (Module["_emscripten_GetProcAddress"] =
      function () {
        return (_emscripten_GetProcAddress = Module[
          "_emscripten_GetProcAddress"
        ] =
          Module["asm"]["emscripten_GetProcAddress"]).apply(null, arguments)
      })
    var _htons = (Module["_htons"] = function () {
      return (_htons = Module["_htons"] = Module["asm"]["htons"]).apply(
        null,
        arguments
      )
    })
    var _ntohs = (Module["_ntohs"] = function () {
      return (_ntohs = Module["_ntohs"] = Module["asm"]["ntohs"]).apply(
        null,
        arguments
      )
    })
    var __get_tzname = (Module["__get_tzname"] = function () {
      return (__get_tzname = Module["__get_tzname"] =
        Module["asm"]["_get_tzname"]).apply(null, arguments)
    })
    var __get_daylight = (Module["__get_daylight"] = function () {
      return (__get_daylight = Module["__get_daylight"] =
        Module["asm"]["_get_daylight"]).apply(null, arguments)
    })
    var __get_timezone = (Module["__get_timezone"] = function () {
      return (__get_timezone = Module["__get_timezone"] =
        Module["asm"]["_get_timezone"]).apply(null, arguments)
    })
    var _emscripten_main_thread_process_queued_calls = (Module[
      "_emscripten_main_thread_process_queued_calls"
    ] = function () {
      return (_emscripten_main_thread_process_queued_calls = Module[
        "_emscripten_main_thread_process_queued_calls"
      ] =
        Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(
        null,
        arguments
      )
    })
    var stackSave = (Module["stackSave"] = function () {
      return (stackSave = Module["stackSave"] =
        Module["asm"]["stackSave"]).apply(null, arguments)
    })
    var stackRestore = (Module["stackRestore"] = function () {
      return (stackRestore = Module["stackRestore"] =
        Module["asm"]["stackRestore"]).apply(null, arguments)
    })
    var stackAlloc = (Module["stackAlloc"] = function () {
      return (stackAlloc = Module["stackAlloc"] =
        Module["asm"]["stackAlloc"]).apply(null, arguments)
    })
    var _setThrew = (Module["_setThrew"] = function () {
      return (_setThrew = Module["_setThrew"] =
        Module["asm"]["setThrew"]).apply(null, arguments)
    })
    var __ZSt18uncaught_exceptionv = (Module["__ZSt18uncaught_exceptionv"] =
      function () {
        return (__ZSt18uncaught_exceptionv = Module[
          "__ZSt18uncaught_exceptionv"
        ] =
          Module["asm"]["_ZSt18uncaught_exceptionv"]).apply(null, arguments)
      })
    var _memalign = (Module["_memalign"] = function () {
      return (_memalign = Module["_memalign"] =
        Module["asm"]["memalign"]).apply(null, arguments)
    })
    var dynCall_viijii = (Module["dynCall_viijii"] = function () {
      return (dynCall_viijii = Module["dynCall_viijii"] =
        Module["asm"]["dynCall_viijii"]).apply(null, arguments)
    })
    var dynCall_iiji = (Module["dynCall_iiji"] = function () {
      return (dynCall_iiji = Module["dynCall_iiji"] =
        Module["asm"]["dynCall_iiji"]).apply(null, arguments)
    })
    var dynCall_viiiiji = (Module["dynCall_viiiiji"] = function () {
      return (dynCall_viiiiji = Module["dynCall_viiiiji"] =
        Module["asm"]["dynCall_viiiiji"]).apply(null, arguments)
    })
    var dynCall_viiiij = (Module["dynCall_viiiij"] = function () {
      return (dynCall_viiiij = Module["dynCall_viiiij"] =
        Module["asm"]["dynCall_viiiij"]).apply(null, arguments)
    })
    var dynCall_jiji = (Module["dynCall_jiji"] = function () {
      return (dynCall_jiji = Module["dynCall_jiji"] =
        Module["asm"]["dynCall_jiji"]).apply(null, arguments)
    })
    var dynCall_iiiiij = (Module["dynCall_iiiiij"] = function () {
      return (dynCall_iiiiij = Module["dynCall_iiiiij"] =
        Module["asm"]["dynCall_iiiiij"]).apply(null, arguments)
    })
    var dynCall_iiiiijj = (Module["dynCall_iiiiijj"] = function () {
      return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] =
        Module["asm"]["dynCall_iiiiijj"]).apply(null, arguments)
    })
    var dynCall_iiiiiijj = (Module["dynCall_iiiiiijj"] = function () {
      return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] =
        Module["asm"]["dynCall_iiiiiijj"]).apply(null, arguments)
    })
    function invoke_iii(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vi(index, a1) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_i(index) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)()
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_v(index) {
      var sp = stackSave()
      try {
        wasmTable.get(index)()
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiid(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vid(index, a1, a2) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iid(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_didi(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_di(index, a1) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viid(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diiii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddddddddddd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidi(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddi(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_dd(index, a1) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iif(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiidii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiidii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiidd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_d(index) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)()
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_dii(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_ddd(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiiidi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiiiid(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiidi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidi(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiid(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_did(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddddii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddddiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiiiiiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19,
      a20,
      a21,
      a22
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19,
          a20,
          a21,
          a22
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiiiiiiiiiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19,
      a20,
      a21,
      a22,
      a23,
      a24,
      a25,
      a26
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19,
          a20,
          a21,
          a22,
          a23,
          a24,
          a25,
          a26
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiiidii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiddiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddddiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddddd(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidddddd(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddi(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiddiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iddiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddddddiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddiid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidiiid(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiddiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddi(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiid(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_dddd(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiiddddii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiddii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diidd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddddii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiddddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiidd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiidi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddiiidi(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidiiddii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdddiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddddii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdddiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddidddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidd(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiddd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddddd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidi(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_didd(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diddd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiddd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiddiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diii(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiii(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiddd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidi(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddddidd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddidd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidddiid(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiid(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vididd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiidddddd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdddii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiidddddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiddddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidddd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidid(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddidd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddd(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiidd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidd(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiidiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidid(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddddddii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidid(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidddid(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiidi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddddddd(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddddd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiidi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiidi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiiiiidd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiiid(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiddiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiddiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiid(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiidi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiidii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiifiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viifiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viifi(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vif(index, a1, a2) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_fiii(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vf(index, a1) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vffff(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiif(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiifiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidddi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidddd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viif(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diiddi(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiddddi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiid(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiid(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddidd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiidd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiddiddiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiidiidd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiid(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diid(index, a1, a2, a3) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diiddd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddidddiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiddidd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiidd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiidddd(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidddd(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiidddd(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiidddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viididd(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidddidddddd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiddddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iidddii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vddiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_idi(index, a1, a2) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddddddiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iddid(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiidiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiddddidd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viidddidi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiidiid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiiidi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdidii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viddiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidiidii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiidddi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiddi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiidddi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiiiddidd(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiddi(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdi(index, a1, a2) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiid(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vdiddiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiiiiddi(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_diiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiddiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_idiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiidfdf(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_vidfdfii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19,
      a20,
      a21,
      a22,
      a23,
      a24,
      a25,
      a26,
      a27,
      a28
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19,
          a20,
          a21,
          a22,
          a23,
          a24,
          a25,
          a26,
          a27,
          a28
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15,
      a16,
      a17,
      a18,
      a19,
      a20,
      a21,
      a22,
      a23,
      a24,
      a25,
      a26,
      a27,
      a28,
      a29,
      a30,
      a31,
      a32,
      a33,
      a34,
      a35,
      a36,
      a37,
      a38,
      a39,
      a40
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15,
          a16,
          a17,
          a18,
          a19,
          a20,
          a21,
          a22,
          a23,
          a24,
          a25,
          a26,
          a27,
          a28,
          a29,
          a30,
          a31,
          a32,
          a33,
          a34,
          a35,
          a36,
          a37,
          a38,
          a39,
          a40
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiddddddddddddii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a12,
      a13,
      a14,
      a15
    ) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11,
          a12,
          a13,
          a14,
          a15
        )
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiidddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiddiiid(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10
    ) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiddidi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave()
      try {
        wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiiiiidi(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiiji(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave()
      try {
        dynCall_viiiiji(index, a1, a2, a3, a4, a5, a6, a7)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_iiji(index, a1, a2, a3, a4) {
      var sp = stackSave()
      try {
        return dynCall_iiji(index, a1, a2, a3, a4)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viijii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        dynCall_viijii(index, a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    function invoke_viiiij(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave()
      try {
        dynCall_viiiij(index, a1, a2, a3, a4, a5, a6)
      } catch (e) {
        stackRestore(sp)
        if (e !== e + 0 && e !== "longjmp") throw e
        _setThrew(1, 0)
      }
    }
    var calledRun
    function ExitStatus(status) {
      this.name = "ExitStatus"
      this.message = "Program terminated with exit(" + status + ")"
      this.status = status
    }
    var calledMain = false
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run()
      if (!calledRun) dependenciesFulfilled = runCaller
    }
    function callMain(args) {
      var entryFunction = Module["_main"]
      var argc = 0
      var argv = 0
      try {
        var ret = entryFunction(argc, argv)
        exit(ret, true)
      } catch (e) {
        if (e instanceof ExitStatus) {
          return
        } else if (e == "unwind") {
          noExitRuntime = true
          return
        } else {
          var toLog = e
          if (e && typeof e === "object" && e.stack) {
            toLog = [e, e.stack]
          }
          err("exception thrown: " + toLog)
          quit_(1, e)
        }
      } finally {
        calledMain = true
      }
    }
    function run(args) {
      args = args || arguments_
      if (runDependencies > 0) {
        return
      }
      preRun()
      if (runDependencies > 0) return
      function doRun() {
        if (calledRun) return
        calledRun = true
        Module["calledRun"] = true
        if (ABORT) return
        initRuntime()
        preMain()
        readyPromiseResolve(Module)
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]()
        if (shouldRunNow) callMain(args)
        postRun()
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...")
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("")
          }, 1)
          doRun()
        }, 1)
      } else {
        doRun()
      }
    }
    Module["run"] = run
    function exit(status, implicit) {
      if (implicit && noExitRuntime && status === 0) {
        return
      }
      if (noExitRuntime) {
      } else {
        EXITSTATUS = status
        exitRuntime()
        if (Module["onExit"]) Module["onExit"](status)
        ABORT = true
      }
      quit_(status, new ExitStatus(status))
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]]
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
      }
    }
    var shouldRunNow = true
    if (Module["noInitialRun"]) shouldRunNow = false
    noExitRuntime = true
    run()

    return createOccViewerModule.ready
  }
}
// if (typeof exports === "object" && typeof module === "object")
//   module.exports = createOccViewerModule;
// else if (typeof define === "function" && define["amd"])
//   define([], function () {
//     return createOccViewerModule;
//   });
// else if (typeof exports === "object")
//   exports["createOccViewerModule"] = createOccViewerModule;
