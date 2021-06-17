(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.inkjs = {}));
}(this, (function (exports) { 'use strict';

  class Path {
      constructor() {
          this._components = [];
          this._componentsString = null;
          this._isRelative = false;
          if (typeof arguments[0] == "string") {
              let componentsString = arguments[0];
              this.componentsString = componentsString;
          }
          else if (arguments[0] instanceof Path.Component &&
              arguments[1] instanceof Path) {
              let head = arguments[0];
              let tail = arguments[1];
              this._components.push(head);
              this._components = this._components.concat(tail._components);
          }
          else if (arguments[0] instanceof Array) {
              let head = arguments[0];
              let relative = !!arguments[1];
              this._components = this._components.concat(head);
              this._isRelative = relative;
          }
      }
      get isRelative() {
          return this._isRelative;
      }
      get componentCount() {
          return this._components.length;
      }
      get head() {
          if (this._components.length > 0) {
              return this._components[0];
          }
          else {
              return null;
          }
      }
      get tail() {
          if (this._components.length >= 2) {
              // careful, the original code uses length-1 here. This is because the second argument of
              // List.GetRange is a number of elements to extract, wherease Array.slice uses an index
              let tailComps = this._components.slice(1, this._components.length);
              return new Path(tailComps);
          }
          else {
              return Path.self;
          }
      }
      get length() {
          return this._components.length;
      }
      get lastComponent() {
          let lastComponentIdx = this._components.length - 1;
          if (lastComponentIdx >= 0) {
              return this._components[lastComponentIdx];
          }
          else {
              return null;
          }
      }
      get containsNamedComponent() {
          for (let i = 0, l = this._components.length; i < l; i++) {
              if (!this._components[i].isIndex) {
                  return true;
              }
          }
          return false;
      }
      static get self() {
          let path = new Path();
          path._isRelative = true;
          return path;
      }
      GetComponent(index) {
          return this._components[index];
      }
      PathByAppendingPath(pathToAppend) {
          let p = new Path();
          let upwardMoves = 0;
          for (let i = 0; i < pathToAppend._components.length; ++i) {
              if (pathToAppend._components[i].isParent) {
                  upwardMoves++;
              }
              else {
                  break;
              }
          }
          for (let i = 0; i < this._components.length - upwardMoves; ++i) {
              p._components.push(this._components[i]);
          }
          for (let i = upwardMoves; i < pathToAppend._components.length; ++i) {
              p._components.push(pathToAppend._components[i]);
          }
          return p;
      }
      get componentsString() {
          if (this._componentsString == null) {
              this._componentsString = this._components.join(".");
              if (this.isRelative)
                  this._componentsString = "." + this._componentsString;
          }
          return this._componentsString;
      }
      set componentsString(value) {
          this._components.length = 0;
          this._componentsString = value;
          if (this._componentsString == null || this._componentsString == "")
              return;
          if (this._componentsString[0] == ".") {
              this._isRelative = true;
              this._componentsString = this._componentsString.substring(1);
          }
          let componentStrings = this._componentsString.split(".");
          for (let str of componentStrings) {
              // we need to distinguish between named components that start with a number, eg "42somewhere", and indexed components
              // the normal parseInt won't do for the detection because it's too relaxed.
              // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
              if (/^(\-|\+)?([0-9]+|Infinity)$/.test(str)) {
                  this._components.push(new Path.Component(parseInt(str)));
              }
              else {
                  this._components.push(new Path.Component(str));
              }
          }
      }
      toString() {
          return this.componentsString;
      }
      Equals(otherPath) {
          if (otherPath == null)
              return false;
          if (otherPath._components.length != this._components.length)
              return false;
          if (otherPath.isRelative != this.isRelative)
              return false;
          // the original code uses SequenceEqual here, so we need to iterate over the components manually.
          for (let i = 0, l = otherPath._components.length; i < l; i++) {
              // it's not quite clear whether this test should use Equals or a simple == operator,
              // see https://github.com/y-lohse/inkjs/issues/22
              if (!otherPath._components[i].Equals(this._components[i]))
                  return false;
          }
          return true;
      }
      PathByAppendingComponent(c) {
          let p = new Path();
          p._components.push(...this._components);
          p._components.push(c);
          return p;
      }
  }
  Path.parentId = "^";
  (function (Path) {
      class Component {
          constructor(indexOrName) {
              this.index = -1;
              this.name = null;
              if (typeof indexOrName == "string") {
                  this.name = indexOrName;
              }
              else {
                  this.index = indexOrName;
              }
          }
          get isIndex() {
              return this.index >= 0;
          }
          get isParent() {
              return this.name == Path.parentId;
          }
          static ToParent() {
              return new Component(Path.parentId);
          }
          toString() {
              if (this.isIndex) {
                  return this.index.toString();
              }
              else {
                  return this.name;
              }
          }
          Equals(otherComp) {
              if (otherComp != null && otherComp.isIndex == this.isIndex) {
                  if (this.isIndex) {
                      return this.index == otherComp.index;
                  }
                  else {
                      return this.name == otherComp.name;
                  }
              }
              return false;
          }
      }
      Path.Component = Component;
  })(Path || (Path = {}));

  var Debug;
  (function (Debug) {
      function AssertType(variable, type, message) {
          Assert(variable instanceof type, message);
      }
      Debug.AssertType = AssertType;
      function Assert(condition, message) {
          if (!condition) {
              if (typeof message !== "undefined") {
                  console.warn(message);
              }
              if (console.trace) {
                  console.trace();
              }
              throw new Error("");
          }
      }
      Debug.Assert = Assert;
  })(Debug || (Debug = {}));

  function asOrNull(obj, type) {
      if (obj instanceof type) {
          return unsafeTypeAssertion(obj);
      }
      else {
          return null;
      }
  }
  function asOrThrows(obj, type) {
      if (obj instanceof type) {
          return unsafeTypeAssertion(obj);
      }
      else {
          throw new Error(`${obj} is not of type ${type}`);
      }
  }
  function asBooleanOrThrows(obj) {
      if (typeof obj === "boolean") {
          return obj;
      }
      else {
          throw new Error(`${obj} is not a boolean`);
      }
  }
  // So here, in the reference implementation, contentObj is casted to an INamedContent
  // but here we use js-style duck typing: if it implements the same props as the interface,
  // we treat it as valid.
  function asINamedContentOrNull(obj) {
      if (obj.hasValidName && obj.name) {
          return obj;
      }
      return null;
  }
  function nullIfUndefined(obj) {
      if (typeof obj === "undefined") {
          return null;
      }
      return obj;
  }
  function isEquatable(type) {
      return typeof type === "object" && typeof type.Equals === "function";
  }
  function unsafeTypeAssertion(obj, type) {
      return obj;
  }

  /**
   * In the original C# code, a SystemException would be thrown when passing
   * null to methods expected a valid instance. Javascript has no such
   * concept, but TypeScript will not allow `null` to be passed to methods
   * explicitely requiring a valid type.
   *
   * Whenever TypeScript complain about the possibility of a `null` value,
   * check the offending value and it it's null, throw this exception using
   * `throwNullException(name: string)`.
   */
  class NullException extends Error {
  }
  /**
   * Throw a NullException.
   *
   * @param name a short description of the offending value (often its name within the code).
   */
  function throwNullException(name) {
      throw new NullException(`${name} is null or undefined`);
  }

  class InkObject {
      constructor() {
          this.parent = null;
          this._debugMetadata = null;
          this._path = null;
      }
      get debugMetadata() {
          if (this._debugMetadata === null) {
              if (this.parent) {
                  return this.parent.debugMetadata;
              }
          }
          return this._debugMetadata;
      }
      set debugMetadata(value) {
          this._debugMetadata = value;
      }
      get ownDebugMetadata() {
          return this._debugMetadata;
      }
      DebugLineNumberOfPath(path) {
          if (path === null)
              return null;
          // Try to get a line number from debug metadata
          let root = this.rootContentContainer;
          if (root) {
              let targetContent = root.ContentAtPath(path).obj;
              if (targetContent) {
                  let dm = targetContent.debugMetadata;
                  if (dm !== null) {
                      return dm.startLineNumber;
                  }
              }
          }
          return null;
      }
      get path() {
          if (this._path == null) {
              if (this.parent == null) {
                  this._path = new Path();
              }
              else {
                  let comps = [];
                  let child = this;
                  let container = asOrNull(child.parent, Container);
                  while (container !== null) {
                      let namedChild = asINamedContentOrNull(child);
                      if (namedChild != null && namedChild.hasValidName) {
                          comps.unshift(new Path.Component(namedChild.name));
                      }
                      else {
                          comps.unshift(new Path.Component(container.content.indexOf(child)));
                      }
                      child = container;
                      container = asOrNull(container.parent, Container);
                  }
                  this._path = new Path(comps);
              }
          }
          return this._path;
      }
      ResolvePath(path) {
          if (path === null)
              return throwNullException("path");
          if (path.isRelative) {
              let nearestContainer = asOrNull(this, Container);
              if (nearestContainer === null) {
                  Debug.Assert(this.parent !== null, "Can't resolve relative path because we don't have a parent");
                  nearestContainer = asOrNull(this.parent, Container);
                  Debug.Assert(nearestContainer !== null, "Expected parent to be a container");
                  Debug.Assert(path.GetComponent(0).isParent);
                  path = path.tail;
              }
              if (nearestContainer === null) {
                  return throwNullException("nearestContainer");
              }
              return nearestContainer.ContentAtPath(path);
          }
          else {
              let contentContainer = this.rootContentContainer;
              if (contentContainer === null) {
                  return throwNullException("contentContainer");
              }
              return contentContainer.ContentAtPath(path);
          }
      }
      ConvertPathToRelative(globalPath) {
          let ownPath = this.path;
          let minPathLength = Math.min(globalPath.length, ownPath.length);
          let lastSharedPathCompIndex = -1;
          for (let i = 0; i < minPathLength; ++i) {
              let ownComp = ownPath.GetComponent(i);
              let otherComp = globalPath.GetComponent(i);
              if (ownComp.Equals(otherComp)) {
                  lastSharedPathCompIndex = i;
              }
              else {
                  break;
              }
          }
          // No shared path components, so just use global path
          if (lastSharedPathCompIndex == -1)
              return globalPath;
          let numUpwardsMoves = ownPath.componentCount - 1 - lastSharedPathCompIndex;
          let newPathComps = [];
          for (let up = 0; up < numUpwardsMoves; ++up)
              newPathComps.push(Path.Component.ToParent());
          for (let down = lastSharedPathCompIndex + 1; down < globalPath.componentCount; ++down)
              newPathComps.push(globalPath.GetComponent(down));
          let relativePath = new Path(newPathComps, true);
          return relativePath;
      }
      CompactPathString(otherPath) {
          let globalPathStr = null;
          let relativePathStr = null;
          if (otherPath.isRelative) {
              relativePathStr = otherPath.componentsString;
              globalPathStr = this.path.PathByAppendingPath(otherPath).componentsString;
          }
          else {
              let relativePath = this.ConvertPathToRelative(otherPath);
              relativePathStr = relativePath.componentsString;
              globalPathStr = otherPath.componentsString;
          }
          if (relativePathStr.length < globalPathStr.length)
              return relativePathStr;
          else
              return globalPathStr;
      }
      get rootContentContainer() {
          let ancestor = this;
          while (ancestor.parent) {
              ancestor = ancestor.parent;
          }
          return asOrNull(ancestor, Container);
      }
      Copy() {
          throw Error("Not Implemented: Doesn't support copying");
      }
      // SetChild works slightly diferently in the js implementation.
      // Since we can't pass an objets property by reference, we instead pass
      // the object and the property string.
      // TODO: This method can probably be rewritten with type-safety in mind.
      SetChild(obj, prop, value) {
          if (obj[prop])
              obj[prop] = null;
          obj[prop] = value;
          if (obj[prop])
              obj[prop].parent = this;
      }
  }

  class StringBuilder {
      constructor(str) {
          str = typeof str !== "undefined" ? str.toString() : "";
          this.string = str;
      }
      get Length() {
          return this.string.length;
      }
      Append(str) {
          if (str !== null) {
              this.string += str;
          }
      }
      AppendLine(str) {
          if (typeof str !== "undefined")
              this.Append(str);
          this.string += "\n";
      }
      AppendFormat(format, ...args) {
          // taken from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
          this.string += format.replace(/{(\d+)}/g, (match, num) => typeof args[num] != "undefined" ? args[num] : match);
      }
      toString() {
          return this.string;
      }
  }

  class InkListItem {
      constructor() {
          // InkListItem is a struct
          this.originName = null;
          this.itemName = null;
          if (typeof arguments[1] !== "undefined") {
              let originName = arguments[0];
              let itemName = arguments[1];
              this.originName = originName;
              this.itemName = itemName;
          }
          else if (arguments[0]) {
              let fullName = arguments[0];
              let nameParts = fullName.toString().split(".");
              this.originName = nameParts[0];
              this.itemName = nameParts[1];
          }
      }
      static get Null() {
          return new InkListItem(null, null);
      }
      get isNull() {
          return this.originName == null && this.itemName == null;
      }
      get fullName() {
          return ((this.originName !== null ? this.originName : "?") + "." + this.itemName);
      }
      toString() {
          return this.fullName;
      }
      Equals(obj) {
          if (obj instanceof InkListItem) {
              let otherItem = obj;
              return (otherItem.itemName == this.itemName &&
                  otherItem.originName == this.originName);
          }
          return false;
      }
      // These methods did not exist in the original C# code. Their purpose is to
      // make `InkListItem` mimics the value-type semantics of the original
      // struct. Please refer to the end of this file, for a more in-depth
      // explanation.
      /**
       * Returns a shallow clone of the current instance.
       */
      copy() {
          return new InkListItem(this.originName, this.itemName);
      }
      /**
       * Returns a `SerializedInkListItem` representing the current
       * instance. The result is intended to be used as a key inside a Map.
       */
      serialized() {
          // We are simply using a JSON representation as a value-typed key.
          return JSON.stringify({
              originName: this.originName,
              itemName: this.itemName,
          });
      }
      /**
       * Reconstructs a `InkListItem` from the given SerializedInkListItem.
       */
      static fromSerializedKey(key) {
          let obj = JSON.parse(key);
          if (!InkListItem.isLikeInkListItem(obj))
              return InkListItem.Null;
          let inkListItem = obj;
          return new InkListItem(inkListItem.originName, inkListItem.itemName);
      }
      /**
       * Determines whether the given item is sufficiently `InkListItem`-like
       * to be used as a template when reconstructing the InkListItem.
       */
      static isLikeInkListItem(item) {
          if (typeof item !== "object")
              return false;
          if (!item.hasOwnProperty("originName") || !item.hasOwnProperty("itemName"))
              return false;
          if (typeof item.originName !== "string" && typeof item.originName !== null)
              return false;
          if (typeof item.itemName !== "string" && typeof item.itemName !== null)
              return false;
          return true;
      }
  }
  class InkList extends Map {
      constructor() {
          // Trying to be smart here, this emulates the constructor inheritance found
          // in the original code, but only if otherList is an InkList. IIFE FTW.
          super((() => {
              if (arguments[0] instanceof InkList) {
                  return arguments[0];
              }
              else {
                  return [];
              }
          })());
          this.origins = null;
          this._originNames = [];
          if (arguments[0] instanceof InkList) {
              let otherList = arguments[0];
              this._originNames = otherList.originNames;
              if (otherList.origins !== null) {
                  this.origins = otherList.origins.slice();
              }
          }
          else if (typeof arguments[0] === "string") {
              let singleOriginListName = arguments[0];
              let originStory = arguments[1];
              this.SetInitialOriginName(singleOriginListName);
              if (originStory.listDefinitions === null) {
                  return throwNullException("originStory.listDefinitions");
              }
              let def = originStory.listDefinitions.TryListGetDefinition(singleOriginListName, null);
              if (def.exists) {
                  // Throwing now, because if the value is `null` it will
                  // eventually throw down the line.
                  if (def.result === null) {
                      return throwNullException("def.result");
                  }
                  this.origins = [def.result];
              }
              else {
                  throw new Error("InkList origin could not be found in story when constructing new list: " +
                      singleOriginListName);
              }
          }
          else if (typeof arguments[0] === "object" &&
              arguments[0].hasOwnProperty("Key") &&
              arguments[0].hasOwnProperty("Value")) {
              let singleElement = arguments[0];
              this.Add(singleElement.Key, singleElement.Value);
          }
      }
      static FromString(myListItem, originStory) {
          var _a;
          let listValue = (_a = originStory.listDefinitions) === null || _a === void 0 ? void 0 : _a.FindSingleItemListWithName(myListItem);
          if (listValue) {
              if (listValue.value === null) {
                  return throwNullException("listValue.value");
              }
              return new InkList(listValue.value);
          }
          else {
              throw new Error("Could not find the InkListItem from the string '" +
                  myListItem +
                  "' to create an InkList because it doesn't exist in the original list definition in ink.");
          }
      }
      AddItem(itemOrItemName) {
          if (itemOrItemName instanceof InkListItem) {
              let item = itemOrItemName;
              if (item.originName == null) {
                  this.AddItem(item.itemName);
                  return;
              }
              if (this.origins === null)
                  return throwNullException("this.origins");
              for (let origin of this.origins) {
                  if (origin.name == item.originName) {
                      let intVal = origin.TryGetValueForItem(item, 0);
                      if (intVal.exists) {
                          this.Add(item, intVal.result);
                          return;
                      }
                      else {
                          throw new Error("Could not add the item " +
                              item +
                              " to this list because it doesn't exist in the original list definition in ink.");
                      }
                  }
              }
              throw new Error("Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.");
          }
          else {
              let itemName = itemOrItemName;
              let foundListDef = null;
              if (this.origins === null)
                  return throwNullException("this.origins");
              for (let origin of this.origins) {
                  if (itemName === null)
                      return throwNullException("itemName");
                  if (origin.ContainsItemWithName(itemName)) {
                      if (foundListDef != null) {
                          throw new Error("Could not add the item " +
                              itemName +
                              " to this list because it could come from either " +
                              origin.name +
                              " or " +
                              foundListDef.name);
                      }
                      else {
                          foundListDef = origin;
                      }
                  }
              }
              if (foundListDef == null)
                  throw new Error("Could not add the item " +
                      itemName +
                      " to this list because it isn't known to any list definitions previously associated with this list.");
              let item = new InkListItem(foundListDef.name, itemName);
              let itemVal = foundListDef.ValueForItem(item);
              this.Add(item, itemVal);
          }
      }
      ContainsItemNamed(itemName) {
          for (let [key] of this) {
              let item = InkListItem.fromSerializedKey(key);
              if (item.itemName == itemName)
                  return true;
          }
          return false;
      }
      ContainsKey(key) {
          return this.has(key.serialized());
      }
      Add(key, value) {
          let serializedKey = key.serialized();
          if (this.has(serializedKey)) {
              // Throw an exception to match the C# behavior.
              throw new Error(`The Map already contains an entry for ${key}`);
          }
          this.set(serializedKey, value);
      }
      Remove(key) {
          return this.delete(key.serialized());
      }
      get Count() {
          return this.size;
      }
      get originOfMaxItem() {
          if (this.origins == null)
              return null;
          let maxOriginName = this.maxItem.Key.originName;
          let result = null;
          this.origins.every((origin) => {
              if (origin.name == maxOriginName) {
                  result = origin;
                  return false;
              }
              else
                  return true;
          });
          return result;
      }
      get originNames() {
          if (this.Count > 0) {
              if (this._originNames == null && this.Count > 0)
                  this._originNames = [];
              else {
                  if (!this._originNames)
                      this._originNames = [];
                  this._originNames.length = 0;
              }
              for (let [key] of this) {
                  let item = InkListItem.fromSerializedKey(key);
                  if (item.originName === null)
                      return throwNullException("item.originName");
                  this._originNames.push(item.originName);
              }
          }
          return this._originNames;
      }
      SetInitialOriginName(initialOriginName) {
          this._originNames = [initialOriginName];
      }
      SetInitialOriginNames(initialOriginNames) {
          if (initialOriginNames == null)
              this._originNames = null;
          else
              this._originNames = initialOriginNames.slice(); // store a copy
      }
      get maxItem() {
          let max = {
              Key: InkListItem.Null,
              Value: 0,
          };
          for (let [key, value] of this) {
              let item = InkListItem.fromSerializedKey(key);
              if (max.Key.isNull || value > max.Value)
                  max = { Key: item, Value: value };
          }
          return max;
      }
      get minItem() {
          let min = {
              Key: InkListItem.Null,
              Value: 0,
          };
          for (let [key, value] of this) {
              let item = InkListItem.fromSerializedKey(key);
              if (min.Key.isNull || value < min.Value) {
                  min = { Key: item, Value: value };
              }
          }
          return min;
      }
      get inverse() {
          let list = new InkList();
          if (this.origins != null) {
              for (let origin of this.origins) {
                  for (let [key, value] of origin.items) {
                      let item = InkListItem.fromSerializedKey(key);
                      if (!this.ContainsKey(item))
                          list.Add(item, value);
                  }
              }
          }
          return list;
      }
      get all() {
          let list = new InkList();
          if (this.origins != null) {
              for (let origin of this.origins) {
                  for (let [key, value] of origin.items) {
                      let item = InkListItem.fromSerializedKey(key);
                      list.set(item.serialized(), value);
                  }
              }
          }
          return list;
      }
      Union(otherList) {
          let union = new InkList(this);
          for (let [key, value] of otherList) {
              union.set(key, value);
          }
          return union;
      }
      Intersect(otherList) {
          let intersection = new InkList();
          for (let [key, value] of this) {
              if (otherList.has(key))
                  intersection.set(key, value);
          }
          return intersection;
      }
      Without(listToRemove) {
          let result = new InkList(this);
          for (let [key] of listToRemove) {
              result.delete(key);
          }
          return result;
      }
      Contains(otherList) {
          for (let [key] of otherList) {
              if (!this.has(key))
                  return false;
          }
          return true;
      }
      GreaterThan(otherList) {
          if (this.Count == 0)
              return false;
          if (otherList.Count == 0)
              return true;
          return this.minItem.Value > otherList.maxItem.Value;
      }
      GreaterThanOrEquals(otherList) {
          if (this.Count == 0)
              return false;
          if (otherList.Count == 0)
              return true;
          return (this.minItem.Value >= otherList.minItem.Value &&
              this.maxItem.Value >= otherList.maxItem.Value);
      }
      LessThan(otherList) {
          if (otherList.Count == 0)
              return false;
          if (this.Count == 0)
              return true;
          return this.maxItem.Value < otherList.minItem.Value;
      }
      LessThanOrEquals(otherList) {
          if (otherList.Count == 0)
              return false;
          if (this.Count == 0)
              return true;
          return (this.maxItem.Value <= otherList.maxItem.Value &&
              this.minItem.Value <= otherList.minItem.Value);
      }
      MaxAsList() {
          if (this.Count > 0)
              return new InkList(this.maxItem);
          else
              return new InkList();
      }
      MinAsList() {
          if (this.Count > 0)
              return new InkList(this.minItem);
          else
              return new InkList();
      }
      ListWithSubRange(minBound, maxBound) {
          if (this.Count == 0)
              return new InkList();
          let ordered = this.orderedItems;
          let minValue = 0;
          let maxValue = Number.MAX_SAFE_INTEGER;
          if (Number.isInteger(minBound)) {
              minValue = minBound;
          }
          else {
              if (minBound instanceof InkList && minBound.Count > 0)
                  minValue = minBound.minItem.Value;
          }
          if (Number.isInteger(maxBound)) {
              maxValue = maxBound;
          }
          else {
              if (minBound instanceof InkList && minBound.Count > 0)
                  maxValue = maxBound.maxItem.Value;
          }
          let subList = new InkList();
          subList.SetInitialOriginNames(this.originNames);
          for (let item of ordered) {
              if (item.Value >= minValue && item.Value <= maxValue) {
                  subList.Add(item.Key, item.Value);
              }
          }
          return subList;
      }
      Equals(otherInkList) {
          if (otherInkList instanceof InkList === false)
              return false;
          if (otherInkList.Count != this.Count)
              return false;
          for (let [key] of this) {
              if (!otherInkList.has(key))
                  return false;
          }
          return true;
      }
      // GetHashCode not implemented
      get orderedItems() {
          // List<KeyValuePair<InkListItem, int>>
          let ordered = new Array();
          for (let [key, value] of this) {
              let item = InkListItem.fromSerializedKey(key);
              ordered.push({ Key: item, Value: value });
          }
          ordered.sort((x, y) => {
              if (x.Key.originName === null) {
                  return throwNullException("x.Key.originName");
              }
              if (y.Key.originName === null) {
                  return throwNullException("y.Key.originName");
              }
              if (x.Value == y.Value) {
                  return x.Key.originName.localeCompare(y.Key.originName);
              }
              else {
                  // TODO: refactor this bit into a numberCompareTo method?
                  if (x.Value < y.Value)
                      return -1;
                  return x.Value > y.Value ? 1 : 0;
              }
          });
          return ordered;
      }
      toString() {
          let ordered = this.orderedItems;
          let sb = new StringBuilder();
          for (let i = 0; i < ordered.length; i++) {
              if (i > 0)
                  sb.Append(", ");
              let item = ordered[i].Key;
              if (item.itemName === null)
                  return throwNullException("item.itemName");
              sb.Append(item.itemName);
          }
          return sb.toString();
      }
      // casting a InkList to a Number, for somereason, actually gives a number.
      // This messes up the type detection when creating a Value from a InkList.
      // Returning NaN here prevents that.
      valueOf() {
          return NaN;
      }
  }

  class StoryException extends Error {
      constructor(message) {
          super(message);
          this.useEndLineNumber = false;
          this.message = message;
          this.name = "StoryException";
      }
  }

  function tryGetValueFromMap(map, key, 
  /* out */ value) {
      if (map === null) {
          return { result: value, exists: false };
      }
      let val = map.get(key);
      if (typeof val === "undefined") {
          return { result: value, exists: false };
      }
      else {
          return { result: val, exists: true };
      }
  }
  function tryParseInt(value, 
  /* out */ defaultValue = 0) {
      let val = parseInt(value);
      if (!Number.isNaN(val)) {
          return { result: val, exists: true };
      }
      else {
          return { result: defaultValue, exists: false };
      }
  }
  function tryParseFloat(value, 
  /* out */ defaultValue = 0) {
      let val = parseFloat(value);
      if (!Number.isNaN(val)) {
          return { result: val, exists: true };
      }
      else {
          return { result: defaultValue, exists: false };
      }
  }

  class AbstractValue extends InkObject {
      static Create(val, preferredNumberType) {
          // This code doesn't exist in upstream and is simply here to enforce
          // the creation of the proper number value.
          // If `preferredNumberType` is not provided or if value doesn't match
          // `preferredNumberType`, this conditional does nothing.
          if (preferredNumberType) {
              if (preferredNumberType === ValueType.Int &&
                  Number.isInteger(Number(val))) {
                  return new IntValue(Number(val));
              }
              else if (preferredNumberType === ValueType.Float &&
                  !isNaN(val)) {
                  return new FloatValue(Number(val));
              }
          }
          if (typeof val === "boolean") {
              return new BoolValue(Boolean(val));
          }
          // https://github.com/y-lohse/inkjs/issues/425
          // Changed condition sequence, because Number('') is
          // parsed to 0, which made setting string to empty
          // impossible
          if (typeof val === "string") {
              return new StringValue(String(val));
          }
          else if (Number.isInteger(Number(val))) {
              return new IntValue(Number(val));
          }
          else if (!isNaN(val)) {
              return new FloatValue(Number(val));
          }
          else if (val instanceof Path) {
              return new DivertTargetValue(asOrThrows(val, Path));
          }
          else if (val instanceof InkList) {
              return new ListValue(asOrThrows(val, InkList));
          }
          return null;
      }
      Copy() {
          return asOrThrows(AbstractValue.Create(this), InkObject);
      }
      BadCastException(targetType) {
          return new StoryException("Can't cast " +
              this.valueObject +
              " from " +
              this.valueType +
              " to " +
              targetType);
      }
  }
  class Value extends AbstractValue {
      constructor(val) {
          super();
          this.value = val;
      }
      get valueObject() {
          return this.value;
      }
      toString() {
          if (this.value === null)
              return throwNullException("Value.value");
          return this.value.toString();
      }
  }
  class BoolValue extends Value {
      constructor(val) {
          super(val || false);
      }
      get isTruthy() {
          return Boolean(this.value);
      }
      get valueType() {
          return ValueType.Bool;
      }
      Cast(newType) {
          if (this.value === null)
              return throwNullException("Value.value");
          if (newType == this.valueType) {
              return this;
          }
          if (newType == ValueType.Int) {
              return new IntValue(this.value ? 1 : 0);
          }
          if (newType == ValueType.Float) {
              return new FloatValue(this.value ? 1.0 : 0.0);
          }
          if (newType == ValueType.String) {
              return new StringValue(this.value ? "true" : "false");
          }
          throw this.BadCastException(newType);
      }
      toString() {
          return this.value ? "true" : "false";
      }
  }
  class IntValue extends Value {
      constructor(val) {
          super(val || 0);
      }
      get isTruthy() {
          return this.value != 0;
      }
      get valueType() {
          return ValueType.Int;
      }
      Cast(newType) {
          if (this.value === null)
              return throwNullException("Value.value");
          if (newType == this.valueType) {
              return this;
          }
          if (newType == ValueType.Bool) {
              return new BoolValue(this.value === 0 ? false : true);
          }
          if (newType == ValueType.Float) {
              return new FloatValue(this.value);
          }
          if (newType == ValueType.String) {
              return new StringValue("" + this.value);
          }
          throw this.BadCastException(newType);
      }
  }
  class FloatValue extends Value {
      constructor(val) {
          super(val || 0.0);
      }
      get isTruthy() {
          return this.value != 0.0;
      }
      get valueType() {
          return ValueType.Float;
      }
      Cast(newType) {
          if (this.value === null)
              return throwNullException("Value.value");
          if (newType == this.valueType) {
              return this;
          }
          if (newType == ValueType.Bool) {
              return new BoolValue(this.value === 0.0 ? false : true);
          }
          if (newType == ValueType.Int) {
              return new IntValue(this.value);
          }
          if (newType == ValueType.String) {
              return new StringValue("" + this.value);
          }
          throw this.BadCastException(newType);
      }
  }
  class StringValue extends Value {
      constructor(val) {
          super(val || "");
          this._isNewline = this.value == "\n";
          this._isInlineWhitespace = true;
          if (this.value === null)
              return throwNullException("Value.value");
          if (this.value.length > 0) {
              this.value.split("").every((c) => {
                  if (c != " " && c != "\t") {
                      this._isInlineWhitespace = false;
                      return false;
                  }
                  return true;
              });
          }
      }
      get valueType() {
          return ValueType.String;
      }
      get isTruthy() {
          if (this.value === null)
              return throwNullException("Value.value");
          return this.value.length > 0;
      }
      get isNewline() {
          return this._isNewline;
      }
      get isInlineWhitespace() {
          return this._isInlineWhitespace;
      }
      get isNonWhitespace() {
          return !this.isNewline && !this.isInlineWhitespace;
      }
      Cast(newType) {
          if (newType == this.valueType) {
              return this;
          }
          if (newType == ValueType.Int) {
              let parsedInt = tryParseInt(this.value);
              if (parsedInt.exists) {
                  return new IntValue(parsedInt.result);
              }
              else {
                  throw this.BadCastException(newType);
              }
          }
          if (newType == ValueType.Float) {
              let parsedFloat = tryParseFloat(this.value);
              if (parsedFloat.exists) {
                  return new FloatValue(parsedFloat.result);
              }
              else {
                  throw this.BadCastException(newType);
              }
          }
          throw this.BadCastException(newType);
      }
  }
  class DivertTargetValue extends Value {
      constructor(targetPath) {
          super(targetPath);
      }
      get valueType() {
          return ValueType.DivertTarget;
      }
      get targetPath() {
          if (this.value === null)
              return throwNullException("Value.value");
          return this.value;
      }
      set targetPath(value) {
          this.value = value;
      }
      get isTruthy() {
          throw new Error("Shouldn't be checking the truthiness of a divert target");
      }
      Cast(newType) {
          if (newType == this.valueType)
              return this;
          throw this.BadCastException(newType);
      }
      toString() {
          return "DivertTargetValue(" + this.targetPath + ")";
      }
  }
  class VariablePointerValue extends Value {
      constructor(variableName, contextIndex = -1) {
          super(variableName);
          this._contextIndex = contextIndex;
      }
      get contextIndex() {
          return this._contextIndex;
      }
      set contextIndex(value) {
          this._contextIndex = value;
      }
      get variableName() {
          if (this.value === null)
              return throwNullException("Value.value");
          return this.value;
      }
      set variableName(value) {
          this.value = value;
      }
      get valueType() {
          return ValueType.VariablePointer;
      }
      get isTruthy() {
          throw new Error("Shouldn't be checking the truthiness of a variable pointer");
      }
      Cast(newType) {
          if (newType == this.valueType)
              return this;
          throw this.BadCastException(newType);
      }
      toString() {
          return "VariablePointerValue(" + this.variableName + ")";
      }
      Copy() {
          return new VariablePointerValue(this.variableName, this.contextIndex);
      }
  }
  class ListValue extends Value {
      get isTruthy() {
          if (this.value === null) {
              return throwNullException("this.value");
          }
          return this.value.Count > 0;
      }
      get valueType() {
          return ValueType.List;
      }
      Cast(newType) {
          if (this.value === null)
              return throwNullException("Value.value");
          if (newType == ValueType.Int) {
              let max = this.value.maxItem;
              if (max.Key.isNull)
                  return new IntValue(0);
              else
                  return new IntValue(max.Value);
          }
          else if (newType == ValueType.Float) {
              let max = this.value.maxItem;
              if (max.Key.isNull)
                  return new FloatValue(0.0);
              else
                  return new FloatValue(max.Value);
          }
          else if (newType == ValueType.String) {
              let max = this.value.maxItem;
              if (max.Key.isNull)
                  return new StringValue("");
              else {
                  return new StringValue(max.Key.toString());
              }
          }
          if (newType == this.valueType)
              return this;
          throw this.BadCastException(newType);
      }
      constructor(listOrSingleItem, singleValue) {
          super(null);
          if (!listOrSingleItem && !singleValue) {
              this.value = new InkList();
          }
          else if (listOrSingleItem instanceof InkList) {
              this.value = new InkList(listOrSingleItem);
          }
          else if (listOrSingleItem instanceof InkListItem &&
              typeof singleValue === "number") {
              this.value = new InkList({
                  Key: listOrSingleItem,
                  Value: singleValue,
              });
          }
      }
      static RetainListOriginsForAssignment(oldValue, newValue) {
          let oldList = asOrNull(oldValue, ListValue);
          let newList = asOrNull(newValue, ListValue);
          if (newList && newList.value === null)
              return throwNullException("newList.value");
          if (oldList && oldList.value === null)
              return throwNullException("oldList.value");
          // When assigning the empty list, try to retain any initial origin names
          if (oldList && newList && newList.value.Count == 0)
              newList.value.SetInitialOriginNames(oldList.value.originNames);
      }
  }
  var ValueType;
  (function (ValueType) {
      ValueType[ValueType["Bool"] = -1] = "Bool";
      ValueType[ValueType["Int"] = 0] = "Int";
      ValueType[ValueType["Float"] = 1] = "Float";
      ValueType[ValueType["List"] = 2] = "List";
      ValueType[ValueType["String"] = 3] = "String";
      ValueType[ValueType["DivertTarget"] = 4] = "DivertTarget";
      ValueType[ValueType["VariablePointer"] = 5] = "VariablePointer";
  })(ValueType || (ValueType = {}));

  class SearchResult {
      constructor() {
          this.obj = null;
          this.approximate = false;
      }
      get correctObj() {
          return this.approximate ? null : this.obj;
      }
      get container() {
          return this.obj instanceof Container ? this.obj : null;
      }
      copy() {
          let searchResult = new SearchResult();
          searchResult.obj = this.obj;
          searchResult.approximate = this.approximate;
          return searchResult;
      }
  }

  class Container extends InkObject {
      constructor() {
          super(...arguments);
          this.name = "";
          this._content = [];
          this.namedContent = new Map();
          this.visitsShouldBeCounted = false;
          this.turnIndexShouldBeCounted = false;
          this.countingAtStartOnly = false;
          this._pathToFirstLeafContent = null;
      }
      get hasValidName() {
          return this.name != null && this.name.length > 0;
      }
      get content() {
          return this._content;
      }
      set content(value) {
          this.AddContent(value);
      }
      get namedOnlyContent() {
          let namedOnlyContentDict = new Map();
          for (let [key, value] of this.namedContent) {
              let inkObject = asOrThrows(value, InkObject);
              namedOnlyContentDict.set(key, inkObject);
          }
          for (let c of this.content) {
              let named = asINamedContentOrNull(c);
              if (named != null && named.hasValidName) {
                  namedOnlyContentDict.delete(named.name);
              }
          }
          if (namedOnlyContentDict.size == 0)
              namedOnlyContentDict = null;
          return namedOnlyContentDict;
      }
      set namedOnlyContent(value) {
          let existingNamedOnly = this.namedOnlyContent;
          if (existingNamedOnly != null) {
              for (let [key] of existingNamedOnly) {
                  this.namedContent.delete(key);
              }
          }
          if (value == null)
              return;
          for (let [, val] of value) {
              let named = asINamedContentOrNull(val);
              if (named != null)
                  this.AddToNamedContentOnly(named);
          }
      }
      get countFlags() {
          let flags = 0;
          if (this.visitsShouldBeCounted)
              flags |= Container.CountFlags.Visits;
          if (this.turnIndexShouldBeCounted)
              flags |= Container.CountFlags.Turns;
          if (this.countingAtStartOnly)
              flags |= Container.CountFlags.CountStartOnly;
          if (flags == Container.CountFlags.CountStartOnly) {
              flags = 0;
          }
          return flags;
      }
      set countFlags(value) {
          let flag = value;
          if ((flag & Container.CountFlags.Visits) > 0)
              this.visitsShouldBeCounted = true;
          if ((flag & Container.CountFlags.Turns) > 0)
              this.turnIndexShouldBeCounted = true;
          if ((flag & Container.CountFlags.CountStartOnly) > 0)
              this.countingAtStartOnly = true;
      }
      get pathToFirstLeafContent() {
          if (this._pathToFirstLeafContent == null)
              this._pathToFirstLeafContent = this.path.PathByAppendingPath(this.internalPathToFirstLeafContent);
          return this._pathToFirstLeafContent;
      }
      get internalPathToFirstLeafContent() {
          let components = [];
          let container = this;
          while (container instanceof Container) {
              if (container.content.length > 0) {
                  components.push(new Path.Component(0));
                  container = container.content[0];
              }
          }
          return new Path(components);
      }
      AddContent(contentObjOrList) {
          if (contentObjOrList instanceof Array) {
              let contentList = contentObjOrList;
              for (let c of contentList) {
                  this.AddContent(c);
              }
          }
          else {
              let contentObj = contentObjOrList;
              this._content.push(contentObj);
              if (contentObj.parent) {
                  throw new Error("content is already in " + contentObj.parent);
              }
              contentObj.parent = this;
              this.TryAddNamedContent(contentObj);
          }
      }
      TryAddNamedContent(contentObj) {
          let namedContentObj = asINamedContentOrNull(contentObj);
          if (namedContentObj != null && namedContentObj.hasValidName) {
              this.AddToNamedContentOnly(namedContentObj);
          }
      }
      AddToNamedContentOnly(namedContentObj) {
          Debug.AssertType(namedContentObj, InkObject, "Can only add Runtime.Objects to a Runtime.Container");
          let runtimeObj = asOrThrows(namedContentObj, InkObject);
          runtimeObj.parent = this;
          this.namedContent.set(namedContentObj.name, namedContentObj);
      }
      ContentAtPath(path, partialPathStart = 0, partialPathLength = -1) {
          if (partialPathLength == -1)
              partialPathLength = path.length;
          let result = new SearchResult();
          result.approximate = false;
          let currentContainer = this;
          let currentObj = this;
          for (let i = partialPathStart; i < partialPathLength; ++i) {
              let comp = path.GetComponent(i);
              if (currentContainer == null) {
                  result.approximate = true;
                  break;
              }
              let foundObj = currentContainer.ContentWithPathComponent(comp);
              if (foundObj == null) {
                  result.approximate = true;
                  break;
              }
              currentObj = foundObj;
              currentContainer = asOrNull(foundObj, Container);
          }
          result.obj = currentObj;
          return result;
      }
      InsertContent(contentObj, index) {
          this.content[index] = contentObj;
          if (contentObj.parent) {
              throw new Error("content is already in " + contentObj.parent);
          }
          contentObj.parent = this;
          this.TryAddNamedContent(contentObj);
      }
      AddContentsOfContainer(otherContainer) {
          this.content = this.content.concat(otherContainer.content);
          for (let obj of otherContainer.content) {
              obj.parent = this;
              this.TryAddNamedContent(obj);
          }
      }
      ContentWithPathComponent(component) {
          if (component.isIndex) {
              if (component.index >= 0 && component.index < this.content.length) {
                  return this.content[component.index];
              }
              else {
                  return null;
              }
          }
          else if (component.isParent) {
              return this.parent;
          }
          else {
              if (component.name === null) {
                  return throwNullException("component.name");
              }
              let foundContent = tryGetValueFromMap(this.namedContent, component.name, null);
              if (foundContent.exists) {
                  return asOrThrows(foundContent.result, InkObject);
              }
              else {
                  return null;
              }
          }
      }
      BuildStringOfHierarchy() {
          let sb;
          if (arguments.length == 0) {
              sb = new StringBuilder();
              this.BuildStringOfHierarchy(sb, 0, null);
              return sb.toString();
          }
          sb = arguments[0];
          let indentation = arguments[1];
          let pointedObj = arguments[2];
          function appendIndentation() {
              const spacesPerIndent = 4; // Truly const in the original code
              for (let i = 0; i < spacesPerIndent * indentation; ++i) {
                  sb.Append(" ");
              }
          }
          appendIndentation();
          sb.Append("[");
          if (this.hasValidName) {
              sb.AppendFormat(" ({0})", this.name);
          }
          if (this == pointedObj) {
              sb.Append("  <---");
          }
          sb.AppendLine();
          indentation++;
          for (let i = 0; i < this.content.length; ++i) {
              let obj = this.content[i];
              if (obj instanceof Container) {
                  let container = obj;
                  container.BuildStringOfHierarchy(sb, indentation, pointedObj);
              }
              else {
                  appendIndentation();
                  if (obj instanceof StringValue) {
                      sb.Append('"');
                      sb.Append(obj.toString().replace("\n", "\\n"));
                      sb.Append('"');
                  }
                  else {
                      sb.Append(obj.toString());
                  }
              }
              if (i != this.content.length - 1) {
                  sb.Append(",");
              }
              if (!(obj instanceof Container) && obj == pointedObj) {
                  sb.Append("  <---");
              }
              sb.AppendLine();
          }
          let onlyNamed = new Map();
          for (let [key, value] of this.namedContent) {
              if (this.content.indexOf(asOrThrows(value, InkObject)) >= 0) {
                  continue;
              }
              else {
                  onlyNamed.set(key, value);
              }
          }
          if (onlyNamed.size > 0) {
              appendIndentation();
              sb.AppendLine("-- named: --");
              for (let [, value] of onlyNamed) {
                  Debug.AssertType(value, Container, "Can only print out named Containers");
                  let container = value;
                  container.BuildStringOfHierarchy(sb, indentation, pointedObj);
                  sb.AppendLine();
              }
          }
          indentation--;
          appendIndentation();
          sb.Append("]");
      }
  }
  (function (Container) {
      (function (CountFlags) {
          CountFlags[CountFlags["Visits"] = 1] = "Visits";
          CountFlags[CountFlags["Turns"] = 2] = "Turns";
          CountFlags[CountFlags["CountStartOnly"] = 4] = "CountStartOnly";
      })(Container.CountFlags || (Container.CountFlags = {}));
  })(Container || (Container = {}));

  class Glue extends InkObject {
      toString() {
          return "Glue";
      }
  }

  class ControlCommand extends InkObject {
      constructor(commandType = ControlCommand.CommandType.NotSet) {
          super();
          this._commandType = commandType;
      }
      get commandType() {
          return this._commandType;
      }
      Copy() {
          return new ControlCommand(this.commandType);
      }
      static EvalStart() {
          return new ControlCommand(ControlCommand.CommandType.EvalStart);
      }
      static EvalOutput() {
          return new ControlCommand(ControlCommand.CommandType.EvalOutput);
      }
      static EvalEnd() {
          return new ControlCommand(ControlCommand.CommandType.EvalEnd);
      }
      static Duplicate() {
          return new ControlCommand(ControlCommand.CommandType.Duplicate);
      }
      static PopEvaluatedValue() {
          return new ControlCommand(ControlCommand.CommandType.PopEvaluatedValue);
      }
      static PopFunction() {
          return new ControlCommand(ControlCommand.CommandType.PopFunction);
      }
      static PopTunnel() {
          return new ControlCommand(ControlCommand.CommandType.PopTunnel);
      }
      static BeginString() {
          return new ControlCommand(ControlCommand.CommandType.BeginString);
      }
      static EndString() {
          return new ControlCommand(ControlCommand.CommandType.EndString);
      }
      static NoOp() {
          return new ControlCommand(ControlCommand.CommandType.NoOp);
      }
      static ChoiceCount() {
          return new ControlCommand(ControlCommand.CommandType.ChoiceCount);
      }
      static Turns() {
          return new ControlCommand(ControlCommand.CommandType.Turns);
      }
      static TurnsSince() {
          return new ControlCommand(ControlCommand.CommandType.TurnsSince);
      }
      static ReadCount() {
          return new ControlCommand(ControlCommand.CommandType.ReadCount);
      }
      static Random() {
          return new ControlCommand(ControlCommand.CommandType.Random);
      }
      static SeedRandom() {
          return new ControlCommand(ControlCommand.CommandType.SeedRandom);
      }
      static VisitIndex() {
          return new ControlCommand(ControlCommand.CommandType.VisitIndex);
      }
      static SequenceShuffleIndex() {
          return new ControlCommand(ControlCommand.CommandType.SequenceShuffleIndex);
      }
      static StartThread() {
          return new ControlCommand(ControlCommand.CommandType.StartThread);
      }
      static Done() {
          return new ControlCommand(ControlCommand.CommandType.Done);
      }
      static End() {
          return new ControlCommand(ControlCommand.CommandType.End);
      }
      static ListFromInt() {
          return new ControlCommand(ControlCommand.CommandType.ListFromInt);
      }
      static ListRange() {
          return new ControlCommand(ControlCommand.CommandType.ListRange);
      }
      static ListRandom() {
          return new ControlCommand(ControlCommand.CommandType.ListRandom);
      }
      toString() {
          return this.commandType.toString();
      }
  }
  (function (ControlCommand) {
      (function (CommandType) {
          CommandType[CommandType["NotSet"] = -1] = "NotSet";
          CommandType[CommandType["EvalStart"] = 0] = "EvalStart";
          CommandType[CommandType["EvalOutput"] = 1] = "EvalOutput";
          CommandType[CommandType["EvalEnd"] = 2] = "EvalEnd";
          CommandType[CommandType["Duplicate"] = 3] = "Duplicate";
          CommandType[CommandType["PopEvaluatedValue"] = 4] = "PopEvaluatedValue";
          CommandType[CommandType["PopFunction"] = 5] = "PopFunction";
          CommandType[CommandType["PopTunnel"] = 6] = "PopTunnel";
          CommandType[CommandType["BeginString"] = 7] = "BeginString";
          CommandType[CommandType["EndString"] = 8] = "EndString";
          CommandType[CommandType["NoOp"] = 9] = "NoOp";
          CommandType[CommandType["ChoiceCount"] = 10] = "ChoiceCount";
          CommandType[CommandType["Turns"] = 11] = "Turns";
          CommandType[CommandType["TurnsSince"] = 12] = "TurnsSince";
          CommandType[CommandType["Random"] = 13] = "Random";
          CommandType[CommandType["SeedRandom"] = 14] = "SeedRandom";
          CommandType[CommandType["VisitIndex"] = 15] = "VisitIndex";
          CommandType[CommandType["SequenceShuffleIndex"] = 16] = "SequenceShuffleIndex";
          CommandType[CommandType["StartThread"] = 17] = "StartThread";
          CommandType[CommandType["Done"] = 18] = "Done";
          CommandType[CommandType["End"] = 19] = "End";
          CommandType[CommandType["ListFromInt"] = 20] = "ListFromInt";
          CommandType[CommandType["ListRange"] = 21] = "ListRange";
          CommandType[CommandType["ListRandom"] = 22] = "ListRandom";
          CommandType[CommandType["ReadCount"] = 23] = "ReadCount";
          CommandType[CommandType["TOTAL_VALUES"] = 24] = "TOTAL_VALUES";
      })(ControlCommand.CommandType || (ControlCommand.CommandType = {}));
  })(ControlCommand || (ControlCommand = {}));

  var PushPopType;
  (function (PushPopType) {
      PushPopType[PushPopType["Tunnel"] = 0] = "Tunnel";
      PushPopType[PushPopType["Function"] = 1] = "Function";
      PushPopType[PushPopType["FunctionEvaluationFromGame"] = 2] = "FunctionEvaluationFromGame";
  })(PushPopType || (PushPopType = {}));

  class Pointer {
      constructor() {
          this.container = null;
          this.index = -1;
          if (arguments.length === 2) {
              this.container = arguments[0];
              this.index = arguments[1];
          }
      }
      Resolve() {
          if (this.index < 0)
              return this.container;
          if (this.container == null)
              return null;
          if (this.container.content.length == 0)
              return this.container;
          if (this.index >= this.container.content.length)
              return null;
          return this.container.content[this.index];
      }
      get isNull() {
          return this.container == null;
      }
      get path() {
          if (this.isNull)
              return null;
          if (this.index >= 0)
              return this.container.path.PathByAppendingComponent(new Path.Component(this.index));
          else
              return this.container.path;
      }
      toString() {
          if (!this.container)
              return "Ink Pointer (null)";
          return ("Ink Pointer -> " +
              this.container.path.toString() +
              " -- index " +
              this.index);
      }
      // This method does not exist in the original C# code, but is here to maintain the
      // value semantics of Pointer.
      copy() {
          return new Pointer(this.container, this.index);
      }
      static StartOf(container) {
          return new Pointer(container, 0);
      }
      static get Null() {
          return new Pointer(null, -1);
      }
  }

  class Divert extends InkObject {
      constructor(stackPushType) {
          super();
          this._targetPath = null;
          this._targetPointer = Pointer.Null;
          this.variableDivertName = null;
          this.pushesToStack = false;
          this.stackPushType = 0;
          this.isExternal = false;
          this.externalArgs = 0;
          this.isConditional = false;
          this.pushesToStack = false;
          if (typeof stackPushType !== "undefined") {
              this.pushesToStack = true;
              this.stackPushType = stackPushType;
          }
      }
      get targetPath() {
          if (this._targetPath != null && this._targetPath.isRelative) {
              let targetObj = this.targetPointer.Resolve();
              if (targetObj) {
                  this._targetPath = targetObj.path;
              }
          }
          return this._targetPath;
      }
      set targetPath(value) {
          this._targetPath = value;
          this._targetPointer = Pointer.Null;
      }
      get targetPointer() {
          if (this._targetPointer.isNull) {
              let targetObj = this.ResolvePath(this._targetPath).obj;
              if (this._targetPath === null)
                  return throwNullException("this._targetPath");
              if (this._targetPath.lastComponent === null)
                  return throwNullException("this._targetPath.lastComponent");
              if (this._targetPath.lastComponent.isIndex) {
                  if (targetObj === null)
                      return throwNullException("targetObj");
                  this._targetPointer.container =
                      targetObj.parent instanceof Container ? targetObj.parent : null;
                  this._targetPointer.index = this._targetPath.lastComponent.index;
              }
              else {
                  this._targetPointer = Pointer.StartOf(targetObj instanceof Container ? targetObj : null);
              }
          }
          return this._targetPointer.copy();
      }
      get targetPathString() {
          if (this.targetPath == null)
              return null;
          return this.CompactPathString(this.targetPath);
      }
      set targetPathString(value) {
          if (value == null) {
              this.targetPath = null;
          }
          else {
              this.targetPath = new Path(value);
          }
      }
      get hasVariableTarget() {
          return this.variableDivertName != null;
      }
      Equals(obj) {
          let otherDivert = obj;
          if (otherDivert instanceof Divert) {
              if (this.hasVariableTarget == otherDivert.hasVariableTarget) {
                  if (this.hasVariableTarget) {
                      return this.variableDivertName == otherDivert.variableDivertName;
                  }
                  else {
                      if (this.targetPath === null)
                          return throwNullException("this.targetPath");
                      return this.targetPath.Equals(otherDivert.targetPath);
                  }
              }
          }
          return false;
      }
      toString() {
          if (this.hasVariableTarget) {
              return "Divert(variable: " + this.variableDivertName + ")";
          }
          else if (this.targetPath == null) {
              return "Divert(null)";
          }
          else {
              let sb = new StringBuilder();
              let targetStr = this.targetPath.toString();
              sb.Append("Divert");
              if (this.isConditional)
                  sb.Append("?");
              if (this.pushesToStack) {
                  if (this.stackPushType == PushPopType.Function) {
                      sb.Append(" function");
                  }
                  else {
                      sb.Append(" tunnel");
                  }
              }
              sb.Append(" -> ");
              sb.Append(this.targetPathString);
              sb.Append(" (");
              sb.Append(targetStr);
              sb.Append(")");
              return sb.toString();
          }
      }
  }

  class ChoicePoint extends InkObject {
      constructor(onceOnly = true) {
          super();
          this._pathOnChoice = null;
          this.hasCondition = false;
          this.hasStartContent = false;
          this.hasChoiceOnlyContent = false;
          this.isInvisibleDefault = false;
          this.onceOnly = true;
          this.onceOnly = onceOnly;
      }
      get pathOnChoice() {
          if (this._pathOnChoice != null && this._pathOnChoice.isRelative) {
              let choiceTargetObj = this.choiceTarget;
              if (choiceTargetObj) {
                  this._pathOnChoice = choiceTargetObj.path;
              }
          }
          return this._pathOnChoice;
      }
      set pathOnChoice(value) {
          this._pathOnChoice = value;
      }
      get choiceTarget() {
          if (this._pathOnChoice === null)
              return throwNullException("ChoicePoint._pathOnChoice");
          return this.ResolvePath(this._pathOnChoice).container;
      }
      get pathStringOnChoice() {
          if (this.pathOnChoice === null)
              return throwNullException("ChoicePoint.pathOnChoice");
          return this.CompactPathString(this.pathOnChoice);
      }
      set pathStringOnChoice(value) {
          this.pathOnChoice = new Path(value);
      }
      get flags() {
          let flags = 0;
          if (this.hasCondition)
              flags |= 1;
          if (this.hasStartContent)
              flags |= 2;
          if (this.hasChoiceOnlyContent)
              flags |= 4;
          if (this.isInvisibleDefault)
              flags |= 8;
          if (this.onceOnly)
              flags |= 16;
          return flags;
      }
      set flags(value) {
          this.hasCondition = (value & 1) > 0;
          this.hasStartContent = (value & 2) > 0;
          this.hasChoiceOnlyContent = (value & 4) > 0;
          this.isInvisibleDefault = (value & 8) > 0;
          this.onceOnly = (value & 16) > 0;
      }
      toString() {
          if (this.pathOnChoice === null)
              return throwNullException("ChoicePoint.pathOnChoice");
          let targetString = this.pathOnChoice.toString();
          return "Choice: -> " + targetString;
      }
  }

  class VariableReference extends InkObject {
      constructor(name = null) {
          super();
          this.pathForCount = null;
          this.name = name;
      }
      get containerForCount() {
          if (this.pathForCount === null)
              return null;
          return this.ResolvePath(this.pathForCount).container;
      }
      get pathStringForCount() {
          if (this.pathForCount === null)
              return null;
          return this.CompactPathString(this.pathForCount);
      }
      set pathStringForCount(value) {
          if (value === null)
              this.pathForCount = null;
          else
              this.pathForCount = new Path(value);
      }
      toString() {
          if (this.name != null) {
              return "var(" + this.name + ")";
          }
          else {
              let pathStr = this.pathStringForCount;
              return "read_count(" + pathStr + ")";
          }
      }
  }

  class VariableAssignment extends InkObject {
      constructor(variableName, isNewDeclaration) {
          super();
          this.variableName = variableName || null;
          this.isNewDeclaration = !!isNewDeclaration;
          this.isGlobal = false;
      }
      toString() {
          return "VarAssign to " + this.variableName;
      }
  }

  class Void extends InkObject {
  }

  class NativeFunctionCall extends InkObject {
      constructor() {
          super();
          this._name = null;
          this._numberOfParameters = 0;
          this._prototype = null;
          this._isPrototype = false;
          this._operationFuncs = null;
          if (arguments.length === 0) {
              NativeFunctionCall.GenerateNativeFunctionsIfNecessary();
          }
          else if (arguments.length === 1) {
              let name = arguments[0];
              NativeFunctionCall.GenerateNativeFunctionsIfNecessary();
              this.name = name;
          }
          else if (arguments.length === 2) {
              let name = arguments[0];
              let numberOfParameters = arguments[1];
              this._isPrototype = true;
              this.name = name;
              this.numberOfParameters = numberOfParameters;
          }
      }
      static CallWithName(functionName) {
          return new NativeFunctionCall(functionName);
      }
      static CallExistsWithName(functionName) {
          this.GenerateNativeFunctionsIfNecessary();
          return this._nativeFunctions.get(functionName);
      }
      get name() {
          if (this._name === null)
              return throwNullException("NativeFunctionCall._name");
          return this._name;
      }
      set name(value) {
          this._name = value;
          if (!this._isPrototype) {
              if (NativeFunctionCall._nativeFunctions === null)
                  throwNullException("NativeFunctionCall._nativeFunctions");
              else
                  this._prototype =
                      NativeFunctionCall._nativeFunctions.get(this._name) || null;
          }
      }
      get numberOfParameters() {
          if (this._prototype) {
              return this._prototype.numberOfParameters;
          }
          else {
              return this._numberOfParameters;
          }
      }
      set numberOfParameters(value) {
          this._numberOfParameters = value;
      }
      Call(parameters) {
          if (this._prototype) {
              return this._prototype.Call(parameters);
          }
          if (this.numberOfParameters != parameters.length) {
              throw new Error("Unexpected number of parameters");
          }
          let hasList = false;
          for (let p of parameters) {
              if (p instanceof Void)
                  throw new StoryException('Attempting to perform operation on a void value. Did you forget to "return" a value from a function you called here?');
              if (p instanceof ListValue)
                  hasList = true;
          }
          if (parameters.length == 2 && hasList) {
              return this.CallBinaryListOperation(parameters);
          }
          let coercedParams = this.CoerceValuesToSingleType(parameters);
          let coercedType = coercedParams[0].valueType;
          if (coercedType == ValueType.Int) {
              return this.CallType(coercedParams);
          }
          else if (coercedType == ValueType.Float) {
              return this.CallType(coercedParams);
          }
          else if (coercedType == ValueType.String) {
              return this.CallType(coercedParams);
          }
          else if (coercedType == ValueType.DivertTarget) {
              return this.CallType(coercedParams);
          }
          else if (coercedType == ValueType.List) {
              return this.CallType(coercedParams);
          }
          return null;
      }
      CallType(parametersOfSingleType) {
          let param1 = asOrThrows(parametersOfSingleType[0], Value);
          let valType = param1.valueType;
          let val1 = param1;
          let paramCount = parametersOfSingleType.length;
          if (paramCount == 2 || paramCount == 1) {
              if (this._operationFuncs === null)
                  return throwNullException("NativeFunctionCall._operationFuncs");
              let opForTypeObj = this._operationFuncs.get(valType);
              if (!opForTypeObj) {
                  const key = ValueType[valType];
                  throw new StoryException("Cannot perform operation " + this.name + " on " + key);
              }
              if (paramCount == 2) {
                  let param2 = asOrThrows(parametersOfSingleType[1], Value);
                  let val2 = param2;
                  let opForType = opForTypeObj;
                  if (val1.value === null || val2.value === null)
                      return throwNullException("NativeFunctionCall.Call BinaryOp values");
                  let resultVal = opForType(val1.value, val2.value);
                  return Value.Create(resultVal);
              }
              else {
                  let opForType = opForTypeObj;
                  if (val1.value === null)
                      return throwNullException("NativeFunctionCall.Call UnaryOp value");
                  let resultVal = opForType(val1.value);
                  // This code is different from upstream. Since JavaScript treats
                  // integers and floats as the same numbers, it's impossible
                  // to force an number to be either an integer or a float.
                  //
                  // It can be useful to force a specific number type
                  // (especially for divisions), so the result of INT() & FLOAT()
                  // is coerced to the the proper value type.
                  //
                  // Note that we also force all other unary operation to
                  // return the same value type, although this is only
                  // meaningful for numbers. See `Value.Create`.
                  if (this.name === NativeFunctionCall.Int) {
                      return Value.Create(resultVal, ValueType.Int);
                  }
                  else if (this.name === NativeFunctionCall.Float) {
                      return Value.Create(resultVal, ValueType.Float);
                  }
                  else {
                      return Value.Create(resultVal, param1.valueType);
                  }
              }
          }
          else {
              throw new Error("Unexpected number of parameters to NativeFunctionCall: " +
                  parametersOfSingleType.length);
          }
      }
      CallBinaryListOperation(parameters) {
          if ((this.name == "+" || this.name == "-") &&
              parameters[0] instanceof ListValue &&
              parameters[1] instanceof IntValue)
              return this.CallListIncrementOperation(parameters);
          let v1 = asOrThrows(parameters[0], Value);
          let v2 = asOrThrows(parameters[1], Value);
          if ((this.name == "&&" || this.name == "||") &&
              (v1.valueType != ValueType.List || v2.valueType != ValueType.List)) {
              if (this._operationFuncs === null)
                  return throwNullException("NativeFunctionCall._operationFuncs");
              let op = this._operationFuncs.get(ValueType.Int);
              if (op === null)
                  return throwNullException("NativeFunctionCall.CallBinaryListOperation op");
              let result = asBooleanOrThrows(op(v1.isTruthy ? 1 : 0, v2.isTruthy ? 1 : 0));
              return new BoolValue(result);
          }
          if (v1.valueType == ValueType.List && v2.valueType == ValueType.List)
              return this.CallType([v1, v2]);
          throw new StoryException("Can not call use " +
              this.name +
              " operation on " +
              ValueType[v1.valueType] +
              " and " +
              ValueType[v2.valueType]);
      }
      CallListIncrementOperation(listIntParams) {
          let listVal = asOrThrows(listIntParams[0], ListValue);
          let intVal = asOrThrows(listIntParams[1], IntValue);
          let resultInkList = new InkList();
          if (listVal.value === null)
              return throwNullException("NativeFunctionCall.CallListIncrementOperation listVal.value");
          for (let [listItemKey, listItemValue] of listVal.value) {
              let listItem = InkListItem.fromSerializedKey(listItemKey);
              if (this._operationFuncs === null)
                  return throwNullException("NativeFunctionCall._operationFuncs");
              let intOp = this._operationFuncs.get(ValueType.Int);
              if (intVal.value === null)
                  return throwNullException("NativeFunctionCall.CallListIncrementOperation intVal.value");
              let targetInt = intOp(listItemValue, intVal.value);
              let itemOrigin = null;
              if (listVal.value.origins === null)
                  return throwNullException("NativeFunctionCall.CallListIncrementOperation listVal.value.origins");
              for (let origin of listVal.value.origins) {
                  if (origin.name == listItem.originName) {
                      itemOrigin = origin;
                      break;
                  }
              }
              if (itemOrigin != null) {
                  let incrementedItem = itemOrigin.TryGetItemWithValue(targetInt, InkListItem.Null);
                  if (incrementedItem.exists)
                      resultInkList.Add(incrementedItem.result, targetInt);
              }
          }
          return new ListValue(resultInkList);
      }
      CoerceValuesToSingleType(parametersIn) {
          let valType = ValueType.Int;
          let specialCaseList = null;
          for (let obj of parametersIn) {
              let val = asOrThrows(obj, Value);
              if (val.valueType > valType) {
                  valType = val.valueType;
              }
              if (val.valueType == ValueType.List) {
                  specialCaseList = asOrNull(val, ListValue);
              }
          }
          let parametersOut = [];
          if (ValueType[valType] == ValueType[ValueType.List]) {
              for (let inkObjectVal of parametersIn) {
                  let val = asOrThrows(inkObjectVal, Value);
                  if (val.valueType == ValueType.List) {
                      parametersOut.push(val);
                  }
                  else if (val.valueType == ValueType.Int) {
                      let intVal = parseInt(val.valueObject);
                      specialCaseList = asOrThrows(specialCaseList, ListValue);
                      if (specialCaseList.value === null)
                          return throwNullException("NativeFunctionCall.CoerceValuesToSingleType specialCaseList.value");
                      let list = specialCaseList.value.originOfMaxItem;
                      if (list === null)
                          return throwNullException("NativeFunctionCall.CoerceValuesToSingleType list");
                      let item = list.TryGetItemWithValue(intVal, InkListItem.Null);
                      if (item.exists) {
                          let castedValue = new ListValue(item.result, intVal);
                          parametersOut.push(castedValue);
                      }
                      else
                          throw new StoryException("Could not find List item with the value " +
                              intVal +
                              " in " +
                              list.name);
                  }
                  else {
                      const key = ValueType[val.valueType];
                      throw new StoryException("Cannot mix Lists and " + key + " values in this operation");
                  }
              }
          }
          else {
              for (let inkObjectVal of parametersIn) {
                  let val = asOrThrows(inkObjectVal, Value);
                  let castedValue = val.Cast(valType);
                  parametersOut.push(castedValue);
              }
          }
          return parametersOut;
      }
      static Identity(t) {
          return t;
      }
      static GenerateNativeFunctionsIfNecessary() {
          if (this._nativeFunctions == null) {
              this._nativeFunctions = new Map();
              // Int operations
              this.AddIntBinaryOp(this.Add, (x, y) => x + y);
              this.AddIntBinaryOp(this.Subtract, (x, y) => x - y);
              this.AddIntBinaryOp(this.Multiply, (x, y) => x * y);
              this.AddIntBinaryOp(this.Divide, (x, y) => Math.floor(x / y));
              this.AddIntBinaryOp(this.Mod, (x, y) => x % y);
              this.AddIntUnaryOp(this.Negate, (x) => -x);
              this.AddIntBinaryOp(this.Equal, (x, y) => x == y);
              this.AddIntBinaryOp(this.Greater, (x, y) => x > y);
              this.AddIntBinaryOp(this.Less, (x, y) => x < y);
              this.AddIntBinaryOp(this.GreaterThanOrEquals, (x, y) => x >= y);
              this.AddIntBinaryOp(this.LessThanOrEquals, (x, y) => x <= y);
              this.AddIntBinaryOp(this.NotEquals, (x, y) => x != y);
              this.AddIntUnaryOp(this.Not, (x) => x == 0);
              this.AddIntBinaryOp(this.And, (x, y) => x != 0 && y != 0);
              this.AddIntBinaryOp(this.Or, (x, y) => x != 0 || y != 0);
              this.AddIntBinaryOp(this.Max, (x, y) => Math.max(x, y));
              this.AddIntBinaryOp(this.Min, (x, y) => Math.min(x, y));
              this.AddIntBinaryOp(this.Pow, (x, y) => Math.pow(x, y));
              this.AddIntUnaryOp(this.Floor, NativeFunctionCall.Identity);
              this.AddIntUnaryOp(this.Ceiling, NativeFunctionCall.Identity);
              this.AddIntUnaryOp(this.Int, NativeFunctionCall.Identity);
              this.AddIntUnaryOp(this.Float, (x) => x);
              // Float operations
              this.AddFloatBinaryOp(this.Add, (x, y) => x + y);
              this.AddFloatBinaryOp(this.Subtract, (x, y) => x - y);
              this.AddFloatBinaryOp(this.Multiply, (x, y) => x * y);
              this.AddFloatBinaryOp(this.Divide, (x, y) => x / y);
              this.AddFloatBinaryOp(this.Mod, (x, y) => x % y);
              this.AddFloatUnaryOp(this.Negate, (x) => -x);
              this.AddFloatBinaryOp(this.Equal, (x, y) => x == y);
              this.AddFloatBinaryOp(this.Greater, (x, y) => x > y);
              this.AddFloatBinaryOp(this.Less, (x, y) => x < y);
              this.AddFloatBinaryOp(this.GreaterThanOrEquals, (x, y) => x >= y);
              this.AddFloatBinaryOp(this.LessThanOrEquals, (x, y) => x <= y);
              this.AddFloatBinaryOp(this.NotEquals, (x, y) => x != y);
              this.AddFloatUnaryOp(this.Not, (x) => x == 0.0);
              this.AddFloatBinaryOp(this.And, (x, y) => x != 0.0 && y != 0.0);
              this.AddFloatBinaryOp(this.Or, (x, y) => x != 0.0 || y != 0.0);
              this.AddFloatBinaryOp(this.Max, (x, y) => Math.max(x, y));
              this.AddFloatBinaryOp(this.Min, (x, y) => Math.min(x, y));
              this.AddFloatBinaryOp(this.Pow, (x, y) => Math.pow(x, y));
              this.AddFloatUnaryOp(this.Floor, (x) => Math.floor(x));
              this.AddFloatUnaryOp(this.Ceiling, (x) => Math.ceil(x));
              this.AddFloatUnaryOp(this.Int, (x) => Math.floor(x));
              this.AddFloatUnaryOp(this.Float, NativeFunctionCall.Identity);
              // String operations
              this.AddStringBinaryOp(this.Add, (x, y) => x + y); // concat
              this.AddStringBinaryOp(this.Equal, (x, y) => x === y);
              this.AddStringBinaryOp(this.NotEquals, (x, y) => !(x === y));
              this.AddStringBinaryOp(this.Has, (x, y) => x.includes(y));
              this.AddStringBinaryOp(this.Hasnt, (x, y) => !x.includes(y));
              this.AddListBinaryOp(this.Add, (x, y) => x.Union(y));
              this.AddListBinaryOp(this.Subtract, (x, y) => x.Without(y));
              this.AddListBinaryOp(this.Has, (x, y) => x.Contains(y));
              this.AddListBinaryOp(this.Hasnt, (x, y) => !x.Contains(y));
              this.AddListBinaryOp(this.Intersect, (x, y) => x.Intersect(y));
              this.AddListBinaryOp(this.Equal, (x, y) => x.Equals(y));
              this.AddListBinaryOp(this.Greater, (x, y) => x.GreaterThan(y));
              this.AddListBinaryOp(this.Less, (x, y) => x.LessThan(y));
              this.AddListBinaryOp(this.GreaterThanOrEquals, (x, y) => x.GreaterThanOrEquals(y));
              this.AddListBinaryOp(this.LessThanOrEquals, (x, y) => x.LessThanOrEquals(y));
              this.AddListBinaryOp(this.NotEquals, (x, y) => !x.Equals(y));
              this.AddListBinaryOp(this.And, (x, y) => x.Count > 0 && y.Count > 0);
              this.AddListBinaryOp(this.Or, (x, y) => x.Count > 0 || y.Count > 0);
              this.AddListUnaryOp(this.Not, (x) => (x.Count == 0 ? 1 : 0));
              this.AddListUnaryOp(this.Invert, (x) => x.inverse);
              this.AddListUnaryOp(this.All, (x) => x.all);
              this.AddListUnaryOp(this.ListMin, (x) => x.MinAsList());
              this.AddListUnaryOp(this.ListMax, (x) => x.MaxAsList());
              this.AddListUnaryOp(this.Count, (x) => x.Count);
              this.AddListUnaryOp(this.ValueOfList, (x) => x.maxItem.Value);
              let divertTargetsEqual = (d1, d2) => d1.Equals(d2);
              let divertTargetsNotEqual = (d1, d2) => !d1.Equals(d2);
              this.AddOpToNativeFunc(this.Equal, 2, ValueType.DivertTarget, divertTargetsEqual);
              this.AddOpToNativeFunc(this.NotEquals, 2, ValueType.DivertTarget, divertTargetsNotEqual);
          }
      }
      AddOpFuncForType(valType, op) {
          if (this._operationFuncs == null) {
              this._operationFuncs = new Map();
          }
          this._operationFuncs.set(valType, op);
      }
      static AddOpToNativeFunc(name, args, valType, op) {
          if (this._nativeFunctions === null)
              return throwNullException("NativeFunctionCall._nativeFunctions");
          let nativeFunc = this._nativeFunctions.get(name);
          if (!nativeFunc) {
              nativeFunc = new NativeFunctionCall(name, args);
              this._nativeFunctions.set(name, nativeFunc);
          }
          nativeFunc.AddOpFuncForType(valType, op);
      }
      static AddIntBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, ValueType.Int, op);
      }
      static AddIntUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, ValueType.Int, op);
      }
      static AddFloatBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, ValueType.Float, op);
      }
      static AddFloatUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, ValueType.Float, op);
      }
      static AddStringBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, ValueType.String, op);
      }
      static AddListBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, ValueType.List, op);
      }
      static AddListUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, ValueType.List, op);
      }
      toString() {
          return 'Native "' + this.name + '"';
      }
  }
  NativeFunctionCall.Add = "+";
  NativeFunctionCall.Subtract = "-";
  NativeFunctionCall.Divide = "/";
  NativeFunctionCall.Multiply = "*";
  NativeFunctionCall.Mod = "%";
  NativeFunctionCall.Negate = "_";
  NativeFunctionCall.Equal = "==";
  NativeFunctionCall.Greater = ">";
  NativeFunctionCall.Less = "<";
  NativeFunctionCall.GreaterThanOrEquals = ">=";
  NativeFunctionCall.LessThanOrEquals = "<=";
  NativeFunctionCall.NotEquals = "!=";
  NativeFunctionCall.Not = "!";
  NativeFunctionCall.And = "&&";
  NativeFunctionCall.Or = "||";
  NativeFunctionCall.Min = "MIN";
  NativeFunctionCall.Max = "MAX";
  NativeFunctionCall.Pow = "POW";
  NativeFunctionCall.Floor = "FLOOR";
  NativeFunctionCall.Ceiling = "CEILING";
  NativeFunctionCall.Int = "INT";
  NativeFunctionCall.Float = "FLOAT";
  NativeFunctionCall.Has = "?";
  NativeFunctionCall.Hasnt = "!?";
  NativeFunctionCall.Intersect = "^";
  NativeFunctionCall.ListMin = "LIST_MIN";
  NativeFunctionCall.ListMax = "LIST_MAX";
  NativeFunctionCall.All = "LIST_ALL";
  NativeFunctionCall.Count = "LIST_COUNT";
  NativeFunctionCall.ValueOfList = "LIST_VALUE";
  NativeFunctionCall.Invert = "LIST_INVERT";
  NativeFunctionCall._nativeFunctions = null;

  class Tag extends InkObject {
      constructor(tagText) {
          super();
          this.text = tagText.toString() || "";
      }
      toString() {
          return "# " + this.text;
      }
  }

  class Choice extends InkObject {
      constructor() {
          super(...arguments);
          this.text = "";
          this.index = 0;
          this.threadAtGeneration = null;
          this.sourcePath = "";
          this.targetPath = null;
          this.isInvisibleDefault = false;
          this.originalThreadIndex = 0;
      }
      get pathStringOnChoice() {
          if (this.targetPath === null)
              return throwNullException("Choice.targetPath");
          return this.targetPath.toString();
      }
      set pathStringOnChoice(value) {
          this.targetPath = new Path(value);
      }
  }

  class ListDefinition {
      constructor(name, items) {
          this._name = name || "";
          this._items = null;
          this._itemNameToValues = items || new Map();
      }
      get name() {
          return this._name;
      }
      get items() {
          if (this._items == null) {
              this._items = new Map();
              for (let [key, value] of this._itemNameToValues) {
                  let item = new InkListItem(this.name, key);
                  this._items.set(item.serialized(), value);
              }
          }
          return this._items;
      }
      ValueForItem(item) {
          if (!item.itemName)
              return 0;
          let intVal = this._itemNameToValues.get(item.itemName);
          if (typeof intVal !== "undefined")
              return intVal;
          else
              return 0;
      }
      ContainsItem(item) {
          if (!item.itemName)
              return false;
          if (item.originName != this.name)
              return false;
          return this._itemNameToValues.has(item.itemName);
      }
      ContainsItemWithName(itemName) {
          return this._itemNameToValues.has(itemName);
      }
      TryGetItemWithValue(val, 
      /* out */ item) {
          for (let [key, value] of this._itemNameToValues) {
              if (value == val) {
                  item = new InkListItem(this.name, key);
                  return { result: item, exists: true };
              }
          }
          item = InkListItem.Null;
          return { result: item, exists: false };
      }
      TryGetValueForItem(item, 
      /* out */ intVal) {
          if (!item.itemName)
              return { result: 0, exists: false };
          let value = this._itemNameToValues.get(item.itemName);
          if (!value)
              return { result: 0, exists: false };
          return { result: value, exists: true };
      }
  }

  class ListDefinitionsOrigin {
      constructor(lists) {
          this._lists = new Map();
          this._allUnambiguousListValueCache = new Map();
          for (let list of lists) {
              this._lists.set(list.name, list);
              for (let [key, val] of list.items) {
                  let item = InkListItem.fromSerializedKey(key);
                  let listValue = new ListValue(item, val);
                  if (!item.itemName) {
                      throw new Error("item.itemName is null or undefined.");
                  }
                  this._allUnambiguousListValueCache.set(item.itemName, listValue);
                  this._allUnambiguousListValueCache.set(item.fullName, listValue);
              }
          }
      }
      get lists() {
          let listOfLists = [];
          for (let [, value] of this._lists) {
              listOfLists.push(value);
          }
          return listOfLists;
      }
      TryListGetDefinition(name, 
      /* out */ def) {
          if (name === null) {
              return { result: def, exists: false };
          }
          // initially, this function returns a boolean and the second parameter is an out.
          let definition = this._lists.get(name);
          if (!definition)
              return { result: def, exists: false };
          return { result: definition, exists: true };
      }
      FindSingleItemListWithName(name) {
          if (name === null) {
              return throwNullException("name");
          }
          let val = this._allUnambiguousListValueCache.get(name);
          if (typeof val !== "undefined") {
              return val;
          }
          return null;
      }
  }

  class JsonSerialisation {
      static JArrayToRuntimeObjList(jArray, skipLast = false) {
          let count = jArray.length;
          if (skipLast)
              count--;
          let list = [];
          for (let i = 0; i < count; i++) {
              let jTok = jArray[i];
              let runtimeObj = this.JTokenToRuntimeObject(jTok);
              if (runtimeObj === null) {
                  return throwNullException("runtimeObj");
              }
              list.push(runtimeObj);
          }
          return list;
      }
      static WriteDictionaryRuntimeObjs(writer, dictionary) {
          writer.WriteObjectStart();
          for (let [key, value] of dictionary) {
              writer.WritePropertyStart(key);
              this.WriteRuntimeObject(writer, value);
              writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
      }
      static WriteListRuntimeObjs(writer, list) {
          writer.WriteArrayStart();
          for (let value of list) {
              this.WriteRuntimeObject(writer, value);
          }
          writer.WriteArrayEnd();
      }
      static WriteIntDictionary(writer, dict) {
          writer.WriteObjectStart();
          for (let [key, value] of dict) {
              writer.WriteIntProperty(key, value);
          }
          writer.WriteObjectEnd();
      }
      static WriteRuntimeObject(writer, obj) {
          let container = asOrNull(obj, Container);
          if (container) {
              this.WriteRuntimeContainer(writer, container);
              return;
          }
          let divert = asOrNull(obj, Divert);
          if (divert) {
              let divTypeKey = "->";
              if (divert.isExternal) {
                  divTypeKey = "x()";
              }
              else if (divert.pushesToStack) {
                  if (divert.stackPushType == PushPopType.Function) {
                      divTypeKey = "f()";
                  }
                  else if (divert.stackPushType == PushPopType.Tunnel) {
                      divTypeKey = "->t->";
                  }
              }
              let targetStr;
              if (divert.hasVariableTarget) {
                  targetStr = divert.variableDivertName;
              }
              else {
                  targetStr = divert.targetPathString;
              }
              writer.WriteObjectStart();
              writer.WriteProperty(divTypeKey, targetStr);
              if (divert.hasVariableTarget) {
                  writer.WriteProperty("var", true);
              }
              if (divert.isConditional) {
                  writer.WriteProperty("c", true);
              }
              if (divert.externalArgs > 0) {
                  writer.WriteIntProperty("exArgs", divert.externalArgs);
              }
              writer.WriteObjectEnd();
              return;
          }
          let choicePoint = asOrNull(obj, ChoicePoint);
          if (choicePoint) {
              writer.WriteObjectStart();
              writer.WriteProperty("*", choicePoint.pathStringOnChoice);
              writer.WriteIntProperty("flg", choicePoint.flags);
              writer.WriteObjectEnd();
              return;
          }
          let boolVal = asOrNull(obj, BoolValue);
          if (boolVal) {
              writer.WriteBool(boolVal.value);
              return;
          }
          let intVal = asOrNull(obj, IntValue);
          if (intVal) {
              writer.WriteInt(intVal.value);
              return;
          }
          let floatVal = asOrNull(obj, FloatValue);
          if (floatVal) {
              writer.WriteFloat(floatVal.value);
              return;
          }
          let strVal = asOrNull(obj, StringValue);
          if (strVal) {
              if (strVal.isNewline) {
                  writer.Write("\n", false);
              }
              else {
                  writer.WriteStringStart();
                  writer.WriteStringInner("^");
                  writer.WriteStringInner(strVal.value);
                  writer.WriteStringEnd();
              }
              return;
          }
          let listVal = asOrNull(obj, ListValue);
          if (listVal) {
              this.WriteInkList(writer, listVal);
              return;
          }
          let divTargetVal = asOrNull(obj, DivertTargetValue);
          if (divTargetVal) {
              writer.WriteObjectStart();
              if (divTargetVal.value === null) {
                  return throwNullException("divTargetVal.value");
              }
              writer.WriteProperty("^->", divTargetVal.value.componentsString);
              writer.WriteObjectEnd();
              return;
          }
          let varPtrVal = asOrNull(obj, VariablePointerValue);
          if (varPtrVal) {
              writer.WriteObjectStart();
              writer.WriteProperty("^var", varPtrVal.value);
              writer.WriteIntProperty("ci", varPtrVal.contextIndex);
              writer.WriteObjectEnd();
              return;
          }
          let glue = asOrNull(obj, Glue);
          if (glue) {
              writer.Write("<>");
              return;
          }
          let controlCmd = asOrNull(obj, ControlCommand);
          if (controlCmd) {
              writer.Write(JsonSerialisation._controlCommandNames[controlCmd.commandType]);
              return;
          }
          let nativeFunc = asOrNull(obj, NativeFunctionCall);
          if (nativeFunc) {
              let name = nativeFunc.name;
              if (name == "^")
                  name = "L^";
              writer.Write(name);
              return;
          }
          let varRef = asOrNull(obj, VariableReference);
          if (varRef) {
              writer.WriteObjectStart();
              let readCountPath = varRef.pathStringForCount;
              if (readCountPath != null) {
                  writer.WriteProperty("CNT?", readCountPath);
              }
              else {
                  writer.WriteProperty("VAR?", varRef.name);
              }
              writer.WriteObjectEnd();
              return;
          }
          let varAss = asOrNull(obj, VariableAssignment);
          if (varAss) {
              writer.WriteObjectStart();
              let key = varAss.isGlobal ? "VAR=" : "temp=";
              writer.WriteProperty(key, varAss.variableName);
              // Reassignment?
              if (!varAss.isNewDeclaration)
                  writer.WriteProperty("re", true);
              writer.WriteObjectEnd();
              return;
          }
          let voidObj = asOrNull(obj, Void);
          if (voidObj) {
              writer.Write("void");
              return;
          }
          let tag = asOrNull(obj, Tag);
          if (tag) {
              writer.WriteObjectStart();
              writer.WriteProperty("#", tag.text);
              writer.WriteObjectEnd();
              return;
          }
          let choice = asOrNull(obj, Choice);
          if (choice) {
              this.WriteChoice(writer, choice);
              return;
          }
          throw new Error("Failed to convert runtime object to Json token: " + obj);
      }
      static JObjectToDictionaryRuntimeObjs(jObject) {
          let dict = new Map();
          for (let key in jObject) {
              if (jObject.hasOwnProperty(key)) {
                  let inkObject = this.JTokenToRuntimeObject(jObject[key]);
                  if (inkObject === null) {
                      return throwNullException("inkObject");
                  }
                  dict.set(key, inkObject);
              }
          }
          return dict;
      }
      static JObjectToIntDictionary(jObject) {
          let dict = new Map();
          for (let key in jObject) {
              if (jObject.hasOwnProperty(key)) {
                  dict.set(key, parseInt(jObject[key]));
              }
          }
          return dict;
      }
      static JTokenToRuntimeObject(token) {
          if ((typeof token === "number" && !isNaN(token)) ||
              typeof token === "boolean") {
              return Value.Create(token);
          }
          if (typeof token === "string") {
              let str = token.toString();
              // String value
              let firstChar = str[0];
              if (firstChar == "^")
                  return new StringValue(str.substring(1));
              else if (firstChar == "\n" && str.length == 1)
                  return new StringValue("\n");
              // Glue
              if (str == "<>")
                  return new Glue();
              // Control commands (would looking up in a hash set be faster?)
              for (let i = 0; i < JsonSerialisation._controlCommandNames.length; ++i) {
                  let cmdName = JsonSerialisation._controlCommandNames[i];
                  if (str == cmdName) {
                      return new ControlCommand(i);
                  }
              }
              // Native functions
              if (str == "L^")
                  str = "^";
              if (NativeFunctionCall.CallExistsWithName(str))
                  return NativeFunctionCall.CallWithName(str);
              // Pop
              if (str == "->->")
                  return ControlCommand.PopTunnel();
              else if (str == "~ret")
                  return ControlCommand.PopFunction();
              // Void
              if (str == "void")
                  return new Void();
          }
          if (typeof token === "object" && !Array.isArray(token)) {
              let obj = token;
              let propValue;
              // Divert target value to path
              if (obj["^->"]) {
                  propValue = obj["^->"];
                  return new DivertTargetValue(new Path(propValue.toString()));
              }
              // VariablePointerValue
              if (obj["^var"]) {
                  propValue = obj["^var"];
                  let varPtr = new VariablePointerValue(propValue.toString());
                  if ("ci" in obj) {
                      propValue = obj["ci"];
                      varPtr.contextIndex = parseInt(propValue);
                  }
                  return varPtr;
              }
              // Divert
              let isDivert = false;
              let pushesToStack = false;
              let divPushType = PushPopType.Function;
              let external = false;
              if ((propValue = obj["->"])) {
                  isDivert = true;
              }
              else if ((propValue = obj["f()"])) {
                  isDivert = true;
                  pushesToStack = true;
                  divPushType = PushPopType.Function;
              }
              else if ((propValue = obj["->t->"])) {
                  isDivert = true;
                  pushesToStack = true;
                  divPushType = PushPopType.Tunnel;
              }
              else if ((propValue = obj["x()"])) {
                  isDivert = true;
                  external = true;
                  pushesToStack = false;
                  divPushType = PushPopType.Function;
              }
              if (isDivert) {
                  let divert = new Divert();
                  divert.pushesToStack = pushesToStack;
                  divert.stackPushType = divPushType;
                  divert.isExternal = external;
                  let target = propValue.toString();
                  if ((propValue = obj["var"]))
                      divert.variableDivertName = target;
                  else
                      divert.targetPathString = target;
                  divert.isConditional = !!obj["c"];
                  if (external) {
                      if ((propValue = obj["exArgs"]))
                          divert.externalArgs = parseInt(propValue);
                  }
                  return divert;
              }
              // Choice
              if ((propValue = obj["*"])) {
                  let choice = new ChoicePoint();
                  choice.pathStringOnChoice = propValue.toString();
                  if ((propValue = obj["flg"]))
                      choice.flags = parseInt(propValue);
                  return choice;
              }
              // Variable reference
              if ((propValue = obj["VAR?"])) {
                  return new VariableReference(propValue.toString());
              }
              else if ((propValue = obj["CNT?"])) {
                  let readCountVarRef = new VariableReference();
                  readCountVarRef.pathStringForCount = propValue.toString();
                  return readCountVarRef;
              }
              // Variable assignment
              let isVarAss = false;
              let isGlobalVar = false;
              if ((propValue = obj["VAR="])) {
                  isVarAss = true;
                  isGlobalVar = true;
              }
              else if ((propValue = obj["temp="])) {
                  isVarAss = true;
                  isGlobalVar = false;
              }
              if (isVarAss) {
                  let varName = propValue.toString();
                  let isNewDecl = !obj["re"];
                  let varAss = new VariableAssignment(varName, isNewDecl);
                  varAss.isGlobal = isGlobalVar;
                  return varAss;
              }
              if (obj["#"] !== undefined) {
                  propValue = obj["#"];
                  return new Tag(propValue.toString());
              }
              // List value
              if ((propValue = obj["list"])) {
                  // var listContent = (Dictionary<string, object>)propValue;
                  let listContent = propValue;
                  let rawList = new InkList();
                  if ((propValue = obj["origins"])) {
                      // var namesAsObjs = (List<object>)propValue;
                      let namesAsObjs = propValue;
                      // rawList.SetInitialOriginNames(namesAsObjs.Cast<string>().ToList());
                      rawList.SetInitialOriginNames(namesAsObjs);
                  }
                  for (let key in listContent) {
                      if (listContent.hasOwnProperty(key)) {
                          let nameToVal = listContent[key];
                          let item = new InkListItem(key);
                          let val = parseInt(nameToVal);
                          rawList.Add(item, val);
                      }
                  }
                  return new ListValue(rawList);
              }
              if (obj["originalChoicePath"] != null)
                  return this.JObjectToChoice(obj);
          }
          // Array is always a Runtime.Container
          if (Array.isArray(token)) {
              return this.JArrayToContainer(token);
          }
          if (token === null || token === undefined)
              return null;
          throw new Error("Failed to convert token to runtime object: " + JSON.stringify(token));
      }
      static WriteRuntimeContainer(writer, container, withoutName = false) {
          writer.WriteArrayStart();
          if (container === null) {
              return throwNullException("container");
          }
          for (let c of container.content)
              this.WriteRuntimeObject(writer, c);
          let namedOnlyContent = container.namedOnlyContent;
          let countFlags = container.countFlags;
          let hasNameProperty = container.name != null && !withoutName;
          let hasTerminator = namedOnlyContent != null || countFlags > 0 || hasNameProperty;
          if (hasTerminator) {
              writer.WriteObjectStart();
          }
          if (namedOnlyContent != null) {
              for (let [key, value] of namedOnlyContent) {
                  let name = key;
                  let namedContainer = asOrNull(value, Container);
                  writer.WritePropertyStart(name);
                  this.WriteRuntimeContainer(writer, namedContainer, true);
                  writer.WritePropertyEnd();
              }
          }
          if (hasNameProperty)
              writer.WriteProperty("#n", container.name);
          if (hasTerminator)
              writer.WriteObjectEnd();
          else
              writer.WriteNull();
          writer.WriteArrayEnd();
      }
      static JArrayToContainer(jArray) {
          let container = new Container();
          container.content = this.JArrayToRuntimeObjList(jArray, true);
          let terminatingObj = jArray[jArray.length - 1];
          if (terminatingObj != null) {
              let namedOnlyContent = new Map();
              for (let key in terminatingObj) {
                  if (key == "#f") {
                      container.countFlags = parseInt(terminatingObj[key]);
                  }
                  else if (key == "#n") {
                      container.name = terminatingObj[key].toString();
                  }
                  else {
                      let namedContentItem = this.JTokenToRuntimeObject(terminatingObj[key]);
                      // var namedSubContainer = namedContentItem as Container;
                      let namedSubContainer = asOrNull(namedContentItem, Container);
                      if (namedSubContainer)
                          namedSubContainer.name = key;
                      namedOnlyContent.set(key, namedContentItem);
                  }
              }
              container.namedOnlyContent = namedOnlyContent;
          }
          return container;
      }
      static JObjectToChoice(jObj) {
          let choice = new Choice();
          choice.text = jObj["text"].toString();
          choice.index = parseInt(jObj["index"]);
          choice.sourcePath = jObj["originalChoicePath"].toString();
          choice.originalThreadIndex = parseInt(jObj["originalThreadIndex"]);
          choice.pathStringOnChoice = jObj["targetPath"].toString();
          return choice;
      }
      static WriteChoice(writer, choice) {
          writer.WriteObjectStart();
          writer.WriteProperty("text", choice.text);
          writer.WriteIntProperty("index", choice.index);
          writer.WriteProperty("originalChoicePath", choice.sourcePath);
          writer.WriteIntProperty("originalThreadIndex", choice.originalThreadIndex);
          writer.WriteProperty("targetPath", choice.pathStringOnChoice);
          writer.WriteObjectEnd();
      }
      static WriteInkList(writer, listVal) {
          let rawList = listVal.value;
          if (rawList === null) {
              return throwNullException("rawList");
          }
          writer.WriteObjectStart();
          writer.WritePropertyStart("list");
          writer.WriteObjectStart();
          for (let [key, val] of rawList) {
              let item = InkListItem.fromSerializedKey(key);
              let itemVal = val;
              if (item.itemName === null) {
                  return throwNullException("item.itemName");
              }
              writer.WritePropertyNameStart();
              writer.WritePropertyNameInner(item.originName ? item.originName : "?");
              writer.WritePropertyNameInner(".");
              writer.WritePropertyNameInner(item.itemName);
              writer.WritePropertyNameEnd();
              writer.Write(itemVal);
              writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
          writer.WritePropertyEnd();
          if (rawList.Count == 0 &&
              rawList.originNames != null &&
              rawList.originNames.length > 0) {
              writer.WritePropertyStart("origins");
              writer.WriteArrayStart();
              for (let name of rawList.originNames)
                  writer.Write(name);
              writer.WriteArrayEnd();
              writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
      }
      static ListDefinitionsToJToken(origin) {
          let result = {};
          for (let def of origin.lists) {
              let listDefJson = {};
              for (let [key, val] of def.items) {
                  let item = InkListItem.fromSerializedKey(key);
                  if (item.itemName === null) {
                      return throwNullException("item.itemName");
                  }
                  listDefJson[item.itemName] = val;
              }
              result[def.name] = listDefJson;
          }
          return result;
      }
      static JTokenToListDefinitions(obj) {
          // var defsObj = (Dictionary<string, object>)obj;
          let defsObj = obj;
          let allDefs = [];
          for (let key in defsObj) {
              if (defsObj.hasOwnProperty(key)) {
                  let name = key.toString();
                  // var listDefJson = (Dictionary<string, object>)kv.Value;
                  let listDefJson = defsObj[key];
                  // Cast (string, object) to (string, int) for items
                  let items = new Map();
                  for (let nameValueKey in listDefJson) {
                      if (defsObj.hasOwnProperty(key)) {
                          let nameValue = listDefJson[nameValueKey];
                          items.set(nameValueKey, parseInt(nameValue));
                      }
                  }
                  let def = new ListDefinition(name, items);
                  allDefs.push(def);
              }
          }
          return new ListDefinitionsOrigin(allDefs);
      }
  }
  JsonSerialisation._controlCommandNames = (() => {
      let _controlCommandNames = [];
      _controlCommandNames[ControlCommand.CommandType.EvalStart] = "ev";
      _controlCommandNames[ControlCommand.CommandType.EvalOutput] = "out";
      _controlCommandNames[ControlCommand.CommandType.EvalEnd] = "/ev";
      _controlCommandNames[ControlCommand.CommandType.Duplicate] = "du";
      _controlCommandNames[ControlCommand.CommandType.PopEvaluatedValue] = "pop";
      _controlCommandNames[ControlCommand.CommandType.PopFunction] = "~ret";
      _controlCommandNames[ControlCommand.CommandType.PopTunnel] = "->->";
      _controlCommandNames[ControlCommand.CommandType.BeginString] = "str";
      _controlCommandNames[ControlCommand.CommandType.EndString] = "/str";
      _controlCommandNames[ControlCommand.CommandType.NoOp] = "nop";
      _controlCommandNames[ControlCommand.CommandType.ChoiceCount] = "choiceCnt";
      _controlCommandNames[ControlCommand.CommandType.Turns] = "turn";
      _controlCommandNames[ControlCommand.CommandType.TurnsSince] = "turns";
      _controlCommandNames[ControlCommand.CommandType.ReadCount] = "readc";
      _controlCommandNames[ControlCommand.CommandType.Random] = "rnd";
      _controlCommandNames[ControlCommand.CommandType.SeedRandom] = "srnd";
      _controlCommandNames[ControlCommand.CommandType.VisitIndex] = "visit";
      _controlCommandNames[ControlCommand.CommandType.SequenceShuffleIndex] =
          "seq";
      _controlCommandNames[ControlCommand.CommandType.StartThread] = "thread";
      _controlCommandNames[ControlCommand.CommandType.Done] = "done";
      _controlCommandNames[ControlCommand.CommandType.End] = "end";
      _controlCommandNames[ControlCommand.CommandType.ListFromInt] = "listInt";
      _controlCommandNames[ControlCommand.CommandType.ListRange] = "range";
      _controlCommandNames[ControlCommand.CommandType.ListRandom] = "lrnd";
      for (let i = 0; i < ControlCommand.CommandType.TOTAL_VALUES; ++i) {
          if (_controlCommandNames[i] == null)
              throw new Error("Control command not accounted for in serialisation");
      }
      return _controlCommandNames;
  })();

  class CallStack {
      constructor() {
          this._threadCounter = 0;
          this._startOfRoot = Pointer.Null;
          if (arguments[0] instanceof Story) {
              let storyContext = arguments[0];
              this._startOfRoot = Pointer.StartOf(storyContext.rootContentContainer);
              this.Reset();
          }
          else {
              let toCopy = arguments[0];
              this._threads = [];
              for (let otherThread of toCopy._threads) {
                  this._threads.push(otherThread.Copy());
              }
              this._threadCounter = toCopy._threadCounter;
              this._startOfRoot = toCopy._startOfRoot.copy();
          }
      }
      get elements() {
          return this.callStack;
      }
      get depth() {
          return this.elements.length;
      }
      get currentElement() {
          let thread = this._threads[this._threads.length - 1];
          let cs = thread.callstack;
          return cs[cs.length - 1];
      }
      get currentElementIndex() {
          return this.callStack.length - 1;
      }
      get currentThread() {
          return this._threads[this._threads.length - 1];
      }
      set currentThread(value) {
          Debug.Assert(this._threads.length == 1, "Shouldn't be directly setting the current thread when we have a stack of them");
          this._threads.length = 0;
          this._threads.push(value);
      }
      get canPop() {
          return this.callStack.length > 1;
      }
      Reset() {
          this._threads = [];
          this._threads.push(new CallStack.Thread());
          this._threads[0].callstack.push(new CallStack.Element(PushPopType.Tunnel, this._startOfRoot));
      }
      SetJsonToken(jObject, storyContext) {
          this._threads.length = 0;
          // TODO: (List<object>) jObject ["threads"];
          let jThreads = jObject["threads"];
          for (let jThreadTok of jThreads) {
              // TODO: var jThreadObj = (Dictionary<string, object>)jThreadTok;
              let jThreadObj = jThreadTok;
              let thread = new CallStack.Thread(jThreadObj, storyContext);
              this._threads.push(thread);
          }
          // TODO: (int)jObject ["threadCounter"];
          this._threadCounter = parseInt(jObject["threadCounter"]);
          this._startOfRoot = Pointer.StartOf(storyContext.rootContentContainer);
      }
      WriteJson(w) {
          w.WriteObject((writer) => {
              writer.WritePropertyStart("threads");
              writer.WriteArrayStart();
              for (let thread of this._threads) {
                  thread.WriteJson(writer);
              }
              writer.WriteArrayEnd();
              writer.WritePropertyEnd();
              writer.WritePropertyStart("threadCounter");
              writer.WriteInt(this._threadCounter);
              writer.WritePropertyEnd();
          });
      }
      PushThread() {
          let newThread = this.currentThread.Copy();
          this._threadCounter++;
          newThread.threadIndex = this._threadCounter;
          this._threads.push(newThread);
      }
      ForkThread() {
          let forkedThread = this.currentThread.Copy();
          this._threadCounter++;
          forkedThread.threadIndex = this._threadCounter;
          return forkedThread;
      }
      PopThread() {
          if (this.canPopThread) {
              this._threads.splice(this._threads.indexOf(this.currentThread), 1); // should be equivalent to a pop()
          }
          else {
              throw new Error("Can't pop thread");
          }
      }
      get canPopThread() {
          return this._threads.length > 1 && !this.elementIsEvaluateFromGame;
      }
      get elementIsEvaluateFromGame() {
          return this.currentElement.type == PushPopType.FunctionEvaluationFromGame;
      }
      Push(type, externalEvaluationStackHeight = 0, outputStreamLengthWithPushed = 0) {
          let element = new CallStack.Element(type, this.currentElement.currentPointer, false);
          element.evaluationStackHeightWhenPushed = externalEvaluationStackHeight;
          element.functionStartInOutputStream = outputStreamLengthWithPushed;
          this.callStack.push(element);
      }
      CanPop(type = null) {
          if (!this.canPop)
              return false;
          if (type == null)
              return true;
          return this.currentElement.type == type;
      }
      Pop(type = null) {
          if (this.CanPop(type)) {
              this.callStack.pop();
              return;
          }
          else {
              throw new Error("Mismatched push/pop in Callstack");
          }
      }
      GetTemporaryVariableWithName(name, contextIndex = -1) {
          if (contextIndex == -1)
              contextIndex = this.currentElementIndex + 1;
          let contextElement = this.callStack[contextIndex - 1];
          let varValue = tryGetValueFromMap(contextElement.temporaryVariables, name, null);
          if (varValue.exists) {
              return varValue.result;
          }
          else {
              return null;
          }
      }
      SetTemporaryVariable(name, value, declareNew, contextIndex = -1) {
          if (contextIndex == -1)
              contextIndex = this.currentElementIndex + 1;
          let contextElement = this.callStack[contextIndex - 1];
          if (!declareNew && !contextElement.temporaryVariables.get(name)) {
              throw new Error("Could not find temporary variable to set: " + name);
          }
          let oldValue = tryGetValueFromMap(contextElement.temporaryVariables, name, null);
          if (oldValue.exists)
              ListValue.RetainListOriginsForAssignment(oldValue.result, value);
          contextElement.temporaryVariables.set(name, value);
      }
      ContextForVariableNamed(name) {
          if (this.currentElement.temporaryVariables.get(name)) {
              return this.currentElementIndex + 1;
          }
          else {
              return 0;
          }
      }
      ThreadWithIndex(index) {
          let filtered = this._threads.filter((t) => {
              if (t.threadIndex == index)
                  return t;
          });
          return filtered.length > 0 ? filtered[0] : null;
      }
      get callStack() {
          return this.currentThread.callstack;
      }
      get callStackTrace() {
          let sb = new StringBuilder();
          for (let t = 0; t < this._threads.length; t++) {
              let thread = this._threads[t];
              let isCurrent = t == this._threads.length - 1;
              sb.AppendFormat("=== THREAD {0}/{1} {2}===\n", t + 1, this._threads.length, isCurrent ? "(current) " : "");
              for (let i = 0; i < thread.callstack.length; i++) {
                  if (thread.callstack[i].type == PushPopType.Function)
                      sb.Append("  [FUNCTION] ");
                  else
                      sb.Append("  [TUNNEL] ");
                  let pointer = thread.callstack[i].currentPointer;
                  if (!pointer.isNull) {
                      sb.Append("<SOMEWHERE IN ");
                      if (pointer.container === null) {
                          return throwNullException("pointer.container");
                      }
                      sb.Append(pointer.container.path.toString());
                      sb.AppendLine(">");
                  }
              }
          }
          return sb.toString();
      }
  }
  (function (CallStack) {
      class Element {
          constructor(type, pointer, inExpressionEvaluation = false) {
              this.evaluationStackHeightWhenPushed = 0;
              this.functionStartInOutputStream = 0;
              this.currentPointer = pointer.copy();
              this.inExpressionEvaluation = inExpressionEvaluation;
              this.temporaryVariables = new Map();
              this.type = type;
          }
          Copy() {
              let copy = new Element(this.type, this.currentPointer, this.inExpressionEvaluation);
              copy.temporaryVariables = new Map(this.temporaryVariables);
              copy.evaluationStackHeightWhenPushed = this.evaluationStackHeightWhenPushed;
              copy.functionStartInOutputStream = this.functionStartInOutputStream;
              return copy;
          }
      }
      CallStack.Element = Element;
      class Thread {
          constructor() {
              this.threadIndex = 0;
              this.previousPointer = Pointer.Null;
              this.callstack = [];
              if (arguments[0] && arguments[1]) {
                  let jThreadObj = arguments[0];
                  let storyContext = arguments[1];
                  // TODO: (int) jThreadObj['threadIndex'] can raise;
                  this.threadIndex = parseInt(jThreadObj["threadIndex"]);
                  let jThreadCallstack = jThreadObj["callstack"];
                  for (let jElTok of jThreadCallstack) {
                      let jElementObj = jElTok;
                      // TODO: (int) jElementObj['type'] can raise;
                      let pushPopType = parseInt(jElementObj["type"]);
                      let pointer = Pointer.Null;
                      let currentContainerPathStr;
                      // TODO: jElementObj.TryGetValue ("cPath", out currentContainerPathStrToken);
                      let currentContainerPathStrToken = jElementObj["cPath"];
                      if (typeof currentContainerPathStrToken !== "undefined") {
                          currentContainerPathStr = currentContainerPathStrToken.toString();
                          let threadPointerResult = storyContext.ContentAtPath(new Path(currentContainerPathStr));
                          pointer.container = threadPointerResult.container;
                          pointer.index = parseInt(jElementObj["idx"]);
                          if (threadPointerResult.obj == null)
                              throw new Error("When loading state, internal story location couldn't be found: " +
                                  currentContainerPathStr +
                                  ". Has the story changed since this save data was created?");
                          else if (threadPointerResult.approximate) {
                              if (pointer.container === null) {
                                  return throwNullException("pointer.container");
                              }
                              storyContext.Warning("When loading state, exact internal story location couldn't be found: '" +
                                  currentContainerPathStr +
                                  "', so it was approximated to '" +
                                  pointer.container.path.toString() +
                                  "' to recover. Has the story changed since this save data was created?");
                          }
                      }
                      let inExpressionEvaluation = !!jElementObj["exp"];
                      let el = new Element(pushPopType, pointer, inExpressionEvaluation);
                      let temps = jElementObj["temp"];
                      if (typeof temps !== "undefined") {
                          el.temporaryVariables = JsonSerialisation.JObjectToDictionaryRuntimeObjs(temps);
                      }
                      else {
                          el.temporaryVariables.clear();
                      }
                      this.callstack.push(el);
                  }
                  let prevContentObjPath = jThreadObj["previousContentObject"];
                  if (typeof prevContentObjPath !== "undefined") {
                      let prevPath = new Path(prevContentObjPath.toString());
                      this.previousPointer = storyContext.PointerAtPath(prevPath);
                  }
              }
          }
          Copy() {
              let copy = new Thread();
              copy.threadIndex = this.threadIndex;
              for (let e of this.callstack) {
                  copy.callstack.push(e.Copy());
              }
              copy.previousPointer = this.previousPointer.copy();
              return copy;
          }
          WriteJson(writer) {
              writer.WriteObjectStart();
              writer.WritePropertyStart("callstack");
              writer.WriteArrayStart();
              for (let el of this.callstack) {
                  writer.WriteObjectStart();
                  if (!el.currentPointer.isNull) {
                      if (el.currentPointer.container === null) {
                          return throwNullException("el.currentPointer.container");
                      }
                      writer.WriteProperty("cPath", el.currentPointer.container.path.componentsString);
                      writer.WriteIntProperty("idx", el.currentPointer.index);
                  }
                  writer.WriteProperty("exp", el.inExpressionEvaluation);
                  writer.WriteIntProperty("type", el.type);
                  if (el.temporaryVariables.size > 0) {
                      writer.WritePropertyStart("temp");
                      JsonSerialisation.WriteDictionaryRuntimeObjs(writer, el.temporaryVariables);
                      writer.WritePropertyEnd();
                  }
                  writer.WriteObjectEnd();
              }
              writer.WriteArrayEnd();
              writer.WritePropertyEnd();
              writer.WriteIntProperty("threadIndex", this.threadIndex);
              if (!this.previousPointer.isNull) {
                  let resolvedPointer = this.previousPointer.Resolve();
                  if (resolvedPointer === null) {
                      return throwNullException("this.previousPointer.Resolve()");
                  }
                  writer.WriteProperty("previousContentObject", resolvedPointer.path.toString());
              }
              writer.WriteObjectEnd();
          }
      }
      CallStack.Thread = Thread;
  })(CallStack || (CallStack = {}));

  class VariablesState {
      constructor(callStack, listDefsOrigin) {
          // The way variableChangedEvent is a bit different than the reference implementation.
          // Originally it uses the C# += operator to add delegates, but in js we need to maintain
          // an actual collection of delegates (ie. callbacks) to register a new one, there is a
          // special ObserveVariableChange method below.
          this.variableChangedEventCallbacks = [];
          this.patch = null;
          this._batchObservingVariableChanges = false;
          this._defaultGlobalVariables = new Map();
          this._changedVariablesForBatchObs = new Set();
          this._globalVariables = new Map();
          this._callStack = callStack;
          this._listDefsOrigin = listDefsOrigin;
          // if es6 proxies are available, use them.
          try {
              // the proxy is used to allow direct manipulation of global variables.
              // It first tries to access the objects own property, and if none is
              // found it delegates the call to the $ method, defined below
              let p = new Proxy(this, {
                  get(target, name) {
                      return name in target ? target[name] : target.$(name);
                  },
                  set(target, name, value) {
                      if (name in target)
                          target[name] = value;
                      else
                          target.$(name, value);
                      return true; // returning a falsy value make the trap fail
                  },
              });
              return p;
          }
          catch (e) {
              // thr proxy object is not available in this context. we should warn the
              // dev but writting to the console feels a bit intrusive.
              // console.log("ES6 Proxy not available - direct manipulation of global variables can't work, use $() instead.");
          }
      }
      variableChangedEvent(variableName, newValue) {
          for (let callback of this.variableChangedEventCallbacks) {
              callback(variableName, newValue);
          }
      }
      get batchObservingVariableChanges() {
          return this._batchObservingVariableChanges;
      }
      set batchObservingVariableChanges(value) {
          this._batchObservingVariableChanges = value;
          if (value) {
              this._changedVariablesForBatchObs = new Set();
          }
          else {
              if (this._changedVariablesForBatchObs != null) {
                  for (let variableName of this._changedVariablesForBatchObs) {
                      let currentValue = this._globalVariables.get(variableName);
                      if (!currentValue) {
                          throwNullException("currentValue");
                      }
                      else {
                          this.variableChangedEvent(variableName, currentValue);
                      }
                  }
                  this._changedVariablesForBatchObs = null;
              }
          }
      }
      get callStack() {
          return this._callStack;
      }
      set callStack(callStack) {
          this._callStack = callStack;
      }
      // the original code uses a magic getter and setter for global variables,
      // allowing things like variableState['varname]. This is not quite possible
      // in js without a Proxy, so it is replaced with this $ function.
      $(variableName, value) {
          if (typeof value === "undefined") {
              let varContents = null;
              if (this.patch !== null) {
                  varContents = this.patch.TryGetGlobal(variableName, null);
                  if (varContents.exists)
                      return varContents.result.valueObject;
              }
              varContents = this._globalVariables.get(variableName);
              if (typeof varContents === "undefined") {
                  varContents = this._defaultGlobalVariables.get(variableName);
              }
              if (typeof varContents !== "undefined")
                  return varContents.valueObject;
              else
                  return null;
          }
          else {
              if (typeof this._defaultGlobalVariables.get(variableName) === "undefined")
                  throw new StoryException("Cannot assign to a variable (" +
                      variableName +
                      ") that hasn't been declared in the story");
              let val = Value.Create(value);
              if (val == null) {
                  if (value == null) {
                      throw new Error("Cannot pass null to VariableState");
                  }
                  else {
                      throw new Error("Invalid value passed to VariableState: " + value.toString());
                  }
              }
              this.SetGlobal(variableName, val);
          }
      }
      ApplyPatch() {
          if (this.patch === null) {
              return throwNullException("this.patch");
          }
          for (let [namedVarKey, namedVarValue] of this.patch.globals) {
              this._globalVariables.set(namedVarKey, namedVarValue);
          }
          if (this._changedVariablesForBatchObs !== null) {
              for (let name of this.patch.changedVariables) {
                  this._changedVariablesForBatchObs.add(name);
              }
          }
          this.patch = null;
      }
      SetJsonToken(jToken) {
          this._globalVariables.clear();
          for (let [varValKey, varValValue] of this._defaultGlobalVariables) {
              let loadedToken = jToken[varValKey];
              if (typeof loadedToken !== "undefined") {
                  let tokenInkObject = JsonSerialisation.JTokenToRuntimeObject(loadedToken);
                  if (tokenInkObject === null) {
                      return throwNullException("tokenInkObject");
                  }
                  this._globalVariables.set(varValKey, tokenInkObject);
              }
              else {
                  this._globalVariables.set(varValKey, varValValue);
              }
          }
      }
      WriteJson(writer) {
          writer.WriteObjectStart();
          for (let [keyValKey, keyValValue] of this._globalVariables) {
              let name = keyValKey;
              let val = keyValValue;
              if (VariablesState.dontSaveDefaultValues) {
                  if (this._defaultGlobalVariables.has(name)) {
                      let defaultVal = this._defaultGlobalVariables.get(name);
                      if (this.RuntimeObjectsEqual(val, defaultVal))
                          continue;
                  }
              }
              writer.WritePropertyStart(name);
              JsonSerialisation.WriteRuntimeObject(writer, val);
              writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
      }
      RuntimeObjectsEqual(obj1, obj2) {
          if (obj1 === null) {
              return throwNullException("obj1");
          }
          if (obj2 === null) {
              return throwNullException("obj2");
          }
          if (obj1.constructor !== obj2.constructor)
              return false;
          let boolVal = asOrNull(obj1, BoolValue);
          if (boolVal !== null) {
              return boolVal.value === asOrThrows(obj2, BoolValue).value;
          }
          let intVal = asOrNull(obj1, IntValue);
          if (intVal !== null) {
              return intVal.value === asOrThrows(obj2, IntValue).value;
          }
          let floatVal = asOrNull(obj1, FloatValue);
          if (floatVal !== null) {
              return floatVal.value === asOrThrows(obj2, FloatValue).value;
          }
          let val1 = asOrNull(obj1, Value);
          let val2 = asOrNull(obj2, Value);
          if (val1 !== null && val2 !== null) {
              if (isEquatable(val1.valueObject) && isEquatable(val2.valueObject)) {
                  return val1.valueObject.Equals(val2.valueObject);
              }
              else {
                  return val1.valueObject === val2.valueObject;
              }
          }
          throw new Error("FastRoughDefinitelyEquals: Unsupported runtime object type: " +
              obj1.constructor.name);
      }
      GetVariableWithName(name, contextIndex = -1) {
          let varValue = this.GetRawVariableWithName(name, contextIndex);
          // var varPointer = varValue as VariablePointerValue;
          let varPointer = asOrNull(varValue, VariablePointerValue);
          if (varPointer !== null) {
              varValue = this.ValueAtVariablePointer(varPointer);
          }
          return varValue;
      }
      TryGetDefaultVariableValue(name) {
          let val = tryGetValueFromMap(this._defaultGlobalVariables, name, null);
          return val.exists ? val.result : null;
      }
      GlobalVariableExistsWithName(name) {
          return (this._globalVariables.has(name) ||
              (this._defaultGlobalVariables !== null &&
                  this._defaultGlobalVariables.has(name)));
      }
      GetRawVariableWithName(name, contextIndex) {
          let varValue = null;
          if (contextIndex == 0 || contextIndex == -1) {
              let variableValue = null;
              if (this.patch !== null) {
                  variableValue = this.patch.TryGetGlobal(name, null);
                  if (variableValue.exists)
                      return variableValue.result;
              }
              // this is a conditional assignment
              variableValue = tryGetValueFromMap(this._globalVariables, name, null);
              if (variableValue.exists)
                  return variableValue.result;
              if (this._defaultGlobalVariables !== null) {
                  variableValue = tryGetValueFromMap(this._defaultGlobalVariables, name, null);
                  if (variableValue.exists)
                      return variableValue.result;
              }
              if (this._listDefsOrigin === null)
                  return throwNullException("VariablesState._listDefsOrigin");
              let listItemValue = this._listDefsOrigin.FindSingleItemListWithName(name);
              if (listItemValue)
                  return listItemValue;
          }
          varValue = this._callStack.GetTemporaryVariableWithName(name, contextIndex);
          return varValue;
      }
      ValueAtVariablePointer(pointer) {
          return this.GetVariableWithName(pointer.variableName, pointer.contextIndex);
      }
      Assign(varAss, value) {
          let name = varAss.variableName;
          if (name === null) {
              return throwNullException("name");
          }
          let contextIndex = -1;
          let setGlobal = false;
          if (varAss.isNewDeclaration) {
              setGlobal = varAss.isGlobal;
          }
          else {
              setGlobal = this.GlobalVariableExistsWithName(name);
          }
          if (varAss.isNewDeclaration) {
              // var varPointer = value as VariablePointerValue;
              let varPointer = asOrNull(value, VariablePointerValue);
              if (varPointer !== null) {
                  let fullyResolvedVariablePointer = this.ResolveVariablePointer(varPointer);
                  value = fullyResolvedVariablePointer;
              }
          }
          else {
              let existingPointer = null;
              do {
                  // existingPointer = GetRawVariableWithName (name, contextIndex) as VariablePointerValue;
                  existingPointer = asOrNull(this.GetRawVariableWithName(name, contextIndex), VariablePointerValue);
                  if (existingPointer != null) {
                      name = existingPointer.variableName;
                      contextIndex = existingPointer.contextIndex;
                      setGlobal = contextIndex == 0;
                  }
              } while (existingPointer != null);
          }
          if (setGlobal) {
              this.SetGlobal(name, value);
          }
          else {
              this._callStack.SetTemporaryVariable(name, value, varAss.isNewDeclaration, contextIndex);
          }
      }
      SnapshotDefaultGlobals() {
          this._defaultGlobalVariables = new Map(this._globalVariables);
      }
      RetainListOriginsForAssignment(oldValue, newValue) {
          let oldList = asOrThrows(oldValue, ListValue);
          let newList = asOrThrows(newValue, ListValue);
          if (oldList.value && newList.value && newList.value.Count == 0) {
              newList.value.SetInitialOriginNames(oldList.value.originNames);
          }
      }
      SetGlobal(variableName, value) {
          let oldValue = null;
          if (this.patch === null) {
              oldValue = tryGetValueFromMap(this._globalVariables, variableName, null);
          }
          if (this.patch !== null) {
              oldValue = this.patch.TryGetGlobal(variableName, null);
              if (!oldValue.exists) {
                  oldValue = tryGetValueFromMap(this._globalVariables, variableName, null);
              }
          }
          ListValue.RetainListOriginsForAssignment(oldValue.result, value);
          if (variableName === null) {
              return throwNullException("variableName");
          }
          if (this.patch !== null) {
              this.patch.SetGlobal(variableName, value);
          }
          else {
              this._globalVariables.set(variableName, value);
          }
          // TODO: Not sure !== is equivalent to !value.Equals(oldValue)
          if (this.variableChangedEvent !== null &&
              oldValue !== null &&
              value !== oldValue.result) {
              if (this.batchObservingVariableChanges) {
                  if (this._changedVariablesForBatchObs === null) {
                      return throwNullException("this._changedVariablesForBatchObs");
                  }
                  if (this.patch !== null) {
                      this.patch.AddChangedVariable(variableName);
                  }
                  else if (this._changedVariablesForBatchObs !== null) {
                      this._changedVariablesForBatchObs.add(variableName);
                  }
              }
              else {
                  this.variableChangedEvent(variableName, value);
              }
          }
      }
      ResolveVariablePointer(varPointer) {
          let contextIndex = varPointer.contextIndex;
          if (contextIndex == -1)
              contextIndex = this.GetContextIndexOfVariableNamed(varPointer.variableName);
          let valueOfVariablePointedTo = this.GetRawVariableWithName(varPointer.variableName, contextIndex);
          // var doubleRedirectionPointer = valueOfVariablePointedTo as VariablePointerValue;
          let doubleRedirectionPointer = asOrNull(valueOfVariablePointedTo, VariablePointerValue);
          if (doubleRedirectionPointer != null) {
              return doubleRedirectionPointer;
          }
          else {
              return new VariablePointerValue(varPointer.variableName, contextIndex);
          }
      }
      GetContextIndexOfVariableNamed(varName) {
          if (this.GlobalVariableExistsWithName(varName))
              return 0;
          return this._callStack.currentElementIndex;
      }
      /**
       * This function is specific to the js version of ink. It allows to register a
       * callback that will be called when a variable changes. The original code uses
       * `state.variableChangedEvent += callback` instead.
       *
       * @param {function} callback
       */
      ObserveVariableChange(callback) {
          this.variableChangedEventCallbacks.push(callback);
      }
  }
  VariablesState.dontSaveDefaultValues = true;

  // Taken from https://gist.github.com/blixt/f17b47c62508be59987b
  // Ink uses a seedable PRNG of which there is none in native javascript.
  class PRNG {
      constructor(seed) {
          this.seed = seed % 2147483647;
          if (this.seed <= 0)
              this.seed += 2147483646;
      }
      next() {
          return (this.seed = (this.seed * 16807) % 2147483647);
      }
      nextFloat() {
          return (this.next() - 1) / 2147483646;
      }
  }

  class StatePatch {
      constructor() {
          this._changedVariables = new Set();
          this._visitCounts = new Map();
          this._turnIndices = new Map();
          if (arguments.length === 1 && arguments[0] !== null) {
              let toCopy = arguments[0];
              this._globals = new Map(toCopy._globals);
              this._changedVariables = new Set(toCopy._changedVariables);
              this._visitCounts = new Map(toCopy._visitCounts);
              this._turnIndices = new Map(toCopy._turnIndices);
          }
          else {
              this._globals = new Map();
              this._changedVariables = new Set();
              this._visitCounts = new Map();
              this._turnIndices = new Map();
          }
      }
      get globals() {
          return this._globals;
      }
      get changedVariables() {
          return this._changedVariables;
      }
      get visitCounts() {
          return this._visitCounts;
      }
      get turnIndices() {
          return this._turnIndices;
      }
      TryGetGlobal(name, /* out */ value) {
          if (name !== null && this._globals.has(name)) {
              return { result: this._globals.get(name), exists: true };
          }
          return { result: value, exists: false };
      }
      SetGlobal(name, value) {
          this._globals.set(name, value);
      }
      AddChangedVariable(name) {
          return this._changedVariables.add(name);
      }
      TryGetVisitCount(container, /* out */ count) {
          if (this._visitCounts.has(container)) {
              return { result: this._visitCounts.get(container), exists: true };
          }
          return { result: count, exists: false };
      }
      SetVisitCount(container, count) {
          this._visitCounts.set(container, count);
      }
      SetTurnIndex(container, index) {
          this._turnIndices.set(container, index);
      }
      TryGetTurnIndex(container, /* out */ index) {
          if (this._turnIndices.has(container)) {
              return { result: this._turnIndices.get(container), exists: true };
          }
          return { result: index, exists: false };
      }
  }

  class SimpleJson {
      static TextToDictionary(text) {
          return new SimpleJson.Reader(text).ToDictionary();
      }
      static TextToArray(text) {
          return new SimpleJson.Reader(text).ToArray();
      }
  }
  (function (SimpleJson) {
      class Reader {
          constructor(text) {
              this._rootObject = JSON.parse(text);
          }
          ToDictionary() {
              return this._rootObject;
          }
          ToArray() {
              return this._rootObject;
          }
      }
      SimpleJson.Reader = Reader;
      // In C#, this class writes json tokens directly to a StringWriter or
      // another stream. Here, a temporary hierarchy is created in the form
      // of a javascript object, which is serialised in the `toString` method.
      // See individual methods and properties for more information.
      class Writer {
          constructor() {
              // In addition to `_stateStack` present in the original code,
              // this implementation of SimpleJson use two other stacks and two
              // temporary variables holding the current context.
              // Used to keep track of the current property name being built
              // with `WritePropertyNameStart`, `WritePropertyNameInner` and
              // `WritePropertyNameEnd`.
              this._currentPropertyName = null;
              // Used to keep track of the current string value being built
              // with `WriteStringStart`, `WriteStringInner` and
              // `WriteStringEnd`.
              this._currentString = null;
              this._stateStack = [];
              // Keep track of the current collection being built (either an array
              // or an object). For instance, at the '?' step during the hiarchy
              // creation, this hierarchy:
              // [3, {a: [b, ?]}] will have this corresponding stack:
              // (bottom) [Array, Object, Array] (top)
              this._collectionStack = [];
              // Keep track of the current property being assigned. For instance, at
              // the '?' step during the hiarchy creation, this hierarchy:
              // [3, {a: [b, {c: ?}]}] will have this corresponding stack:
              // (bottom) [a, c] (top)
              this._propertyNameStack = [];
              // Object containing the entire hiearchy.
              this._jsonObject = null;
          }
          WriteObject(inner) {
              this.WriteObjectStart();
              inner(this);
              this.WriteObjectEnd();
          }
          // Add a new object.
          WriteObjectStart() {
              this.StartNewObject(true);
              let newObject = {};
              if (this.state === SimpleJson.Writer.State.Property) {
                  // This object is created as the value of a property,
                  // inside an other object.
                  this.Assert(this.currentCollection !== null);
                  this.Assert(this.currentPropertyName !== null);
                  let propertyName = this._propertyNameStack.pop();
                  this.currentCollection[propertyName] = newObject;
                  this._collectionStack.push(newObject);
              }
              else if (this.state === SimpleJson.Writer.State.Array) {
                  // This object is created as the child of an array.
                  this.Assert(this.currentCollection !== null);
                  this.currentCollection.push(newObject);
                  this._collectionStack.push(newObject);
              }
              else {
                  // This object is the root object.
                  this.Assert(this.state === SimpleJson.Writer.State.None);
                  this._jsonObject = newObject;
                  this._collectionStack.push(newObject);
              }
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.Object));
          }
          WriteObjectEnd() {
              this.Assert(this.state === SimpleJson.Writer.State.Object);
              this._collectionStack.pop();
              this._stateStack.pop();
          }
          // Write a property name / value pair to the current object.
          WriteProperty(name, 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          innerOrContent) {
              this.WritePropertyStart(name);
              if (arguments[1] instanceof Function) {
                  let inner = arguments[1];
                  inner(this);
              }
              else {
                  let content = arguments[1];
                  this.Write(content);
              }
              this.WritePropertyEnd();
          }
          // Int and Float are separate calls, since there both are
          // numbers in JavaScript, but need to be handled differently.
          WriteIntProperty(name, content) {
              this.WritePropertyStart(name);
              this.WriteInt(content);
              this.WritePropertyEnd();
          }
          WriteFloatProperty(name, content) {
              this.WritePropertyStart(name);
              this.WriteFloat(content);
              this.WritePropertyEnd();
          }
          // Prepare a new property name, which will be use to add the
          // new object when calling _addToCurrentObject() from a Write
          // method.
          WritePropertyStart(name) {
              this.Assert(this.state === SimpleJson.Writer.State.Object);
              this._propertyNameStack.push(name);
              this.IncrementChildCount();
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.Property));
          }
          WritePropertyEnd() {
              this.Assert(this.state === SimpleJson.Writer.State.Property);
              this.Assert(this.childCount === 1);
              this._stateStack.pop();
          }
          // Prepare a new property name, except this time, the property name
          // will be created by concatenating all the strings passed to
          // WritePropertyNameInner.
          WritePropertyNameStart() {
              this.Assert(this.state === SimpleJson.Writer.State.Object);
              this.IncrementChildCount();
              this._currentPropertyName = "";
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.Property));
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.PropertyName));
          }
          WritePropertyNameEnd() {
              this.Assert(this.state === SimpleJson.Writer.State.PropertyName);
              this.Assert(this._currentPropertyName !== null);
              this._propertyNameStack.push(this._currentPropertyName);
              this._currentPropertyName = null;
              this._stateStack.pop();
          }
          WritePropertyNameInner(str) {
              this.Assert(this.state === SimpleJson.Writer.State.PropertyName);
              this.Assert(this._currentPropertyName !== null);
              this._currentPropertyName += str;
          }
          // Add a new array.
          WriteArrayStart() {
              this.StartNewObject(true);
              let newObject = [];
              if (this.state === SimpleJson.Writer.State.Property) {
                  // This array is created as the value of a property,
                  // inside an object.
                  this.Assert(this.currentCollection !== null);
                  this.Assert(this.currentPropertyName !== null);
                  let propertyName = this._propertyNameStack.pop();
                  this.currentCollection[propertyName] = newObject;
                  this._collectionStack.push(newObject);
              }
              else if (this.state === SimpleJson.Writer.State.Array) {
                  // This array is created as the child of another array.
                  this.Assert(this.currentCollection !== null);
                  this.currentCollection.push(newObject);
                  this._collectionStack.push(newObject);
              }
              else {
                  // This array is the root object.
                  this.Assert(this.state === SimpleJson.Writer.State.None);
                  this._jsonObject = newObject;
                  this._collectionStack.push(newObject);
              }
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.Array));
          }
          WriteArrayEnd() {
              this.Assert(this.state === SimpleJson.Writer.State.Array);
              this._collectionStack.pop();
              this._stateStack.pop();
          }
          // Add the value to the appropriate collection (array / object), given the current
          // context.
          Write(value, 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          escape = true) {
              if (value === null) {
                  console.error("Warning: trying to write a null string");
                  return;
              }
              this.StartNewObject(false);
              this._addToCurrentObject(value);
          }
          WriteBool(value) {
              if (value === null) {
                  return;
              }
              this.StartNewObject(false);
              this._addToCurrentObject(value);
          }
          WriteInt(value) {
              if (value === null) {
                  return;
              }
              this.StartNewObject(false);
              // Math.floor is used as a precaution:
              //     1. to ensure that the value is written as an integer
              //        (without a fractional part -> 1 instead of 1.0), even
              //        though it should be the default behaviour of
              //        JSON.serialize;
              //     2. to ensure that if a floating number is passed
              //        accidentally, it's converted to an integer.
              //
              // This guarantees savegame compatibility with the reference
              // implementation.
              this._addToCurrentObject(Math.floor(value));
          }
          // Since JSON doesn't support NaN and Infinity, these values
          // are converted here.
          WriteFloat(value) {
              if (value === null) {
                  return;
              }
              this.StartNewObject(false);
              if (value == Number.POSITIVE_INFINITY) {
                  this._addToCurrentObject(3.4e38);
              }
              else if (value == Number.NEGATIVE_INFINITY) {
                  this._addToCurrentObject(-3.4e38);
              }
              else if (isNaN(value)) {
                  this._addToCurrentObject(0.0);
              }
              else {
                  this._addToCurrentObject(value);
              }
          }
          WriteNull() {
              this.StartNewObject(false);
              this._addToCurrentObject(null);
          }
          // Prepare a string before adding it to the current collection in
          // WriteStringEnd(). The string will be a concatenation of all the
          // strings passed to WriteStringInner.
          WriteStringStart() {
              this.StartNewObject(false);
              this._currentString = "";
              this._stateStack.push(new SimpleJson.Writer.StateElement(SimpleJson.Writer.State.String));
          }
          WriteStringEnd() {
              this.Assert(this.state == SimpleJson.Writer.State.String);
              this._stateStack.pop();
              this._addToCurrentObject(this._currentString);
              this._currentString = null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          WriteStringInner(str, escape = true) {
              this.Assert(this.state === SimpleJson.Writer.State.String);
              if (str === null) {
                  console.error("Warning: trying to write a null string");
                  return;
              }
              this._currentString += str;
          }
          // Serialise the root object into a JSON string.
          ToString() {
              if (this._jsonObject === null) {
                  return "";
              }
              return JSON.stringify(this._jsonObject);
          }
          // Prepare the state stack when adding new objects / values.
          StartNewObject(container) {
              if (container) {
                  this.Assert(this.state === SimpleJson.Writer.State.None ||
                      this.state === SimpleJson.Writer.State.Property ||
                      this.state === SimpleJson.Writer.State.Array);
              }
              else {
                  this.Assert(this.state === SimpleJson.Writer.State.Property ||
                      this.state === SimpleJson.Writer.State.Array);
              }
              if (this.state === SimpleJson.Writer.State.Property) {
                  this.Assert(this.childCount === 0);
              }
              if (this.state === SimpleJson.Writer.State.Array ||
                  this.state === SimpleJson.Writer.State.Property) {
                  this.IncrementChildCount();
              }
          }
          // These getters peek all the different stacks.
          get state() {
              if (this._stateStack.length > 0) {
                  return this._stateStack[this._stateStack.length - 1].type;
              }
              else {
                  return SimpleJson.Writer.State.None;
              }
          }
          get childCount() {
              if (this._stateStack.length > 0) {
                  return this._stateStack[this._stateStack.length - 1].childCount;
              }
              else {
                  return 0;
              }
          }
          get currentCollection() {
              if (this._collectionStack.length > 0) {
                  return this._collectionStack[this._collectionStack.length - 1];
              }
              else {
                  return null;
              }
          }
          get currentPropertyName() {
              if (this._propertyNameStack.length > 0) {
                  return this._propertyNameStack[this._propertyNameStack.length - 1];
              }
              else {
                  return null;
              }
          }
          IncrementChildCount() {
              this.Assert(this._stateStack.length > 0);
              let currEl = this._stateStack.pop();
              currEl.childCount++;
              this._stateStack.push(currEl);
          }
          Assert(condition) {
              if (!condition)
                  throw Error("Assert failed while writing JSON");
          }
          // This method did not exist in the original C# code. It adds
          // the given value to the current collection (used by Write methods).
          _addToCurrentObject(value) {
              this.Assert(this.currentCollection !== null);
              if (this.state === SimpleJson.Writer.State.Array) {
                  this.Assert(Array.isArray(this.currentCollection));
                  this.currentCollection.push(value);
              }
              else if (this.state === SimpleJson.Writer.State.Property) {
                  this.Assert(!Array.isArray(this.currentCollection));
                  this.Assert(this.currentPropertyName !== null);
                  this.currentCollection[this.currentPropertyName] = value;
                  this._propertyNameStack.pop();
              }
          }
      }
      SimpleJson.Writer = Writer;
      (function (Writer) {
          (function (State) {
              State[State["None"] = 0] = "None";
              State[State["Object"] = 1] = "Object";
              State[State["Array"] = 2] = "Array";
              State[State["Property"] = 3] = "Property";
              State[State["PropertyName"] = 4] = "PropertyName";
              State[State["String"] = 5] = "String";
          })(Writer.State || (Writer.State = {}));
          class StateElement {
              constructor(type) {
                  this.type = SimpleJson.Writer.State.None;
                  this.childCount = 0;
                  this.type = type;
              }
          }
          Writer.StateElement = StateElement;
      })(Writer = SimpleJson.Writer || (SimpleJson.Writer = {}));
  })(SimpleJson || (SimpleJson = {}));

  class Flow {
      constructor() {
          let name = arguments[0];
          let story = arguments[1];
          this.name = name;
          this.callStack = new CallStack(story);
          if (arguments[2]) {
              let jObject = arguments[2];
              this.callStack.SetJsonToken(jObject["callstack"], story);
              this.outputStream = JsonSerialisation.JArrayToRuntimeObjList(jObject["outputStream"]);
              this.currentChoices = JsonSerialisation.JArrayToRuntimeObjList(jObject["currentChoices"]);
              let jChoiceThreadsObj = jObject["choiceThreads"];
              if (typeof jChoiceThreadsObj !== "undefined") {
                  this.LoadFlowChoiceThreads(jChoiceThreadsObj, story);
              }
          }
          else {
              this.outputStream = [];
              this.currentChoices = [];
          }
      }
      WriteJson(writer) {
          writer.WriteObjectStart();
          writer.WriteProperty("callstack", (w) => this.callStack.WriteJson(w));
          writer.WriteProperty("outputStream", (w) => JsonSerialisation.WriteListRuntimeObjs(w, this.outputStream));
          let hasChoiceThreads = false;
          for (let c of this.currentChoices) {
              if (c.threadAtGeneration === null)
                  return throwNullException("c.threadAtGeneration");
              c.originalThreadIndex = c.threadAtGeneration.threadIndex;
              if (this.callStack.ThreadWithIndex(c.originalThreadIndex) === null) {
                  if (!hasChoiceThreads) {
                      hasChoiceThreads = true;
                      writer.WritePropertyStart("choiceThreads");
                      writer.WriteObjectStart();
                  }
                  writer.WritePropertyStart(c.originalThreadIndex);
                  c.threadAtGeneration.WriteJson(writer);
                  writer.WritePropertyEnd();
              }
          }
          if (hasChoiceThreads) {
              writer.WriteObjectEnd();
              writer.WritePropertyEnd();
          }
          writer.WriteProperty("currentChoices", (w) => {
              w.WriteArrayStart();
              for (let c of this.currentChoices) {
                  JsonSerialisation.WriteChoice(w, c);
              }
              w.WriteArrayEnd();
          });
          writer.WriteObjectEnd();
      }
      LoadFlowChoiceThreads(jChoiceThreads, story) {
          for (let choice of this.currentChoices) {
              let foundActiveThread = this.callStack.ThreadWithIndex(choice.originalThreadIndex);
              if (foundActiveThread !== null) {
                  choice.threadAtGeneration = foundActiveThread.Copy();
              }
              else {
                  let jSavedChoiceThread = jChoiceThreads[`${choice.originalThreadIndex}`];
                  choice.threadAtGeneration = new CallStack.Thread(jSavedChoiceThread, story);
              }
          }
      }
  }

  class StoryState {
      constructor(story) {
          this.kInkSaveStateVersion = 9;
          this.kMinCompatibleLoadVersion = 8;
          this.onDidLoadState = null;
          this._currentErrors = null;
          this._currentWarnings = null;
          this.divertedPointer = Pointer.Null;
          this._currentTurnIndex = 0;
          this.storySeed = 0;
          this.previousRandom = 0;
          this.didSafeExit = false;
          this._currentText = null;
          this._currentTags = null;
          this._outputStreamTextDirty = true;
          this._outputStreamTagsDirty = true;
          this._patch = null;
          this._namedFlows = null;
          this.kDefaultFlowName = "DEFAULT_FLOW";
          this.story = story;
          this._currentFlow = new Flow(this.kDefaultFlowName, story);
          this.OutputStreamDirty();
          this._evaluationStack = [];
          this._variablesState = new VariablesState(this.callStack, story.listDefinitions);
          this._visitCounts = new Map();
          this._turnIndices = new Map();
          this.currentTurnIndex = -1;
          let timeSeed = new Date().getTime();
          this.storySeed = new PRNG(timeSeed).next() % 100;
          this.previousRandom = 0;
          this.GoToStart();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ToJson(indented = false) {
          let writer = new SimpleJson.Writer();
          this.WriteJson(writer);
          return writer.ToString();
      }
      toJson(indented = false) {
          return this.ToJson(indented);
      }
      LoadJson(json) {
          let jObject = SimpleJson.TextToDictionary(json);
          this.LoadJsonObj(jObject);
          if (this.onDidLoadState !== null)
              this.onDidLoadState();
      }
      VisitCountAtPathString(pathString) {
          let visitCountOut;
          if (this._patch !== null) {
              let container = this.story.ContentAtPath(new Path(pathString)).container;
              if (container === null)
                  throw new Error("Content at path not found: " + pathString);
              visitCountOut = this._patch.TryGetVisitCount(container, 0);
              if (visitCountOut.exists)
                  return visitCountOut.result;
          }
          visitCountOut = tryGetValueFromMap(this._visitCounts, pathString, null);
          if (visitCountOut.exists)
              return visitCountOut.result;
          return 0;
      }
      VisitCountForContainer(container) {
          if (container === null) {
              return throwNullException("container");
          }
          if (!container.visitsShouldBeCounted) {
              this.story.Error("Read count for target (" +
                  container.name +
                  " - on " +
                  container.debugMetadata +
                  ") unknown. The story may need to be compiled with countAllVisits flag (-c).");
              return 0;
          }
          if (this._patch !== null) {
              let count = this._patch.TryGetVisitCount(container, 0);
              if (count.exists) {
                  return count.result;
              }
          }
          let containerPathStr = container.path.toString();
          let count2 = tryGetValueFromMap(this._visitCounts, containerPathStr, null);
          if (count2.exists) {
              return count2.result;
          }
          return 0;
      }
      IncrementVisitCountForContainer(container) {
          if (this._patch !== null) {
              let currCount = this.VisitCountForContainer(container);
              currCount++;
              this._patch.SetVisitCount(container, currCount);
              return;
          }
          let containerPathStr = container.path.toString();
          let count = tryGetValueFromMap(this._visitCounts, containerPathStr, null);
          if (count.exists) {
              this._visitCounts.set(containerPathStr, count.result + 1);
          }
          else {
              this._visitCounts.set(containerPathStr, 1);
          }
      }
      RecordTurnIndexVisitToContainer(container) {
          if (this._patch !== null) {
              this._patch.SetTurnIndex(container, this.currentTurnIndex);
              return;
          }
          let containerPathStr = container.path.toString();
          this._turnIndices.set(containerPathStr, this.currentTurnIndex);
      }
      TurnsSinceForContainer(container) {
          if (!container.turnIndexShouldBeCounted) {
              this.story.Error("TURNS_SINCE() for target (" +
                  container.name +
                  " - on " +
                  container.debugMetadata +
                  ") unknown. The story may need to be compiled with countAllVisits flag (-c).");
          }
          if (this._patch !== null) {
              let index = this._patch.TryGetTurnIndex(container, 0);
              if (index.exists) {
                  return this.currentTurnIndex - index.result;
              }
          }
          let containerPathStr = container.path.toString();
          let index2 = tryGetValueFromMap(this._turnIndices, containerPathStr, 0);
          if (index2.exists) {
              return this.currentTurnIndex - index2.result;
          }
          else {
              return -1;
          }
      }
      get callstackDepth() {
          return this.callStack.depth;
      }
      get outputStream() {
          return this._currentFlow.outputStream;
      }
      get currentChoices() {
          // If we can continue generating text content rather than choices,
          // then we reflect the choice list as being empty, since choices
          // should always come at the end.
          if (this.canContinue)
              return [];
          return this._currentFlow.currentChoices;
      }
      get generatedChoices() {
          return this._currentFlow.currentChoices;
      }
      get currentErrors() {
          return this._currentErrors;
      }
      get currentWarnings() {
          return this._currentWarnings;
      }
      get variablesState() {
          return this._variablesState;
      }
      set variablesState(value) {
          this._variablesState = value;
      }
      get callStack() {
          return this._currentFlow.callStack;
      }
      get evaluationStack() {
          return this._evaluationStack;
      }
      get currentTurnIndex() {
          return this._currentTurnIndex;
      }
      set currentTurnIndex(value) {
          this._currentTurnIndex = value;
      }
      get currentPathString() {
          let pointer = this.currentPointer;
          if (pointer.isNull) {
              return null;
          }
          else {
              if (pointer.path === null) {
                  return throwNullException("pointer.path");
              }
              return pointer.path.toString();
          }
      }
      get currentPointer() {
          return this.callStack.currentElement.currentPointer.copy();
      }
      set currentPointer(value) {
          this.callStack.currentElement.currentPointer = value.copy();
      }
      get previousPointer() {
          return this.callStack.currentThread.previousPointer.copy();
      }
      set previousPointer(value) {
          this.callStack.currentThread.previousPointer = value.copy();
      }
      get canContinue() {
          return !this.currentPointer.isNull && !this.hasError;
      }
      get hasError() {
          return this.currentErrors != null && this.currentErrors.length > 0;
      }
      get hasWarning() {
          return this.currentWarnings != null && this.currentWarnings.length > 0;
      }
      get currentText() {
          if (this._outputStreamTextDirty) {
              let sb = new StringBuilder();
              for (let outputObj of this.outputStream) {
                  // var textContent = outputObj as StringValue;
                  let textContent = asOrNull(outputObj, StringValue);
                  if (textContent !== null) {
                      sb.Append(textContent.value);
                  }
              }
              this._currentText = this.CleanOutputWhitespace(sb.toString());
              this._outputStreamTextDirty = false;
          }
          return this._currentText;
      }
      CleanOutputWhitespace(str) {
          let sb = new StringBuilder();
          let currentWhitespaceStart = -1;
          let startOfLine = 0;
          for (let i = 0; i < str.length; i++) {
              let c = str.charAt(i);
              let isInlineWhitespace = c == " " || c == "\t";
              if (isInlineWhitespace && currentWhitespaceStart == -1)
                  currentWhitespaceStart = i;
              if (!isInlineWhitespace) {
                  if (c != "\n" &&
                      currentWhitespaceStart > 0 &&
                      currentWhitespaceStart != startOfLine) {
                      sb.Append(" ");
                  }
                  currentWhitespaceStart = -1;
              }
              if (c == "\n")
                  startOfLine = i + 1;
              if (!isInlineWhitespace)
                  sb.Append(c);
          }
          return sb.toString();
      }
      get currentTags() {
          if (this._outputStreamTagsDirty) {
              this._currentTags = [];
              for (let outputObj of this.outputStream) {
                  // var tag = outputObj as Tag;
                  let tag = asOrNull(outputObj, Tag);
                  if (tag !== null) {
                      this._currentTags.push(tag.text);
                  }
              }
              this._outputStreamTagsDirty = false;
          }
          return this._currentTags;
      }
      get currentFlowName() {
          return this._currentFlow.name;
      }
      get inExpressionEvaluation() {
          return this.callStack.currentElement.inExpressionEvaluation;
      }
      set inExpressionEvaluation(value) {
          this.callStack.currentElement.inExpressionEvaluation = value;
      }
      GoToStart() {
          this.callStack.currentElement.currentPointer = Pointer.StartOf(this.story.mainContentContainer);
      }
      SwitchFlow_Internal(flowName) {
          if (flowName === null)
              throw new Error("Must pass a non-null string to Story.SwitchFlow");
          if (this._namedFlows === null) {
              this._namedFlows = new Map();
              this._namedFlows.set(this.kDefaultFlowName, this._currentFlow);
          }
          if (flowName === this._currentFlow.name) {
              return;
          }
          let flow;
          let content = tryGetValueFromMap(this._namedFlows, flowName, null);
          if (content.exists) {
              flow = content.result;
          }
          else {
              flow = new Flow(flowName, this.story);
              this._namedFlows.set(flowName, flow);
          }
          this._currentFlow = flow;
          this.variablesState.callStack = this._currentFlow.callStack;
          this.OutputStreamDirty();
      }
      SwitchToDefaultFlow_Internal() {
          if (this._namedFlows === null)
              return;
          this.SwitchFlow_Internal(this.kDefaultFlowName);
      }
      RemoveFlow_Internal(flowName) {
          if (flowName === null)
              throw new Error("Must pass a non-null string to Story.DestroyFlow");
          if (flowName === this.kDefaultFlowName)
              throw new Error("Cannot destroy default flow");
          if (this._currentFlow.name === flowName) {
              this.SwitchToDefaultFlow_Internal();
          }
          if (this._namedFlows === null)
              return throwNullException("this._namedFlows");
          this._namedFlows.delete(flowName);
      }
      CopyAndStartPatching() {
          let copy = new StoryState(this.story);
          copy._patch = new StatePatch(this._patch);
          copy._currentFlow.name = this._currentFlow.name;
          copy._currentFlow.callStack = new CallStack(this._currentFlow.callStack);
          copy._currentFlow.currentChoices.push(...this._currentFlow.currentChoices);
          copy._currentFlow.outputStream.push(...this._currentFlow.outputStream);
          copy.OutputStreamDirty();
          if (this._namedFlows !== null) {
              copy._namedFlows = new Map();
              for (let [namedFlowKey, namedFlowValue] of this._namedFlows) {
                  copy._namedFlows.set(namedFlowKey, namedFlowValue);
              }
              copy._namedFlows.set(this._currentFlow.name, copy._currentFlow);
          }
          if (this.hasError) {
              copy._currentErrors = [];
              copy._currentErrors.push(...(this.currentErrors || []));
          }
          if (this.hasWarning) {
              copy._currentWarnings = [];
              copy._currentWarnings.push(...(this.currentWarnings || []));
          }
          copy.variablesState = this.variablesState;
          copy.variablesState.callStack = copy.callStack;
          copy.variablesState.patch = copy._patch;
          copy.evaluationStack.push(...this.evaluationStack);
          if (!this.divertedPointer.isNull)
              copy.divertedPointer = this.divertedPointer.copy();
          copy.previousPointer = this.previousPointer.copy();
          copy._visitCounts = this._visitCounts;
          copy._turnIndices = this._turnIndices;
          copy.currentTurnIndex = this.currentTurnIndex;
          copy.storySeed = this.storySeed;
          copy.previousRandom = this.previousRandom;
          copy.didSafeExit = this.didSafeExit;
          return copy;
      }
      RestoreAfterPatch() {
          this.variablesState.callStack = this.callStack;
          this.variablesState.patch = this._patch;
      }
      ApplyAnyPatch() {
          if (this._patch === null)
              return;
          this.variablesState.ApplyPatch();
          for (let [key, value] of this._patch.visitCounts)
              this.ApplyCountChanges(key, value, true);
          for (let [key, value] of this._patch.turnIndices)
              this.ApplyCountChanges(key, value, false);
          this._patch = null;
      }
      ApplyCountChanges(container, newCount, isVisit) {
          let counts = isVisit ? this._visitCounts : this._turnIndices;
          counts.set(container.path.toString(), newCount);
      }
      WriteJson(writer) {
          writer.WriteObjectStart();
          writer.WritePropertyStart("flows");
          writer.WriteObjectStart();
          // NOTE: Never pass `WriteJson` directly as an argument to `WriteProperty`.
          // Call it inside a function to make sure `this` is correctly bound
          // and passed down the call hierarchy.
          if (this._namedFlows !== null) {
              for (let [namedFlowKey, namedFlowValue] of this._namedFlows) {
                  writer.WriteProperty(namedFlowKey, (w) => namedFlowValue.WriteJson(w));
              }
          }
          else {
              writer.WriteProperty(this._currentFlow.name, (w) => this._currentFlow.WriteJson(w));
          }
          writer.WriteObjectEnd();
          writer.WritePropertyEnd();
          writer.WriteProperty("currentFlowName", this._currentFlow.name);
          writer.WriteProperty("variablesState", (w) => this.variablesState.WriteJson(w));
          writer.WriteProperty("evalStack", (w) => JsonSerialisation.WriteListRuntimeObjs(w, this.evaluationStack));
          if (!this.divertedPointer.isNull) {
              if (this.divertedPointer.path === null) {
                  return throwNullException("divertedPointer");
              }
              writer.WriteProperty("currentDivertTarget", this.divertedPointer.path.componentsString);
          }
          writer.WriteProperty("visitCounts", (w) => JsonSerialisation.WriteIntDictionary(w, this._visitCounts));
          writer.WriteProperty("turnIndices", (w) => JsonSerialisation.WriteIntDictionary(w, this._turnIndices));
          writer.WriteIntProperty("turnIdx", this.currentTurnIndex);
          writer.WriteIntProperty("storySeed", this.storySeed);
          writer.WriteIntProperty("previousRandom", this.previousRandom);
          writer.WriteIntProperty("inkSaveVersion", this.kInkSaveStateVersion);
          writer.WriteIntProperty("inkFormatVersion", Story.inkVersionCurrent);
          writer.WriteObjectEnd();
      }
      LoadJsonObj(value) {
          let jObject = value;
          let jSaveVersion = jObject["inkSaveVersion"];
          if (jSaveVersion == null) {
              throw new Error("ink save format incorrect, can't load.");
          }
          else if (parseInt(jSaveVersion) < this.kMinCompatibleLoadVersion) {
              throw new Error("Ink save format isn't compatible with the current version (saw '" +
                  jSaveVersion +
                  "', but minimum is " +
                  this.kMinCompatibleLoadVersion +
                  "), so can't load.");
          }
          let flowsObj = jObject["flows"];
          if (flowsObj != null) {
              let flowsObjDict = flowsObj;
              // Single default flow
              if (Object.keys(flowsObjDict).length === 1) {
                  this._namedFlows = null;
              }
              else if (this._namedFlows === null) {
                  this._namedFlows = new Map();
              }
              else {
                  this._namedFlows.clear();
              }
              let flowsObjDictEntries = Object.entries(flowsObjDict);
              for (let [namedFlowObjKey, namedFlowObjValue] of flowsObjDictEntries) {
                  let name = namedFlowObjKey;
                  let flowObj = namedFlowObjValue;
                  let flow = new Flow(name, this.story, flowObj);
                  if (Object.keys(flowsObjDict).length === 1) {
                      this._currentFlow = new Flow(name, this.story, flowObj);
                  }
                  else {
                      if (this._namedFlows === null)
                          return throwNullException("this._namedFlows");
                      this._namedFlows.set(name, flow);
                  }
              }
              if (this._namedFlows != null && this._namedFlows.size > 1) {
                  let currFlowName = jObject["currentFlowName"];
                  // Adding a bang at the end, because we're trusting the save, as
                  // done in upstream.  If the save is corrupted, the execution
                  // is undefined.
                  this._currentFlow = this._namedFlows.get(currFlowName);
              }
          }
          else {
              this._namedFlows = null;
              this._currentFlow.name = this.kDefaultFlowName;
              this._currentFlow.callStack.SetJsonToken(jObject["callstackThreads"], this.story);
              this._currentFlow.outputStream = JsonSerialisation.JArrayToRuntimeObjList(jObject["outputStream"]);
              this._currentFlow.currentChoices = JsonSerialisation.JArrayToRuntimeObjList(jObject["currentChoices"]);
              let jChoiceThreadsObj = jObject["choiceThreads"];
              this._currentFlow.LoadFlowChoiceThreads(jChoiceThreadsObj, this.story);
          }
          this.OutputStreamDirty();
          this.variablesState.SetJsonToken(jObject["variablesState"]);
          this.variablesState.callStack = this._currentFlow.callStack;
          this._evaluationStack = JsonSerialisation.JArrayToRuntimeObjList(jObject["evalStack"]);
          let currentDivertTargetPath = jObject["currentDivertTarget"];
          if (currentDivertTargetPath != null) {
              let divertPath = new Path(currentDivertTargetPath.toString());
              this.divertedPointer = this.story.PointerAtPath(divertPath);
          }
          this._visitCounts = JsonSerialisation.JObjectToIntDictionary(jObject["visitCounts"]);
          this._turnIndices = JsonSerialisation.JObjectToIntDictionary(jObject["turnIndices"]);
          this.currentTurnIndex = parseInt(jObject["turnIdx"]);
          this.storySeed = parseInt(jObject["storySeed"]);
          this.previousRandom = parseInt(jObject["previousRandom"]);
      }
      ResetErrors() {
          this._currentErrors = null;
          this._currentWarnings = null;
      }
      ResetOutput(objs = null) {
          this.outputStream.length = 0;
          if (objs !== null)
              this.outputStream.push(...objs);
          this.OutputStreamDirty();
      }
      PushToOutputStream(obj) {
          // var text = obj as StringValue;
          let text = asOrNull(obj, StringValue);
          if (text !== null) {
              let listText = this.TrySplittingHeadTailWhitespace(text);
              if (listText !== null) {
                  for (let textObj of listText) {
                      this.PushToOutputStreamIndividual(textObj);
                  }
                  this.OutputStreamDirty();
                  return;
              }
          }
          this.PushToOutputStreamIndividual(obj);
          this.OutputStreamDirty();
      }
      PopFromOutputStream(count) {
          this.outputStream.splice(this.outputStream.length - count, count);
          this.OutputStreamDirty();
      }
      TrySplittingHeadTailWhitespace(single) {
          let str = single.value;
          if (str === null) {
              return throwNullException("single.value");
          }
          let headFirstNewlineIdx = -1;
          let headLastNewlineIdx = -1;
          for (let i = 0; i < str.length; i++) {
              let c = str[i];
              if (c == "\n") {
                  if (headFirstNewlineIdx == -1)
                      headFirstNewlineIdx = i;
                  headLastNewlineIdx = i;
              }
              else if (c == " " || c == "\t")
                  continue;
              else
                  break;
          }
          let tailLastNewlineIdx = -1;
          let tailFirstNewlineIdx = -1;
          for (let i = str.length - 1; i >= 0; i--) {
              let c = str[i];
              if (c == "\n") {
                  if (tailLastNewlineIdx == -1)
                      tailLastNewlineIdx = i;
                  tailFirstNewlineIdx = i;
              }
              else if (c == " " || c == "\t")
                  continue;
              else
                  break;
          }
          // No splitting to be done?
          if (headFirstNewlineIdx == -1 && tailLastNewlineIdx == -1)
              return null;
          let listTexts = [];
          let innerStrStart = 0;
          let innerStrEnd = str.length;
          if (headFirstNewlineIdx != -1) {
              if (headFirstNewlineIdx > 0) {
                  let leadingSpaces = new StringValue(str.substring(0, headFirstNewlineIdx));
                  listTexts.push(leadingSpaces);
              }
              listTexts.push(new StringValue("\n"));
              innerStrStart = headLastNewlineIdx + 1;
          }
          if (tailLastNewlineIdx != -1) {
              innerStrEnd = tailFirstNewlineIdx;
          }
          if (innerStrEnd > innerStrStart) {
              let innerStrText = str.substring(innerStrStart, innerStrEnd - innerStrStart);
              listTexts.push(new StringValue(innerStrText));
          }
          if (tailLastNewlineIdx != -1 && tailFirstNewlineIdx > headLastNewlineIdx) {
              listTexts.push(new StringValue("\n"));
              if (tailLastNewlineIdx < str.length - 1) {
                  let numSpaces = str.length - tailLastNewlineIdx - 1;
                  let trailingSpaces = new StringValue(str.substring(tailLastNewlineIdx + 1, numSpaces));
                  listTexts.push(trailingSpaces);
              }
          }
          return listTexts;
      }
      PushToOutputStreamIndividual(obj) {
          let glue = asOrNull(obj, Glue);
          let text = asOrNull(obj, StringValue);
          let includeInOutput = true;
          if (glue) {
              this.TrimNewlinesFromOutputStream();
              includeInOutput = true;
          }
          else if (text) {
              let functionTrimIndex = -1;
              let currEl = this.callStack.currentElement;
              if (currEl.type == PushPopType.Function) {
                  functionTrimIndex = currEl.functionStartInOutputStream;
              }
              let glueTrimIndex = -1;
              for (let i = this.outputStream.length - 1; i >= 0; i--) {
                  let o = this.outputStream[i];
                  let c = o instanceof ControlCommand ? o : null;
                  let g = o instanceof Glue ? o : null;
                  if (g != null) {
                      glueTrimIndex = i;
                      break;
                  }
                  else if (c != null &&
                      c.commandType == ControlCommand.CommandType.BeginString) {
                      if (i >= functionTrimIndex) {
                          functionTrimIndex = -1;
                      }
                      break;
                  }
              }
              let trimIndex = -1;
              if (glueTrimIndex != -1 && functionTrimIndex != -1)
                  trimIndex = Math.min(functionTrimIndex, glueTrimIndex);
              else if (glueTrimIndex != -1)
                  trimIndex = glueTrimIndex;
              else
                  trimIndex = functionTrimIndex;
              if (trimIndex != -1) {
                  if (text.isNewline) {
                      includeInOutput = false;
                  }
                  else if (text.isNonWhitespace) {
                      if (glueTrimIndex > -1)
                          this.RemoveExistingGlue();
                      if (functionTrimIndex > -1) {
                          let callStackElements = this.callStack.elements;
                          for (let i = callStackElements.length - 1; i >= 0; i--) {
                              let el = callStackElements[i];
                              if (el.type == PushPopType.Function) {
                                  el.functionStartInOutputStream = -1;
                              }
                              else {
                                  break;
                              }
                          }
                      }
                  }
              }
              else if (text.isNewline) {
                  if (this.outputStreamEndsInNewline || !this.outputStreamContainsContent)
                      includeInOutput = false;
              }
          }
          if (includeInOutput) {
              if (obj === null) {
                  return throwNullException("obj");
              }
              this.outputStream.push(obj);
              this.OutputStreamDirty();
          }
      }
      TrimNewlinesFromOutputStream() {
          let removeWhitespaceFrom = -1;
          let i = this.outputStream.length - 1;
          while (i >= 0) {
              let obj = this.outputStream[i];
              let cmd = asOrNull(obj, ControlCommand);
              let txt = asOrNull(obj, StringValue);
              if (cmd != null || (txt != null && txt.isNonWhitespace)) {
                  break;
              }
              else if (txt != null && txt.isNewline) {
                  removeWhitespaceFrom = i;
              }
              i--;
          }
          // Remove the whitespace
          if (removeWhitespaceFrom >= 0) {
              i = removeWhitespaceFrom;
              while (i < this.outputStream.length) {
                  let text = asOrNull(this.outputStream[i], StringValue);
                  if (text) {
                      this.outputStream.splice(i, 1);
                  }
                  else {
                      i++;
                  }
              }
          }
          this.OutputStreamDirty();
      }
      RemoveExistingGlue() {
          for (let i = this.outputStream.length - 1; i >= 0; i--) {
              let c = this.outputStream[i];
              if (c instanceof Glue) {
                  this.outputStream.splice(i, 1);
              }
              else if (c instanceof ControlCommand) {
                  break;
              }
          }
          this.OutputStreamDirty();
      }
      get outputStreamEndsInNewline() {
          if (this.outputStream.length > 0) {
              for (let i = this.outputStream.length - 1; i >= 0; i--) {
                  let obj = this.outputStream[i];
                  if (obj instanceof ControlCommand)
                      break;
                  let text = this.outputStream[i];
                  if (text instanceof StringValue) {
                      if (text.isNewline)
                          return true;
                      else if (text.isNonWhitespace)
                          break;
                  }
              }
          }
          return false;
      }
      get outputStreamContainsContent() {
          for (let content of this.outputStream) {
              if (content instanceof StringValue)
                  return true;
          }
          return false;
      }
      get inStringEvaluation() {
          for (let i = this.outputStream.length - 1; i >= 0; i--) {
              let cmd = asOrNull(this.outputStream[i], ControlCommand);
              if (cmd instanceof ControlCommand &&
                  cmd.commandType == ControlCommand.CommandType.BeginString) {
                  return true;
              }
          }
          return false;
      }
      PushEvaluationStack(obj) {
          // var listValue = obj as ListValue;
          let listValue = asOrNull(obj, ListValue);
          if (listValue) {
              // Update origin when list is has something to indicate the list origin
              let rawList = listValue.value;
              if (rawList === null) {
                  return throwNullException("rawList");
              }
              if (rawList.originNames != null) {
                  if (!rawList.origins)
                      rawList.origins = [];
                  rawList.origins.length = 0;
                  for (let n of rawList.originNames) {
                      if (this.story.listDefinitions === null)
                          return throwNullException("StoryState.story.listDefinitions");
                      let def = this.story.listDefinitions.TryListGetDefinition(n, null);
                      if (def.result === null)
                          return throwNullException("StoryState def.result");
                      if (rawList.origins.indexOf(def.result) < 0)
                          rawList.origins.push(def.result);
                  }
              }
          }
          if (obj === null) {
              return throwNullException("obj");
          }
          this.evaluationStack.push(obj);
      }
      PopEvaluationStack(numberOfObjects) {
          if (typeof numberOfObjects === "undefined") {
              let obj = this.evaluationStack.pop();
              return nullIfUndefined(obj);
          }
          else {
              if (numberOfObjects > this.evaluationStack.length) {
                  throw new Error("trying to pop too many objects");
              }
              let popped = this.evaluationStack.splice(this.evaluationStack.length - numberOfObjects, numberOfObjects);
              return nullIfUndefined(popped);
          }
      }
      PeekEvaluationStack() {
          return this.evaluationStack[this.evaluationStack.length - 1];
      }
      ForceEnd() {
          this.callStack.Reset();
          this._currentFlow.currentChoices.length = 0;
          this.currentPointer = Pointer.Null;
          this.previousPointer = Pointer.Null;
          this.didSafeExit = true;
      }
      TrimWhitespaceFromFunctionEnd() {
          Debug.Assert(this.callStack.currentElement.type == PushPopType.Function);
          let functionStartPoint = this.callStack.currentElement
              .functionStartInOutputStream;
          if (functionStartPoint == -1) {
              functionStartPoint = 0;
          }
          for (let i = this.outputStream.length - 1; i >= functionStartPoint; i--) {
              let obj = this.outputStream[i];
              let txt = asOrNull(obj, StringValue);
              let cmd = asOrNull(obj, ControlCommand);
              if (txt == null)
                  continue;
              if (cmd)
                  break;
              if (txt.isNewline || txt.isInlineWhitespace) {
                  this.outputStream.splice(i, 1);
                  this.OutputStreamDirty();
              }
              else {
                  break;
              }
          }
      }
      PopCallStack(popType = null) {
          if (this.callStack.currentElement.type == PushPopType.Function)
              this.TrimWhitespaceFromFunctionEnd();
          this.callStack.Pop(popType);
      }
      SetChosenPath(path, incrementingTurnIndex) {
          // Changing direction, assume we need to clear current set of choices
          this._currentFlow.currentChoices.length = 0;
          let newPointer = this.story.PointerAtPath(path);
          if (!newPointer.isNull && newPointer.index == -1)
              newPointer.index = 0;
          this.currentPointer = newPointer;
          if (incrementingTurnIndex) {
              this.currentTurnIndex++;
          }
      }
      StartFunctionEvaluationFromGame(funcContainer, args) {
          this.callStack.Push(PushPopType.FunctionEvaluationFromGame, this.evaluationStack.length);
          this.callStack.currentElement.currentPointer = Pointer.StartOf(funcContainer);
          this.PassArgumentsToEvaluationStack(args);
      }
      PassArgumentsToEvaluationStack(args) {
          if (args !== null) {
              for (let i = 0; i < args.length; i++) {
                  if (!(typeof args[i] === "number" || typeof args[i] === "string") ||
                      args[i] instanceof InkList) {
                      throw new Error("ink arguments when calling EvaluateFunction / ChoosePathStringWithParameters must be" +
                          "number, string or InkList. Argument was " +
                          (nullIfUndefined(arguments[i]) === null)
                          ? "null"
                          : arguments[i].constructor.name);
                  }
                  this.PushEvaluationStack(Value.Create(args[i]));
              }
          }
      }
      TryExitFunctionEvaluationFromGame() {
          if (this.callStack.currentElement.type ==
              PushPopType.FunctionEvaluationFromGame) {
              this.currentPointer = Pointer.Null;
              this.didSafeExit = true;
              return true;
          }
          return false;
      }
      CompleteFunctionEvaluationFromGame() {
          if (this.callStack.currentElement.type !=
              PushPopType.FunctionEvaluationFromGame) {
              throw new Error("Expected external function evaluation to be complete. Stack trace: " +
                  this.callStack.callStackTrace);
          }
          let originalEvaluationStackHeight = this.callStack.currentElement
              .evaluationStackHeightWhenPushed;
          let returnedObj = null;
          while (this.evaluationStack.length > originalEvaluationStackHeight) {
              let poppedObj = this.PopEvaluationStack();
              if (returnedObj === null)
                  returnedObj = poppedObj;
          }
          this.PopCallStack(PushPopType.FunctionEvaluationFromGame);
          if (returnedObj) {
              if (returnedObj instanceof Void)
                  return null;
              // Some kind of value, if not void
              // var returnVal = returnedObj as Runtime.Value;
              let returnVal = asOrThrows(returnedObj, Value);
              // DivertTargets get returned as the string of components
              // (rather than a Path, which isn't public)
              if (returnVal.valueType == ValueType.DivertTarget) {
                  return returnVal.valueObject.toString();
              }
              // Other types can just have their exact object type:
              // int, float, string. VariablePointers get returned as strings.
              return returnVal.valueObject;
          }
          return null;
      }
      AddError(message, isWarning) {
          if (!isWarning) {
              if (this._currentErrors == null)
                  this._currentErrors = [];
              this._currentErrors.push(message);
          }
          else {
              if (this._currentWarnings == null)
                  this._currentWarnings = [];
              this._currentWarnings.push(message);
          }
      }
      OutputStreamDirty() {
          this._outputStreamTextDirty = true;
          this._outputStreamTagsDirty = true;
      }
  }

  // This is simple replacement of the Stopwatch class from the .NET Framework.
  // The original class can count time with much more accuracy than the Javascript version.
  // It might be worth considering using `window.performance` in the browser
  // or `process.hrtime()` in node.
  class Stopwatch {
      constructor() {
          this.startTime = undefined;
      }
      get ElapsedMilliseconds() {
          if (typeof this.startTime === "undefined") {
              return 0;
          }
          return new Date().getTime() - this.startTime;
      }
      Start() {
          this.startTime = new Date().getTime();
      }
      Stop() {
          this.startTime = undefined;
      }
  }

  var ErrorType;
  (function (ErrorType) {
      ErrorType[ErrorType["Author"] = 0] = "Author";
      ErrorType[ErrorType["Warning"] = 1] = "Warning";
      ErrorType[ErrorType["Error"] = 2] = "Error";
  })(ErrorType || (ErrorType = {}));

  if (!Number.isInteger) {
      Number.isInteger = function isInteger(nVal) {
          return (typeof nVal === "number" &&
              isFinite(nVal) &&
              nVal > -9007199254740992 &&
              nVal < 9007199254740992 &&
              Math.floor(nVal) === nVal);
      };
  }
  class Story extends InkObject {
      constructor() {
          super();
          this.inkVersionMinimumCompatible = 18;
          this.onError = null;
          this.onDidContinue = null;
          this.onMakeChoice = null;
          this.onEvaluateFunction = null;
          this.onCompleteEvaluateFunction = null;
          this.onChoosePathString = null;
          this._prevContainers = [];
          this.allowExternalFunctionFallbacks = false;
          this._listDefinitions = null;
          this._variableObservers = null;
          this._hasValidatedExternals = false;
          this._temporaryEvaluationContainer = null;
          this._asyncContinueActive = false;
          this._stateSnapshotAtLastNewline = null;
          this._sawLookaheadUnsafeFunctionAfterNewline = false;
          this._recursiveContinueCount = 0;
          this._asyncSaving = false;
          this._profiler = null; // TODO: Profiler
          // Discrimination between constructors
          let contentContainer;
          let lists = null;
          let json = null;
          if (arguments[0] instanceof Container) {
              contentContainer = arguments[0];
              if (typeof arguments[1] !== "undefined") {
                  lists = arguments[1];
              }
              // ------ Story (Container contentContainer, List<Runtime.ListDefinition> lists = null)
              this._mainContentContainer = contentContainer;
              // ------
          }
          else {
              if (typeof arguments[0] === "string") {
                  let jsonString = arguments[0];
                  json = SimpleJson.TextToDictionary(jsonString);
              }
              else {
                  json = arguments[0];
              }
          }
          // ------ Story (Container contentContainer, List<Runtime.ListDefinition> lists = null)
          if (lists != null)
              this._listDefinitions = new ListDefinitionsOrigin(lists);
          this._externals = new Map();
          // ------
          // ------ Story(string jsonString) : this((Container)null)
          if (json !== null) {
              let rootObject = json;
              let versionObj = rootObject["inkVersion"];
              if (versionObj == null)
                  throw new Error("ink version number not found. Are you sure it's a valid .ink.json file?");
              let formatFromFile = parseInt(versionObj);
              if (formatFromFile > Story.inkVersionCurrent) {
                  throw new Error("Version of ink used to build story was newer than the current version of the engine");
              }
              else if (formatFromFile < this.inkVersionMinimumCompatible) {
                  throw new Error("Version of ink used to build story is too old to be loaded by this version of the engine");
              }
              else if (formatFromFile != Story.inkVersionCurrent) {
                  console.warn("WARNING: Version of ink used to build story doesn't match current version of engine. Non-critical, but recommend synchronising.");
              }
              let rootToken = rootObject["root"];
              if (rootToken == null)
                  throw new Error("Root node for ink not found. Are you sure it's a valid .ink.json file?");
              let listDefsObj;
              if ((listDefsObj = rootObject["listDefs"])) {
                  this._listDefinitions = JsonSerialisation.JTokenToListDefinitions(listDefsObj);
              }
              this._mainContentContainer = asOrThrows(JsonSerialisation.JTokenToRuntimeObject(rootToken), Container);
              this.ResetState();
          }
          // ------
      }
      get currentChoices() {
          let choices = [];
          if (this._state === null) {
              return throwNullException("this._state");
          }
          for (let c of this._state.currentChoices) {
              if (!c.isInvisibleDefault) {
                  c.index = choices.length;
                  choices.push(c);
              }
          }
          return choices;
      }
      get currentText() {
          this.IfAsyncWeCant("call currentText since it's a work in progress");
          return this.state.currentText;
      }
      get currentTags() {
          this.IfAsyncWeCant("call currentTags since it's a work in progress");
          return this.state.currentTags;
      }
      get currentErrors() {
          return this.state.currentErrors;
      }
      get currentWarnings() {
          return this.state.currentWarnings;
      }
      get currentFlowName() {
          return this.state.currentFlowName;
      }
      get hasError() {
          return this.state.hasError;
      }
      get hasWarning() {
          return this.state.hasWarning;
      }
      get variablesState() {
          return this.state.variablesState;
      }
      get listDefinitions() {
          return this._listDefinitions;
      }
      get state() {
          return this._state;
      }
      // TODO: Implement Profiler
      StartProfiling() {
          /* */
      }
      EndProfiling() {
          /* */
      }
      // Merge together `public string ToJson()` and `void ToJson(SimpleJson.Writer writer)`.
      // Will only return a value if writer was not provided.
      ToJson(writer) {
          let shouldReturn = false;
          if (!writer) {
              shouldReturn = true;
              writer = new SimpleJson.Writer();
          }
          writer.WriteObjectStart();
          writer.WriteIntProperty("inkVersion", Story.inkVersionCurrent);
          writer.WriteProperty("root", (w) => JsonSerialisation.WriteRuntimeContainer(w, this._mainContentContainer));
          if (this._listDefinitions != null) {
              writer.WritePropertyStart("listDefs");
              writer.WriteObjectStart();
              for (let def of this._listDefinitions.lists) {
                  writer.WritePropertyStart(def.name);
                  writer.WriteObjectStart();
                  for (let [key, value] of def.items) {
                      let item = InkListItem.fromSerializedKey(key);
                      let val = value;
                      writer.WriteIntProperty(item.itemName, val);
                  }
                  writer.WriteObjectEnd();
                  writer.WritePropertyEnd();
              }
              writer.WriteObjectEnd();
              writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
          if (shouldReturn)
              return writer.ToString();
      }
      ResetState() {
          this.IfAsyncWeCant("ResetState");
          this._state = new StoryState(this);
          this._state.variablesState.ObserveVariableChange(this.VariableStateDidChangeEvent.bind(this));
          this.ResetGlobals();
      }
      ResetErrors() {
          if (this._state === null) {
              return throwNullException("this._state");
          }
          this._state.ResetErrors();
      }
      ResetCallstack() {
          this.IfAsyncWeCant("ResetCallstack");
          if (this._state === null) {
              return throwNullException("this._state");
          }
          this._state.ForceEnd();
      }
      ResetGlobals() {
          if (this._mainContentContainer.namedContent.get("global decl")) {
              let originalPointer = this.state.currentPointer.copy();
              this.ChoosePath(new Path("global decl"), false);
              this.ContinueInternal();
              this.state.currentPointer = originalPointer;
          }
          this.state.variablesState.SnapshotDefaultGlobals();
      }
      SwitchFlow(flowName) {
          this.IfAsyncWeCant("switch flow");
          if (this._asyncSaving) {
              throw new Error("Story is already in background saving mode, can't switch flow to " +
                  flowName);
          }
          this.state.SwitchFlow_Internal(flowName);
      }
      RemoveFlow(flowName) {
          this.state.RemoveFlow_Internal(flowName);
      }
      SwitchToDefaultFlow() {
          this.state.SwitchToDefaultFlow_Internal();
      }
      Continue() {
          this.ContinueAsync(0);
          return this.currentText;
      }
      get canContinue() {
          return this.state.canContinue;
      }
      get asyncContinueComplete() {
          return !this._asyncContinueActive;
      }
      ContinueAsync(millisecsLimitAsync) {
          if (!this._hasValidatedExternals)
              this.ValidateExternalBindings();
          this.ContinueInternal(millisecsLimitAsync);
      }
      ContinueInternal(millisecsLimitAsync = 0) {
          if (this._profiler != null)
              this._profiler.PreContinue();
          let isAsyncTimeLimited = millisecsLimitAsync > 0;
          this._recursiveContinueCount++;
          if (!this._asyncContinueActive) {
              this._asyncContinueActive = isAsyncTimeLimited;
              if (!this.canContinue) {
                  throw new Error("Can't continue - should check canContinue before calling Continue");
              }
              this._state.didSafeExit = false;
              this._state.ResetOutput();
              if (this._recursiveContinueCount == 1)
                  this._state.variablesState.batchObservingVariableChanges = true;
          }
          let durationStopwatch = new Stopwatch();
          durationStopwatch.Start();
          let outputStreamEndsInNewline = false;
          this._sawLookaheadUnsafeFunctionAfterNewline = false;
          do {
              try {
                  outputStreamEndsInNewline = this.ContinueSingleStep();
              }
              catch (e) {
                  if (!(e instanceof StoryException))
                      throw e;
                  this.AddError(e.message, undefined, e.useEndLineNumber);
                  break;
              }
              if (outputStreamEndsInNewline)
                  break;
              if (this._asyncContinueActive &&
                  durationStopwatch.ElapsedMilliseconds > millisecsLimitAsync) {
                  break;
              }
          } while (this.canContinue);
          durationStopwatch.Stop();
          if (outputStreamEndsInNewline || !this.canContinue) {
              if (this._stateSnapshotAtLastNewline !== null) {
                  this.RestoreStateSnapshot();
              }
              if (!this.canContinue) {
                  if (this.state.callStack.canPopThread)
                      this.AddError("Thread available to pop, threads should always be flat by the end of evaluation?");
                  if (this.state.generatedChoices.length == 0 &&
                      !this.state.didSafeExit &&
                      this._temporaryEvaluationContainer == null) {
                      if (this.state.callStack.CanPop(PushPopType.Tunnel))
                          this.AddError("unexpectedly reached end of content. Do you need a '->->' to return from a tunnel?");
                      else if (this.state.callStack.CanPop(PushPopType.Function))
                          this.AddError("unexpectedly reached end of content. Do you need a '~ return'?");
                      else if (!this.state.callStack.canPop)
                          this.AddError("ran out of content. Do you need a '-> DONE' or '-> END'?");
                      else
                          this.AddError("unexpectedly reached end of content for unknown reason. Please debug compiler!");
                  }
              }
              this.state.didSafeExit = false;
              this._sawLookaheadUnsafeFunctionAfterNewline = false;
              if (this._recursiveContinueCount == 1)
                  this._state.variablesState.batchObservingVariableChanges = false;
              this._asyncContinueActive = false;
              if (this.onDidContinue !== null)
                  this.onDidContinue();
          }
          this._recursiveContinueCount--;
          if (this._profiler != null)
              this._profiler.PostContinue();
          // In the following code, we're masking a lot of non-null assertion,
          // because testing for against `hasError` or `hasWarning` makes sure
          // the arrays are present and contain at least one element.
          if (this.state.hasError || this.state.hasWarning) {
              if (this.onError !== null) {
                  if (this.state.hasError) {
                      for (let err of this.state.currentErrors) {
                          this.onError(err, ErrorType.Error);
                      }
                  }
                  if (this.state.hasWarning) {
                      for (let err of this.state.currentWarnings) {
                          this.onError(err, ErrorType.Warning);
                      }
                  }
                  this.ResetErrors();
              }
              else {
                  let sb = new StringBuilder();
                  sb.Append("Ink had ");
                  if (this.state.hasError) {
                      sb.Append(`${this.state.currentErrors.length}`);
                      sb.Append(this.state.currentErrors.length == 1 ? " error" : "errors");
                      if (this.state.hasWarning)
                          sb.Append(" and ");
                  }
                  if (this.state.hasWarning) {
                      sb.Append(`${this.state.currentWarnings.length}`);
                      sb.Append(this.state.currentWarnings.length == 1 ? " warning" : "warnings");
                      if (this.state.hasWarning)
                          sb.Append(" and ");
                  }
                  sb.Append(". It is strongly suggested that you assign an error handler to story.onError. The first issue was: ");
                  sb.Append(this.state.hasError
                      ? this.state.currentErrors[0]
                      : this.state.currentWarnings[0]);
                  throw new StoryException(sb.toString());
              }
          }
      }
      ContinueSingleStep() {
          if (this._profiler != null)
              this._profiler.PreStep();
          this.Step();
          if (this._profiler != null)
              this._profiler.PostStep();
          if (!this.canContinue && !this.state.callStack.elementIsEvaluateFromGame) {
              this.TryFollowDefaultInvisibleChoice();
          }
          if (this._profiler != null)
              this._profiler.PreSnapshot();
          if (!this.state.inStringEvaluation) {
              if (this._stateSnapshotAtLastNewline !== null) {
                  if (this._stateSnapshotAtLastNewline.currentTags === null) {
                      return throwNullException("this._stateAtLastNewline.currentTags");
                  }
                  if (this.state.currentTags === null) {
                      return throwNullException("this.state.currentTags");
                  }
                  let change = this.CalculateNewlineOutputStateChange(this._stateSnapshotAtLastNewline.currentText, this.state.currentText, this._stateSnapshotAtLastNewline.currentTags.length, this.state.currentTags.length);
                  if (change == Story.OutputStateChange.ExtendedBeyondNewline ||
                      this._sawLookaheadUnsafeFunctionAfterNewline) {
                      this.RestoreStateSnapshot();
                      return true;
                  }
                  else if (change == Story.OutputStateChange.NewlineRemoved) {
                      this.DiscardSnapshot();
                  }
              }
              if (this.state.outputStreamEndsInNewline) {
                  if (this.canContinue) {
                      if (this._stateSnapshotAtLastNewline == null)
                          this.StateSnapshot();
                  }
                  else {
                      this.DiscardSnapshot();
                  }
              }
          }
          if (this._profiler != null)
              this._profiler.PostSnapshot();
          return false;
      }
      CalculateNewlineOutputStateChange(prevText, currText, prevTagCount, currTagCount) {
          if (prevText === null) {
              return throwNullException("prevText");
          }
          if (currText === null) {
              return throwNullException("currText");
          }
          let newlineStillExists = currText.length >= prevText.length &&
              currText.charAt(prevText.length - 1) == "\n";
          if (prevTagCount == currTagCount &&
              prevText.length == currText.length &&
              newlineStillExists)
              return Story.OutputStateChange.NoChange;
          if (!newlineStillExists) {
              return Story.OutputStateChange.NewlineRemoved;
          }
          if (currTagCount > prevTagCount)
              return Story.OutputStateChange.ExtendedBeyondNewline;
          for (let i = prevText.length; i < currText.length; i++) {
              let c = currText.charAt(i);
              if (c != " " && c != "\t") {
                  return Story.OutputStateChange.ExtendedBeyondNewline;
              }
          }
          return Story.OutputStateChange.NoChange;
      }
      ContinueMaximally() {
          this.IfAsyncWeCant("ContinueMaximally");
          let sb = new StringBuilder();
          while (this.canContinue) {
              sb.Append(this.Continue());
          }
          return sb.toString();
      }
      ContentAtPath(path) {
          return this.mainContentContainer.ContentAtPath(path);
      }
      KnotContainerWithName(name) {
          let namedContainer = this.mainContentContainer.namedContent.get(name);
          if (namedContainer instanceof Container)
              return namedContainer;
          else
              return null;
      }
      PointerAtPath(path) {
          if (path.length == 0)
              return Pointer.Null;
          let p = new Pointer();
          let pathLengthToUse = path.length;
          let result = null;
          if (path.lastComponent === null) {
              return throwNullException("path.lastComponent");
          }
          if (path.lastComponent.isIndex) {
              pathLengthToUse = path.length - 1;
              result = this.mainContentContainer.ContentAtPath(path, undefined, pathLengthToUse);
              p.container = result.container;
              p.index = path.lastComponent.index;
          }
          else {
              result = this.mainContentContainer.ContentAtPath(path);
              p.container = result.container;
              p.index = -1;
          }
          if (result.obj == null ||
              (result.obj == this.mainContentContainer && pathLengthToUse > 0)) {
              this.Error("Failed to find content at path '" +
                  path +
                  "', and no approximation of it was possible.");
          }
          else if (result.approximate)
              this.Warning("Failed to find content at path '" +
                  path +
                  "', so it was approximated to: '" +
                  result.obj.path +
                  "'.");
          return p;
      }
      StateSnapshot() {
          this._stateSnapshotAtLastNewline = this._state;
          this._state = this._state.CopyAndStartPatching();
      }
      RestoreStateSnapshot() {
          if (this._stateSnapshotAtLastNewline === null) {
              throwNullException("_stateSnapshotAtLastNewline");
          }
          this._stateSnapshotAtLastNewline.RestoreAfterPatch();
          this._state = this._stateSnapshotAtLastNewline;
          this._stateSnapshotAtLastNewline = null;
          if (!this._asyncSaving) {
              this._state.ApplyAnyPatch();
          }
      }
      DiscardSnapshot() {
          if (!this._asyncSaving)
              this._state.ApplyAnyPatch();
          this._stateSnapshotAtLastNewline = null;
      }
      CopyStateForBackgroundThreadSave() {
          this.IfAsyncWeCant("start saving on a background thread");
          if (this._asyncSaving)
              throw new Error("Story is already in background saving mode, can't call CopyStateForBackgroundThreadSave again!");
          let stateToSave = this._state;
          this._state = this._state.CopyAndStartPatching();
          this._asyncSaving = true;
          return stateToSave;
      }
      BackgroundSaveComplete() {
          if (this._stateSnapshotAtLastNewline === null) {
              this._state.ApplyAnyPatch();
          }
          this._asyncSaving = false;
      }
      Step() {
          let shouldAddToStream = true;
          let pointer = this.state.currentPointer.copy();
          if (pointer.isNull) {
              return;
          }
          // Container containerToEnter = pointer.Resolve () as Container;
          let containerToEnter = asOrNull(pointer.Resolve(), Container);
          while (containerToEnter) {
              this.VisitContainer(containerToEnter, true);
              // No content? the most we can do is step past it
              if (containerToEnter.content.length == 0) {
                  break;
              }
              pointer = Pointer.StartOf(containerToEnter);
              // containerToEnter = pointer.Resolve() as Container;
              containerToEnter = asOrNull(pointer.Resolve(), Container);
          }
          this.state.currentPointer = pointer.copy();
          if (this._profiler != null)
              this._profiler.Step(this.state.callStack);
          // Is the current content object:
          //  - Normal content
          //  - Or a logic/flow statement - if so, do it
          // Stop flow if we hit a stack pop when we're unable to pop (e.g. return/done statement in knot
          // that was diverted to rather than called as a function)
          let currentContentObj = pointer.Resolve();
          let isLogicOrFlowControl = this.PerformLogicAndFlowControl(currentContentObj);
          // Has flow been forced to end by flow control above?
          if (this.state.currentPointer.isNull) {
              return;
          }
          if (isLogicOrFlowControl) {
              shouldAddToStream = false;
          }
          // Choice with condition?
          // var choicePoint = currentContentObj as ChoicePoint;
          let choicePoint = asOrNull(currentContentObj, ChoicePoint);
          if (choicePoint) {
              let choice = this.ProcessChoice(choicePoint);
              if (choice) {
                  this.state.generatedChoices.push(choice);
              }
              currentContentObj = null;
              shouldAddToStream = false;
          }
          // If the container has no content, then it will be
          // the "content" itself, but we skip over it.
          if (currentContentObj instanceof Container) {
              shouldAddToStream = false;
          }
          // Content to add to evaluation stack or the output stream
          if (shouldAddToStream) {
              // If we're pushing a variable pointer onto the evaluation stack, ensure that it's specific
              // to our current (possibly temporary) context index. And make a copy of the pointer
              // so that we're not editing the original runtime object.
              // var varPointer = currentContentObj as VariablePointerValue;
              let varPointer = asOrNull(currentContentObj, VariablePointerValue);
              if (varPointer && varPointer.contextIndex == -1) {
                  // Create new object so we're not overwriting the story's own data
                  let contextIdx = this.state.callStack.ContextForVariableNamed(varPointer.variableName);
                  currentContentObj = new VariablePointerValue(varPointer.variableName, contextIdx);
              }
              // Expression evaluation content
              if (this.state.inExpressionEvaluation) {
                  this.state.PushEvaluationStack(currentContentObj);
              }
              // Output stream content (i.e. not expression evaluation)
              else {
                  this.state.PushToOutputStream(currentContentObj);
              }
          }
          // Increment the content pointer, following diverts if necessary
          this.NextContent();
          // Starting a thread should be done after the increment to the content pointer,
          // so that when returning from the thread, it returns to the content after this instruction.
          // var controlCmd = currentContentObj as ;
          let controlCmd = asOrNull(currentContentObj, ControlCommand);
          if (controlCmd &&
              controlCmd.commandType == ControlCommand.CommandType.StartThread) {
              this.state.callStack.PushThread();
          }
      }
      VisitContainer(container, atStart) {
          if (!container.countingAtStartOnly || atStart) {
              if (container.visitsShouldBeCounted)
                  this.state.IncrementVisitCountForContainer(container);
              if (container.turnIndexShouldBeCounted)
                  this.state.RecordTurnIndexVisitToContainer(container);
          }
      }
      VisitChangedContainersDueToDivert() {
          let previousPointer = this.state.previousPointer.copy();
          let pointer = this.state.currentPointer.copy();
          if (pointer.isNull || pointer.index == -1)
              return;
          this._prevContainers.length = 0;
          if (!previousPointer.isNull) {
              // Container prevAncestor = previousPointer.Resolve() as Container ?? previousPointer.container as Container;
              let resolvedPreviousAncestor = previousPointer.Resolve();
              let prevAncestor = asOrNull(resolvedPreviousAncestor, Container) ||
                  asOrNull(previousPointer.container, Container);
              while (prevAncestor) {
                  this._prevContainers.push(prevAncestor);
                  // prevAncestor = prevAncestor.parent as Container;
                  prevAncestor = asOrNull(prevAncestor.parent, Container);
              }
          }
          let currentChildOfContainer = pointer.Resolve();
          if (currentChildOfContainer == null)
              return;
          // Container currentContainerAncestor = currentChildOfContainer.parent as Container;
          let currentContainerAncestor = asOrNull(currentChildOfContainer.parent, Container);
          let allChildrenEnteredAtStart = true;
          while (currentContainerAncestor &&
              (this._prevContainers.indexOf(currentContainerAncestor) < 0 ||
                  currentContainerAncestor.countingAtStartOnly)) {
              // Check whether this ancestor container is being entered at the start,
              // by checking whether the child object is the first.
              let enteringAtStart = currentContainerAncestor.content.length > 0 &&
                  currentChildOfContainer == currentContainerAncestor.content[0] &&
                  allChildrenEnteredAtStart;
              if (!enteringAtStart)
                  allChildrenEnteredAtStart = false;
              // Mark a visit to this container
              this.VisitContainer(currentContainerAncestor, enteringAtStart);
              currentChildOfContainer = currentContainerAncestor;
              // currentContainerAncestor = currentContainerAncestor.parent as Container;
              currentContainerAncestor = asOrNull(currentContainerAncestor.parent, Container);
          }
      }
      ProcessChoice(choicePoint) {
          let showChoice = true;
          // Don't create choice if choice point doesn't pass conditional
          if (choicePoint.hasCondition) {
              let conditionValue = this.state.PopEvaluationStack();
              if (!this.IsTruthy(conditionValue)) {
                  showChoice = false;
              }
          }
          let startText = "";
          let choiceOnlyText = "";
          if (choicePoint.hasChoiceOnlyContent) {
              // var choiceOnlyStrVal = state.PopEvaluationStack () as StringValue;
              let choiceOnlyStrVal = asOrThrows(this.state.PopEvaluationStack(), StringValue);
              choiceOnlyText = choiceOnlyStrVal.value || "";
          }
          if (choicePoint.hasStartContent) {
              // var startStrVal = state.PopEvaluationStack () as StringValue;
              let startStrVal = asOrThrows(this.state.PopEvaluationStack(), StringValue);
              startText = startStrVal.value || "";
          }
          // Don't create choice if player has already read this content
          if (choicePoint.onceOnly) {
              let visitCount = this.state.VisitCountForContainer(choicePoint.choiceTarget);
              if (visitCount > 0) {
                  showChoice = false;
              }
          }
          // We go through the full process of creating the choice above so
          // that we consume the content for it, since otherwise it'll
          // be shown on the output stream.
          if (!showChoice) {
              return null;
          }
          let choice = new Choice();
          choice.targetPath = choicePoint.pathOnChoice;
          choice.sourcePath = choicePoint.path.toString();
          choice.isInvisibleDefault = choicePoint.isInvisibleDefault;
          choice.threadAtGeneration = this.state.callStack.ForkThread();
          choice.text = (startText + choiceOnlyText).replace(/^[ \t]+|[ \t]+$/g, "");
          return choice;
      }
      IsTruthy(obj) {
          let truthy = false;
          if (obj instanceof Value) {
              let val = obj;
              if (val instanceof DivertTargetValue) {
                  let divTarget = val;
                  this.Error("Shouldn't use a divert target (to " +
                      divTarget.targetPath +
                      ") as a conditional value. Did you intend a function call 'likeThis()' or a read count check 'likeThis'? (no arrows)");
                  return false;
              }
              return val.isTruthy;
          }
          return truthy;
      }
      PerformLogicAndFlowControl(contentObj) {
          if (contentObj == null) {
              return false;
          }
          // Divert
          if (contentObj instanceof Divert) {
              let currentDivert = contentObj;
              if (currentDivert.isConditional) {
                  let conditionValue = this.state.PopEvaluationStack();
                  // False conditional? Cancel divert
                  if (!this.IsTruthy(conditionValue))
                      return true;
              }
              if (currentDivert.hasVariableTarget) {
                  let varName = currentDivert.variableDivertName;
                  let varContents = this.state.variablesState.GetVariableWithName(varName);
                  if (varContents == null) {
                      this.Error("Tried to divert using a target from a variable that could not be found (" +
                          varName +
                          ")");
                  }
                  else if (!(varContents instanceof DivertTargetValue)) {
                      // var intContent = varContents as IntValue;
                      let intContent = asOrNull(varContents, IntValue);
                      let errorMessage = "Tried to divert to a target from a variable, but the variable (" +
                          varName +
                          ") didn't contain a divert target, it ";
                      if (intContent instanceof IntValue && intContent.value == 0) {
                          errorMessage += "was empty/null (the value 0).";
                      }
                      else {
                          errorMessage += "contained '" + varContents + "'.";
                      }
                      this.Error(errorMessage);
                  }
                  let target = asOrThrows(varContents, DivertTargetValue);
                  this.state.divertedPointer = this.PointerAtPath(target.targetPath);
              }
              else if (currentDivert.isExternal) {
                  this.CallExternalFunction(currentDivert.targetPathString, currentDivert.externalArgs);
                  return true;
              }
              else {
                  this.state.divertedPointer = currentDivert.targetPointer.copy();
              }
              if (currentDivert.pushesToStack) {
                  this.state.callStack.Push(currentDivert.stackPushType, undefined, this.state.outputStream.length);
              }
              if (this.state.divertedPointer.isNull && !currentDivert.isExternal) {
                  if (currentDivert &&
                      currentDivert.debugMetadata &&
                      currentDivert.debugMetadata.sourceName != null) {
                      this.Error("Divert target doesn't exist: " +
                          currentDivert.debugMetadata.sourceName);
                  }
                  else {
                      this.Error("Divert resolution failed: " + currentDivert);
                  }
              }
              return true;
          }
          // Start/end an expression evaluation? Or print out the result?
          else if (contentObj instanceof ControlCommand) {
              let evalCommand = contentObj;
              switch (evalCommand.commandType) {
                  case ControlCommand.CommandType.EvalStart:
                      this.Assert(this.state.inExpressionEvaluation === false, "Already in expression evaluation?");
                      this.state.inExpressionEvaluation = true;
                      break;
                  case ControlCommand.CommandType.EvalEnd:
                      this.Assert(this.state.inExpressionEvaluation === true, "Not in expression evaluation mode");
                      this.state.inExpressionEvaluation = false;
                      break;
                  case ControlCommand.CommandType.EvalOutput:
                      // If the expression turned out to be empty, there may not be anything on the stack
                      if (this.state.evaluationStack.length > 0) {
                          let output = this.state.PopEvaluationStack();
                          // Functions may evaluate to Void, in which case we skip output
                          if (!(output instanceof Void)) {
                              // TODO: Should we really always blanket convert to string?
                              // It would be okay to have numbers in the output stream the
                              // only problem is when exporting text for viewing, it skips over numbers etc.
                              let text = new StringValue(output.toString());
                              this.state.PushToOutputStream(text);
                          }
                      }
                      break;
                  case ControlCommand.CommandType.NoOp:
                      break;
                  case ControlCommand.CommandType.Duplicate:
                      this.state.PushEvaluationStack(this.state.PeekEvaluationStack());
                      break;
                  case ControlCommand.CommandType.PopEvaluatedValue:
                      this.state.PopEvaluationStack();
                      break;
                  case ControlCommand.CommandType.PopFunction:
                  case ControlCommand.CommandType.PopTunnel:
                      let popType = evalCommand.commandType == ControlCommand.CommandType.PopFunction
                          ? PushPopType.Function
                          : PushPopType.Tunnel;
                      let overrideTunnelReturnTarget = null;
                      if (popType == PushPopType.Tunnel) {
                          let popped = this.state.PopEvaluationStack();
                          // overrideTunnelReturnTarget = popped as DivertTargetValue;
                          overrideTunnelReturnTarget = asOrNull(popped, DivertTargetValue);
                          if (overrideTunnelReturnTarget === null) {
                              this.Assert(popped instanceof Void, "Expected void if ->-> doesn't override target");
                          }
                      }
                      if (this.state.TryExitFunctionEvaluationFromGame()) {
                          break;
                      }
                      else if (this.state.callStack.currentElement.type != popType ||
                          !this.state.callStack.canPop) {
                          let names = new Map();
                          names.set(PushPopType.Function, "function return statement (~ return)");
                          names.set(PushPopType.Tunnel, "tunnel onwards statement (->->)");
                          let expected = names.get(this.state.callStack.currentElement.type);
                          if (!this.state.callStack.canPop) {
                              expected = "end of flow (-> END or choice)";
                          }
                          let errorMsg = "Found " + names.get(popType) + ", when expected " + expected;
                          this.Error(errorMsg);
                      }
                      else {
                          this.state.PopCallStack();
                          if (overrideTunnelReturnTarget)
                              this.state.divertedPointer = this.PointerAtPath(overrideTunnelReturnTarget.targetPath);
                      }
                      break;
                  case ControlCommand.CommandType.BeginString:
                      this.state.PushToOutputStream(evalCommand);
                      this.Assert(this.state.inExpressionEvaluation === true, "Expected to be in an expression when evaluating a string");
                      this.state.inExpressionEvaluation = false;
                      break;
                  case ControlCommand.CommandType.EndString:
                      let contentStackForString = [];
                      let outputCountConsumed = 0;
                      for (let i = this.state.outputStream.length - 1; i >= 0; --i) {
                          let obj = this.state.outputStream[i];
                          outputCountConsumed++;
                          // var command = obj as ControlCommand;
                          let command = asOrNull(obj, ControlCommand);
                          if (command &&
                              command.commandType == ControlCommand.CommandType.BeginString) {
                              break;
                          }
                          if (obj instanceof StringValue) {
                              contentStackForString.push(obj);
                          }
                      }
                      // Consume the content that was produced for this string
                      this.state.PopFromOutputStream(outputCountConsumed);
                      // The C# version uses a Stack for contentStackForString, but we're
                      // using a simple array, so we need to reverse it before using it
                      contentStackForString = contentStackForString.reverse();
                      // Build string out of the content we collected
                      let sb = new StringBuilder();
                      for (let c of contentStackForString) {
                          sb.Append(c.toString());
                      }
                      // Return to expression evaluation (from content mode)
                      this.state.inExpressionEvaluation = true;
                      this.state.PushEvaluationStack(new StringValue(sb.toString()));
                      break;
                  case ControlCommand.CommandType.ChoiceCount:
                      let choiceCount = this.state.generatedChoices.length;
                      this.state.PushEvaluationStack(new IntValue(choiceCount));
                      break;
                  case ControlCommand.CommandType.Turns:
                      this.state.PushEvaluationStack(new IntValue(this.state.currentTurnIndex + 1));
                      break;
                  case ControlCommand.CommandType.TurnsSince:
                  case ControlCommand.CommandType.ReadCount:
                      let target = this.state.PopEvaluationStack();
                      if (!(target instanceof DivertTargetValue)) {
                          let extraNote = "";
                          if (target instanceof IntValue)
                              extraNote =
                                  ". Did you accidentally pass a read count ('knot_name') instead of a target ('-> knot_name')?";
                          this.Error("TURNS_SINCE / READ_COUNT expected a divert target (knot, stitch, label name), but saw " +
                              target +
                              extraNote);
                          break;
                      }
                      // var divertTarget = target as DivertTargetValue;
                      let divertTarget = asOrThrows(target, DivertTargetValue);
                      // var container = ContentAtPath (divertTarget.targetPath).correctObj as Container;
                      let container = asOrNull(this.ContentAtPath(divertTarget.targetPath).correctObj, Container);
                      let eitherCount;
                      if (container != null) {
                          if (evalCommand.commandType == ControlCommand.CommandType.TurnsSince)
                              eitherCount = this.state.TurnsSinceForContainer(container);
                          else
                              eitherCount = this.state.VisitCountForContainer(container);
                      }
                      else {
                          if (evalCommand.commandType == ControlCommand.CommandType.TurnsSince)
                              eitherCount = -1;
                          else
                              eitherCount = 0;
                          this.Warning("Failed to find container for " +
                              evalCommand.toString() +
                              " lookup at " +
                              divertTarget.targetPath.toString());
                      }
                      this.state.PushEvaluationStack(new IntValue(eitherCount));
                      break;
                  case ControlCommand.CommandType.Random: {
                      let maxInt = asOrNull(this.state.PopEvaluationStack(), IntValue);
                      let minInt = asOrNull(this.state.PopEvaluationStack(), IntValue);
                      if (minInt == null || minInt instanceof IntValue === false)
                          return this.Error("Invalid value for minimum parameter of RANDOM(min, max)");
                      if (maxInt == null || minInt instanceof IntValue === false)
                          return this.Error("Invalid value for maximum parameter of RANDOM(min, max)");
                      // Originally a primitive type, but here, can be null.
                      // TODO: Replace by default value?
                      if (maxInt.value === null) {
                          return throwNullException("maxInt.value");
                      }
                      if (minInt.value === null) {
                          return throwNullException("minInt.value");
                      }
                      // This code is differs a bit from the reference implementation, since
                      // JavaScript has no true integers. Hence integer arithmetics and
                      // interger overflows don't apply here. A loss of precision can
                      // happen with big numbers however.
                      //
                      // The case where 'randomRange' is lower than zero is handled below,
                      // so there's no need to test against Number.MIN_SAFE_INTEGER.
                      let randomRange = maxInt.value - minInt.value + 1;
                      if (!isFinite(randomRange) || randomRange > Number.MAX_SAFE_INTEGER) {
                          randomRange = Number.MAX_SAFE_INTEGER;
                          this.Error("RANDOM was called with a range that exceeds the size that ink numbers can use.");
                      }
                      if (randomRange <= 0)
                          this.Error("RANDOM was called with minimum as " +
                              minInt.value +
                              " and maximum as " +
                              maxInt.value +
                              ". The maximum must be larger");
                      let resultSeed = this.state.storySeed + this.state.previousRandom;
                      let random = new PRNG(resultSeed);
                      let nextRandom = random.next();
                      let chosenValue = (nextRandom % randomRange) + minInt.value;
                      this.state.PushEvaluationStack(new IntValue(chosenValue));
                      // Next random number (rather than keeping the Random object around)
                      this.state.previousRandom = nextRandom;
                      break;
                  }
                  case ControlCommand.CommandType.SeedRandom:
                      let seed = asOrNull(this.state.PopEvaluationStack(), IntValue);
                      if (seed == null || seed instanceof IntValue === false)
                          return this.Error("Invalid value passed to SEED_RANDOM");
                      // Originally a primitive type, but here, can be null.
                      // TODO: Replace by default value?
                      if (seed.value === null) {
                          return throwNullException("minInt.value");
                      }
                      this.state.storySeed = seed.value;
                      this.state.previousRandom = 0;
                      this.state.PushEvaluationStack(new Void());
                      break;
                  case ControlCommand.CommandType.VisitIndex:
                      let count = this.state.VisitCountForContainer(this.state.currentPointer.container) - 1; // index not count
                      this.state.PushEvaluationStack(new IntValue(count));
                      break;
                  case ControlCommand.CommandType.SequenceShuffleIndex:
                      let shuffleIndex = this.NextSequenceShuffleIndex();
                      this.state.PushEvaluationStack(new IntValue(shuffleIndex));
                      break;
                  case ControlCommand.CommandType.StartThread:
                      // Handled in main step function
                      break;
                  case ControlCommand.CommandType.Done:
                      // We may exist in the context of the initial
                      // act of creating the thread, or in the context of
                      // evaluating the content.
                      if (this.state.callStack.canPopThread) {
                          this.state.callStack.PopThread();
                      }
                      // In normal flow - allow safe exit without warning
                      else {
                          this.state.didSafeExit = true;
                          // Stop flow in current thread
                          this.state.currentPointer = Pointer.Null;
                      }
                      break;
                  // Force flow to end completely
                  case ControlCommand.CommandType.End:
                      this.state.ForceEnd();
                      break;
                  case ControlCommand.CommandType.ListFromInt:
                      // var intVal = state.PopEvaluationStack () as IntValue;
                      let intVal = asOrNull(this.state.PopEvaluationStack(), IntValue);
                      // var listNameVal = state.PopEvaluationStack () as StringValue;
                      let listNameVal = asOrThrows(this.state.PopEvaluationStack(), StringValue);
                      if (intVal === null) {
                          throw new StoryException("Passed non-integer when creating a list element from a numerical value.");
                      }
                      let generatedListValue = null;
                      if (this.listDefinitions === null) {
                          return throwNullException("this.listDefinitions");
                      }
                      let foundListDef = this.listDefinitions.TryListGetDefinition(listNameVal.value, null);
                      if (foundListDef.exists) {
                          // Originally a primitive type, but here, can be null.
                          // TODO: Replace by default value?
                          if (intVal.value === null) {
                              return throwNullException("minInt.value");
                          }
                          let foundItem = foundListDef.result.TryGetItemWithValue(intVal.value, InkListItem.Null);
                          if (foundItem.exists) {
                              generatedListValue = new ListValue(foundItem.result, intVal.value);
                          }
                      }
                      else {
                          throw new StoryException("Failed to find LIST called " + listNameVal.value);
                      }
                      if (generatedListValue == null)
                          generatedListValue = new ListValue();
                      this.state.PushEvaluationStack(generatedListValue);
                      break;
                  case ControlCommand.CommandType.ListRange:
                      let max = asOrNull(this.state.PopEvaluationStack(), Value);
                      let min = asOrNull(this.state.PopEvaluationStack(), Value);
                      // var targetList = state.PopEvaluationStack () as ListValue;
                      let targetList = asOrNull(this.state.PopEvaluationStack(), ListValue);
                      if (targetList === null || min === null || max === null)
                          throw new StoryException("Expected list, minimum and maximum for LIST_RANGE");
                      if (targetList.value === null) {
                          return throwNullException("targetList.value");
                      }
                      let result = targetList.value.ListWithSubRange(min.valueObject, max.valueObject);
                      this.state.PushEvaluationStack(new ListValue(result));
                      break;
                  case ControlCommand.CommandType.ListRandom: {
                      let listVal = this.state.PopEvaluationStack();
                      if (listVal === null)
                          throw new StoryException("Expected list for LIST_RANDOM");
                      let list = listVal.value;
                      let newList = null;
                      if (list === null) {
                          throw throwNullException("list");
                      }
                      if (list.Count == 0) {
                          newList = new InkList();
                      }
                      else {
                          // Generate a random index for the element to take
                          let resultSeed = this.state.storySeed + this.state.previousRandom;
                          let random = new PRNG(resultSeed);
                          let nextRandom = random.next();
                          let listItemIndex = nextRandom % list.Count;
                          // This bit is a little different from the original
                          // C# code, since iterators do not work in the same way.
                          // First, we iterate listItemIndex - 1 times, calling next().
                          // The listItemIndex-th time is made outside of the loop,
                          // in order to retrieve the value.
                          let listEnumerator = list.entries();
                          for (let i = 0; i <= listItemIndex - 1; i++) {
                              listEnumerator.next();
                          }
                          let value = listEnumerator.next().value;
                          let randomItem = {
                              Key: InkListItem.fromSerializedKey(value[0]),
                              Value: value[1],
                          };
                          // Origin list is simply the origin of the one element
                          if (randomItem.Key.originName === null) {
                              return throwNullException("randomItem.Key.originName");
                          }
                          newList = new InkList(randomItem.Key.originName, this);
                          newList.Add(randomItem.Key, randomItem.Value);
                          this.state.previousRandom = nextRandom;
                      }
                      this.state.PushEvaluationStack(new ListValue(newList));
                      break;
                  }
                  default:
                      this.Error("unhandled ControlCommand: " + evalCommand);
                      break;
              }
              return true;
          }
          // Variable assignment
          else if (contentObj instanceof VariableAssignment) {
              let varAss = contentObj;
              let assignedVal = this.state.PopEvaluationStack();
              this.state.variablesState.Assign(varAss, assignedVal);
              return true;
          }
          // Variable reference
          else if (contentObj instanceof VariableReference) {
              let varRef = contentObj;
              let foundValue = null;
              // Explicit read count value
              if (varRef.pathForCount != null) {
                  let container = varRef.containerForCount;
                  let count = this.state.VisitCountForContainer(container);
                  foundValue = new IntValue(count);
              }
              // Normal variable reference
              else {
                  foundValue = this.state.variablesState.GetVariableWithName(varRef.name);
                  if (foundValue == null) {
                      this.Warning("Variable not found: '" +
                          varRef.name +
                          "'. Using default value of 0 (false). This can happen with temporary variables if the declaration hasn't yet been hit. Globals are always given a default value on load if a value doesn't exist in the save state.");
                      foundValue = new IntValue(0);
                  }
              }
              this.state.PushEvaluationStack(foundValue);
              return true;
          }
          // Native function call
          else if (contentObj instanceof NativeFunctionCall) {
              let func = contentObj;
              let funcParams = this.state.PopEvaluationStack(func.numberOfParameters);
              let result = func.Call(funcParams);
              this.state.PushEvaluationStack(result);
              return true;
          }
          // No control content, must be ordinary content
          return false;
      }
      ChoosePathString(path, resetCallstack = true, args = []) {
          this.IfAsyncWeCant("call ChoosePathString right now");
          if (this.onChoosePathString !== null)
              this.onChoosePathString(path, args);
          if (resetCallstack) {
              this.ResetCallstack();
          }
          else {
              if (this.state.callStack.currentElement.type == PushPopType.Function) {
                  let funcDetail = "";
                  let container = this.state.callStack.currentElement.currentPointer
                      .container;
                  if (container != null) {
                      funcDetail = "(" + container.path.toString() + ") ";
                  }
                  throw new Error("Story was running a function " +
                      funcDetail +
                      "when you called ChoosePathString(" +
                      path +
                      ") - this is almost certainly not not what you want! Full stack trace: \n" +
                      this.state.callStack.callStackTrace);
              }
          }
          this.state.PassArgumentsToEvaluationStack(args);
          this.ChoosePath(new Path(path));
      }
      IfAsyncWeCant(activityStr) {
          if (this._asyncContinueActive)
              throw new Error("Can't " +
                  activityStr +
                  ". Story is in the middle of a ContinueAsync(). Make more ContinueAsync() calls or a single Continue() call beforehand.");
      }
      ChoosePath(p, incrementingTurnIndex = true) {
          this.state.SetChosenPath(p, incrementingTurnIndex);
          // Take a note of newly visited containers for read counts etc
          this.VisitChangedContainersDueToDivert();
      }
      ChooseChoiceIndex(choiceIdx) {
          choiceIdx = choiceIdx;
          let choices = this.currentChoices;
          this.Assert(choiceIdx >= 0 && choiceIdx < choices.length, "choice out of range");
          let choiceToChoose = choices[choiceIdx];
          if (this.onMakeChoice !== null)
              this.onMakeChoice(choiceToChoose);
          if (choiceToChoose.threadAtGeneration === null) {
              return throwNullException("choiceToChoose.threadAtGeneration");
          }
          if (choiceToChoose.targetPath === null) {
              return throwNullException("choiceToChoose.targetPath");
          }
          this.state.callStack.currentThread = choiceToChoose.threadAtGeneration;
          this.ChoosePath(choiceToChoose.targetPath);
      }
      HasFunction(functionName) {
          try {
              return this.KnotContainerWithName(functionName) != null;
          }
          catch (e) {
              return false;
          }
      }
      EvaluateFunction(functionName, args = [], returnTextOutput = false) {
          // EvaluateFunction behaves slightly differently than the C# version.
          // In C#, you can pass a (second) parameter `out textOutput` to get the
          // text outputted by the function. This is not possible in js. Instead,
          // we maintain the regular signature (functionName, args), plus an
          // optional third parameter returnTextOutput. If set to true, we will
          // return both the textOutput and the returned value, as an object.
          if (this.onEvaluateFunction !== null)
              this.onEvaluateFunction(functionName, args);
          this.IfAsyncWeCant("evaluate a function");
          if (functionName == null) {
              throw new Error("Function is null");
          }
          else if (functionName == "" || functionName.trim() == "") {
              throw new Error("Function is empty or white space.");
          }
          let funcContainer = this.KnotContainerWithName(functionName);
          if (funcContainer == null) {
              throw new Error("Function doesn't exist: '" + functionName + "'");
          }
          let outputStreamBefore = [];
          outputStreamBefore.push(...this.state.outputStream);
          this._state.ResetOutput();
          this.state.StartFunctionEvaluationFromGame(funcContainer, args);
          // Evaluate the function, and collect the string output
          let stringOutput = new StringBuilder();
          while (this.canContinue) {
              stringOutput.Append(this.Continue());
          }
          let textOutput = stringOutput.toString();
          this._state.ResetOutput(outputStreamBefore);
          let result = this.state.CompleteFunctionEvaluationFromGame();
          if (this.onCompleteEvaluateFunction != null)
              this.onCompleteEvaluateFunction(functionName, args, textOutput, result);
          return returnTextOutput ? { returned: result, output: textOutput } : result;
      }
      EvaluateExpression(exprContainer) {
          let startCallStackHeight = this.state.callStack.elements.length;
          this.state.callStack.Push(PushPopType.Tunnel);
          this._temporaryEvaluationContainer = exprContainer;
          this.state.GoToStart();
          let evalStackHeight = this.state.evaluationStack.length;
          this.Continue();
          this._temporaryEvaluationContainer = null;
          // Should have fallen off the end of the Container, which should
          // have auto-popped, but just in case we didn't for some reason,
          // manually pop to restore the state (including currentPath).
          if (this.state.callStack.elements.length > startCallStackHeight) {
              this.state.PopCallStack();
          }
          let endStackHeight = this.state.evaluationStack.length;
          if (endStackHeight > evalStackHeight) {
              return this.state.PopEvaluationStack();
          }
          else {
              return null;
          }
      }
      CallExternalFunction(funcName, numberOfArguments) {
          if (funcName === null) {
              return throwNullException("funcName");
          }
          let funcDef = this._externals.get(funcName);
          let fallbackFunctionContainer = null;
          let foundExternal = typeof funcDef !== "undefined";
          if (foundExternal &&
              !funcDef.lookAheadSafe &&
              this._stateSnapshotAtLastNewline !== null) {
              this._sawLookaheadUnsafeFunctionAfterNewline = true;
              return;
          }
          if (!foundExternal) {
              if (this.allowExternalFunctionFallbacks) {
                  fallbackFunctionContainer = this.KnotContainerWithName(funcName);
                  this.Assert(fallbackFunctionContainer !== null, "Trying to call EXTERNAL function '" +
                      funcName +
                      "' which has not been bound, and fallback ink function could not be found.");
                  // Divert direct into fallback function and we're done
                  this.state.callStack.Push(PushPopType.Function, undefined, this.state.outputStream.length);
                  this.state.divertedPointer = Pointer.StartOf(fallbackFunctionContainer);
                  return;
              }
              else {
                  this.Assert(false, "Trying to call EXTERNAL function '" +
                      funcName +
                      "' which has not been bound (and ink fallbacks disabled).");
              }
          }
          // Pop arguments
          let args = [];
          for (let i = 0; i < numberOfArguments; ++i) {
              // var poppedObj = state.PopEvaluationStack () as Value;
              let poppedObj = asOrThrows(this.state.PopEvaluationStack(), Value);
              let valueObj = poppedObj.valueObject;
              args.push(valueObj);
          }
          // Reverse arguments from the order they were popped,
          // so they're the right way round again.
          args.reverse();
          // Run the function!
          let funcResult = funcDef.function(args);
          // Convert return value (if any) to the a type that the ink engine can use
          let returnObj = null;
          if (funcResult != null) {
              returnObj = Value.Create(funcResult);
              this.Assert(returnObj !== null, "Could not create ink value from returned object of type " +
                  typeof funcResult);
          }
          else {
              returnObj = new Void();
          }
          this.state.PushEvaluationStack(returnObj);
      }
      BindExternalFunctionGeneral(funcName, func, lookaheadSafe) {
          this.IfAsyncWeCant("bind an external function");
          this.Assert(!this._externals.has(funcName), "Function '" + funcName + "' has already been bound.");
          this._externals.set(funcName, {
              function: func,
              lookAheadSafe: lookaheadSafe,
          });
      }
      TryCoerce(value) {
          // We're skipping type coercition in this implementation. First of, js
          // is loosely typed, so it's not that important. Secondly, there is no
          // clean way (AFAIK) for the user to describe what type of parameters
          // they expect.
          return value;
      }
      BindExternalFunction(funcName, func, lookaheadSafe) {
          this.Assert(func != null, "Can't bind a null function");
          this.BindExternalFunctionGeneral(funcName, (args) => {
              this.Assert(args.length >= func.length, "External function expected " + func.length + " arguments");
              let coercedArgs = [];
              for (let i = 0, l = args.length; i < l; i++) {
                  coercedArgs[i] = this.TryCoerce(args[i]);
              }
              return func.apply(null, coercedArgs);
          }, lookaheadSafe);
      }
      UnbindExternalFunction(funcName) {
          this.IfAsyncWeCant("unbind an external a function");
          this.Assert(this._externals.has(funcName), "Function '" + funcName + "' has not been bound.");
          this._externals.delete(funcName);
      }
      ValidateExternalBindings() {
          let c = null;
          let o = null;
          let missingExternals = arguments[1] || new Set();
          if (arguments[0] instanceof Container) {
              c = arguments[0];
          }
          if (arguments[0] instanceof InkObject) {
              o = arguments[0];
          }
          if (c === null && o === null) {
              this.ValidateExternalBindings(this._mainContentContainer, missingExternals);
              this._hasValidatedExternals = true;
              // No problem! Validation complete
              if (missingExternals.size == 0) {
                  this._hasValidatedExternals = true;
              }
              else {
                  let message = "Error: Missing function binding for external";
                  message += missingExternals.size > 1 ? "s" : "";
                  message += ": '";
                  message += Array.from(missingExternals).join("', '");
                  message += "' ";
                  message += this.allowExternalFunctionFallbacks
                      ? ", and no fallback ink function found."
                      : " (ink fallbacks disabled)";
                  this.Error(message);
              }
          }
          else if (c != null) {
              for (let innerContent of c.content) {
                  let container = innerContent;
                  if (container == null || !container.hasValidName)
                      this.ValidateExternalBindings(innerContent, missingExternals);
              }
              for (let [, value] of c.namedContent) {
                  this.ValidateExternalBindings(asOrNull(value, InkObject), missingExternals);
              }
          }
          else if (o != null) {
              let divert = asOrNull(o, Divert);
              if (divert && divert.isExternal) {
                  let name = divert.targetPathString;
                  if (name === null) {
                      return throwNullException("name");
                  }
                  if (!this._externals.has(name)) {
                      if (this.allowExternalFunctionFallbacks) {
                          let fallbackFound = this.mainContentContainer.namedContent.has(name);
                          if (!fallbackFound) {
                              missingExternals.add(name);
                          }
                      }
                      else {
                          missingExternals.add(name);
                      }
                  }
              }
          }
      }
      ObserveVariable(variableName, observer) {
          this.IfAsyncWeCant("observe a new variable");
          if (this._variableObservers === null)
              this._variableObservers = new Map();
          if (!this.state.variablesState.GlobalVariableExistsWithName(variableName))
              throw new Error("Cannot observe variable '" +
                  variableName +
                  "' because it wasn't declared in the ink story.");
          if (this._variableObservers.has(variableName)) {
              this._variableObservers.get(variableName).push(observer);
          }
          else {
              this._variableObservers.set(variableName, [observer]);
          }
      }
      ObserveVariables(variableNames, observers) {
          for (let i = 0, l = variableNames.length; i < l; i++) {
              this.ObserveVariable(variableNames[i], observers[i]);
          }
      }
      RemoveVariableObserver(observer, specificVariableName) {
          // A couple of things to know about this method:
          //
          // 1. Since `RemoveVariableObserver` is exposed to the JavaScript world,
          //    optionality is marked as `undefined` rather than `null`.
          //    To keep things simple, null-checks are performed using regular
          //    equality operators, where undefined == null.
          //
          // 2. Since C# delegates are translated to arrays of functions,
          //    -= becomes a call to splice and null-checks are replaced by
          //    emptiness-checks.
          //
          this.IfAsyncWeCant("remove a variable observer");
          if (this._variableObservers === null)
              return;
          if (specificVariableName != null) {
              if (this._variableObservers.has(specificVariableName)) {
                  if (observer != null) {
                      let variableObservers = this._variableObservers.get(specificVariableName);
                      if (variableObservers != null) {
                          variableObservers.splice(variableObservers.indexOf(observer), 1);
                          if (variableObservers.length === 0) {
                              this._variableObservers.delete(specificVariableName);
                          }
                      }
                  }
                  else {
                      this._variableObservers.delete(specificVariableName);
                  }
              }
          }
          else if (observer != null) {
              let keys = this._variableObservers.keys();
              for (let varName of keys) {
                  let variableObservers = this._variableObservers.get(varName);
                  if (variableObservers != null) {
                      variableObservers.splice(variableObservers.indexOf(observer), 1);
                      if (variableObservers.length === 0) {
                          this._variableObservers.delete(varName);
                      }
                  }
              }
          }
      }
      VariableStateDidChangeEvent(variableName, newValueObj) {
          if (this._variableObservers === null)
              return;
          let observers = this._variableObservers.get(variableName);
          if (typeof observers !== "undefined") {
              if (!(newValueObj instanceof Value)) {
                  throw new Error("Tried to get the value of a variable that isn't a standard type");
              }
              // var val = newValueObj as Value;
              let val = asOrThrows(newValueObj, Value);
              for (let observer of observers) {
                  observer(variableName, val.valueObject);
              }
          }
      }
      get globalTags() {
          return this.TagsAtStartOfFlowContainerWithPathString("");
      }
      TagsForContentAtPath(path) {
          return this.TagsAtStartOfFlowContainerWithPathString(path);
      }
      TagsAtStartOfFlowContainerWithPathString(pathString) {
          let path = new Path(pathString);
          let flowContainer = this.ContentAtPath(path).container;
          if (flowContainer === null) {
              return throwNullException("flowContainer");
          }
          while (true) {
              let firstContent = flowContainer.content[0];
              if (firstContent instanceof Container)
                  flowContainer = firstContent;
              else
                  break;
          }
          let tags = null;
          for (let c of flowContainer.content) {
              // var tag = c as Runtime.Tag;
              let tag = asOrNull(c, Tag);
              if (tag) {
                  if (tags == null)
                      tags = [];
                  tags.push(tag.text);
              }
              else
                  break;
          }
          return tags;
      }
      BuildStringOfHierarchy() {
          let sb = new StringBuilder();
          this.mainContentContainer.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());
          return sb.toString();
      }
      BuildStringOfContainer(container) {
          let sb = new StringBuilder();
          container.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());
          return sb.toString();
      }
      NextContent() {
          this.state.previousPointer = this.state.currentPointer.copy();
          if (!this.state.divertedPointer.isNull) {
              this.state.currentPointer = this.state.divertedPointer.copy();
              this.state.divertedPointer = Pointer.Null;
              this.VisitChangedContainersDueToDivert();
              if (!this.state.currentPointer.isNull) {
                  return;
              }
          }
          let successfulPointerIncrement = this.IncrementContentPointer();
          if (!successfulPointerIncrement) {
              let didPop = false;
              if (this.state.callStack.CanPop(PushPopType.Function)) {
                  this.state.PopCallStack(PushPopType.Function);
                  if (this.state.inExpressionEvaluation) {
                      this.state.PushEvaluationStack(new Void());
                  }
                  didPop = true;
              }
              else if (this.state.callStack.canPopThread) {
                  this.state.callStack.PopThread();
                  didPop = true;
              }
              else {
                  this.state.TryExitFunctionEvaluationFromGame();
              }
              if (didPop && !this.state.currentPointer.isNull) {
                  this.NextContent();
              }
          }
      }
      IncrementContentPointer() {
          let successfulIncrement = true;
          let pointer = this.state.callStack.currentElement.currentPointer.copy();
          pointer.index++;
          if (pointer.container === null) {
              return throwNullException("pointer.container");
          }
          while (pointer.index >= pointer.container.content.length) {
              successfulIncrement = false;
              // Container nextAncestor = pointer.container.parent as Container;
              let nextAncestor = asOrNull(pointer.container.parent, Container);
              if (nextAncestor instanceof Container === false) {
                  break;
              }
              let indexInAncestor = nextAncestor.content.indexOf(pointer.container);
              if (indexInAncestor == -1) {
                  break;
              }
              pointer = new Pointer(nextAncestor, indexInAncestor);
              pointer.index++;
              successfulIncrement = true;
              if (pointer.container === null) {
                  return throwNullException("pointer.container");
              }
          }
          if (!successfulIncrement)
              pointer = Pointer.Null;
          this.state.callStack.currentElement.currentPointer = pointer.copy();
          return successfulIncrement;
      }
      TryFollowDefaultInvisibleChoice() {
          let allChoices = this._state.currentChoices;
          let invisibleChoices = allChoices.filter((c) => c.isInvisibleDefault);
          if (invisibleChoices.length == 0 ||
              allChoices.length > invisibleChoices.length)
              return false;
          let choice = invisibleChoices[0];
          if (choice.targetPath === null) {
              return throwNullException("choice.targetPath");
          }
          if (choice.threadAtGeneration === null) {
              return throwNullException("choice.threadAtGeneration");
          }
          this.state.callStack.currentThread = choice.threadAtGeneration;
          if (this._stateSnapshotAtLastNewline !== null) {
              this.state.callStack.currentThread = this.state.callStack.ForkThread();
          }
          this.ChoosePath(choice.targetPath, false);
          return true;
      }
      NextSequenceShuffleIndex() {
          // var numElementsIntVal = state.PopEvaluationStack () as IntValue;
          let numElementsIntVal = asOrNull(this.state.PopEvaluationStack(), IntValue);
          if (!(numElementsIntVal instanceof IntValue)) {
              this.Error("expected number of elements in sequence for shuffle index");
              return 0;
          }
          let seqContainer = this.state.currentPointer.container;
          if (seqContainer === null) {
              return throwNullException("seqContainer");
          }
          // Originally a primitive type, but here, can be null.
          // TODO: Replace by default value?
          if (numElementsIntVal.value === null) {
              return throwNullException("numElementsIntVal.value");
          }
          let numElements = numElementsIntVal.value;
          // var seqCountVal = state.PopEvaluationStack () as IntValue;
          let seqCountVal = asOrThrows(this.state.PopEvaluationStack(), IntValue);
          let seqCount = seqCountVal.value;
          // Originally a primitive type, but here, can be null.
          // TODO: Replace by default value?
          if (seqCount === null) {
              return throwNullException("seqCount");
          }
          let loopIndex = seqCount / numElements;
          let iterationIndex = seqCount % numElements;
          let seqPathStr = seqContainer.path.toString();
          let sequenceHash = 0;
          for (let i = 0, l = seqPathStr.length; i < l; i++) {
              sequenceHash += seqPathStr.charCodeAt(i) || 0;
          }
          let randomSeed = sequenceHash + loopIndex + this.state.storySeed;
          let random = new PRNG(Math.floor(randomSeed));
          let unpickedIndices = [];
          for (let i = 0; i < numElements; ++i) {
              unpickedIndices.push(i);
          }
          for (let i = 0; i <= iterationIndex; ++i) {
              let chosen = random.next() % unpickedIndices.length;
              let chosenIndex = unpickedIndices[chosen];
              unpickedIndices.splice(chosen, 1);
              if (i == iterationIndex) {
                  return chosenIndex;
              }
          }
          throw new Error("Should never reach here");
      }
      Error(message, useEndLineNumber = false) {
          let e = new StoryException(message);
          e.useEndLineNumber = useEndLineNumber;
          throw e;
      }
      Warning(message) {
          this.AddError(message, true);
      }
      AddError(message, isWarning = false, useEndLineNumber = false) {
          let dm = this.currentDebugMetadata;
          let errorTypeStr = isWarning ? "WARNING" : "ERROR";
          if (dm != null) {
              let lineNum = useEndLineNumber ? dm.endLineNumber : dm.startLineNumber;
              message =
                  "RUNTIME " +
                      errorTypeStr +
                      ": '" +
                      dm.fileName +
                      "' line " +
                      lineNum +
                      ": " +
                      message;
          }
          else if (!this.state.currentPointer.isNull) {
              message =
                  "RUNTIME " +
                      errorTypeStr +
                      ": (" +
                      this.state.currentPointer +
                      "): " +
                      message;
          }
          else {
              message = "RUNTIME " + errorTypeStr + ": " + message;
          }
          this.state.AddError(message, isWarning);
          // In a broken state don't need to know about any other errors.
          if (!isWarning)
              this.state.ForceEnd();
      }
      Assert(condition, message = null) {
          if (condition == false) {
              if (message == null) {
                  message = "Story assert";
              }
              throw new Error(message + " " + this.currentDebugMetadata);
          }
      }
      get currentDebugMetadata() {
          let dm;
          let pointer = this.state.currentPointer;
          if (!pointer.isNull && pointer.Resolve() !== null) {
              dm = pointer.Resolve().debugMetadata;
              if (dm !== null) {
                  return dm;
              }
          }
          for (let i = this.state.callStack.elements.length - 1; i >= 0; --i) {
              pointer = this.state.callStack.elements[i].currentPointer;
              if (!pointer.isNull && pointer.Resolve() !== null) {
                  dm = pointer.Resolve().debugMetadata;
                  if (dm !== null) {
                      return dm;
                  }
              }
          }
          for (let i = this.state.outputStream.length - 1; i >= 0; --i) {
              let outputObj = this.state.outputStream[i];
              dm = outputObj.debugMetadata;
              if (dm !== null) {
                  return dm;
              }
          }
          return null;
      }
      get mainContentContainer() {
          if (this._temporaryEvaluationContainer) {
              return this._temporaryEvaluationContainer;
          }
          else {
              return this._mainContentContainer;
          }
      }
  }
  Story.inkVersionCurrent = 20;
  (function (Story) {
      (function (OutputStateChange) {
          OutputStateChange[OutputStateChange["NoChange"] = 0] = "NoChange";
          OutputStateChange[OutputStateChange["ExtendedBeyondNewline"] = 1] = "ExtendedBeyondNewline";
          OutputStateChange[OutputStateChange["NewlineRemoved"] = 2] = "NewlineRemoved";
      })(Story.OutputStateChange || (Story.OutputStateChange = {}));
  })(Story || (Story = {}));

  exports.InkList = InkList;
  exports.Story = Story;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
